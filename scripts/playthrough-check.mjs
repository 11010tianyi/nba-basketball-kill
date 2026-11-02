import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const port = Number(process.env.PORT || 4187);
const chromePath = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";
const root = new URL("..", import.meta.url).pathname;

const children = [];
const cleanups = [];

function track(child) {
  children.push(child);
  return child;
}

async function cleanup() {
  for (const fn of cleanups.reverse()) {
    try {
      await fn();
    } catch {
      // 清理失败不掩盖原来的测试结果。
    }
  }
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function startServer() {
  const child = track(spawn(process.execPath, ["server.mjs"], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  }));
  let log = "";
  child.stdout.on("data", (chunk) => {
    log += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    log += chunk.toString();
  });
  child.on("exit", (code) => {
    if (code && code !== 0 && code !== 143) log += `\nserver exit ${code}`;
  });
  return {
    child,
    async ready() {
      const started = Date.now();
      while (Date.now() - started < 8000) {
        try {
          const response = await fetch(`http://127.0.0.1:${port}/`);
          if (response.ok) return;
        } catch {
          // 端口还没听。
        }
        if (child.exitCode !== null) throw new Error(`服务器提前退出：${log}`);
        await delay(100);
      }
      throw new Error(`服务器没有在 8 秒内启动：${log}`);
    },
  };
}

function encodeClientFrame(opcode, text, fin = true) {
  const payload = Buffer.from(text);
  const mask = randomBytes(4);
  const first = (fin ? 0x80 : 0x00) | opcode;
  let header;
  if (payload.length < 126) header = Buffer.from([first, 0x80 | payload.length]);
  else {
    header = Buffer.alloc(4);
    header[0] = first;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  }
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i += 1) masked[i] = payload[i] ^ mask[i % 4];
  return Buffer.concat([header, mask, masked]);
}

function readServerFrame(buffer) {
  if (buffer.length < 2) return null;
  const opcode = buffer[0] & 0x0f;
  let offset = 2;
  let length = buffer[1] & 0x7f;
  if (length === 126) {
    if (buffer.length < 4) return null;
    length = buffer.readUInt16BE(2);
    offset = 4;
  }
  if (buffer.length < offset + length) return null;
  return {
    opcode,
    payload: buffer.subarray(offset, offset + length),
    rest: buffer.subarray(offset + length),
  };
}

function connectRaw() {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, "127.0.0.1");
    const key = randomBytes(16).toString("base64");
    const expected = createHash("sha1").update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest("base64");
    let buf = Buffer.alloc(0);
    const fail = (error) => {
      socket.destroy();
      reject(error);
    };
    socket.on("error", fail);
    socket.on("data", function onData(chunk) {
      buf = Buffer.concat([buf, chunk]);
      const headerEnd = buf.indexOf("\r\n\r\n");
      if (headerEnd < 0) return;
      const header = buf.subarray(0, headerEnd).toString();
      if (!header.includes("101") || !header.includes(expected)) {
        fail(new Error(`握手失败：${header}`));
        return;
      }
      socket.off("data", onData);
      resolve({ socket, rest: buf.subarray(headerEnd + 4) });
    });
    socket.write([
      "GET /room HTTP/1.1",
      "Host: 127.0.0.1",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Key: ${key}`,
      "Sec-WebSocket-Version: 13",
      "",
      "",
    ].join("\r\n"));
  });
}

async function readOneFrame(socket, initial = Buffer.alloc(0)) {
  let buf = initial;
  const immediate = readServerFrame(buf);
  if (immediate) return immediate;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("等待服务器帧超时")), 3000);
    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const frame = readServerFrame(buf);
      if (!frame) return;
      clearTimeout(timer);
      socket.off("data", onData);
      resolve(frame);
    };
    socket.on("data", onData);
  });
}

async function testLanProtocol() {
  const host = new WebSocket(`ws://127.0.0.1:${port}/room`);
  const guest = new WebSocket(`ws://127.0.0.1:${port}/room`);
  const hostMessages = [];
  const guestMessages = [];
  host.addEventListener("message", (event) => hostMessages.push(JSON.parse(event.data)));
  guest.addEventListener("message", (event) => guestMessages.push(JSON.parse(event.data)));
  await Promise.all([waitOpen(host), waitOpen(guest)]);
  host.send(JSON.stringify({ type: "create", clientId: "host-play-1", playerCount: 4, selectedRosterId: "curry" }));
  const created = await waitFor(hostMessages, (message) => message.type === "room-created");
  assert(created.room?.code, "创建房间没有返回房间码");
  guest.send(JSON.stringify({ type: "join", clientId: "guest-play-1", code: created.room.code, rosterId: "yao" }));
  const joined = await waitFor(guestMessages, (message) => message.type === "room-joined");
  assert(joined.room.players.length === 2, "加入后房间人数不是 2");
  guest.send(JSON.stringify({ type: "ready", clientId: "guest-play-1", code: created.room.code, ready: true, rosterId: "yao" }));
  await waitFor(hostMessages, (message) => message.type === "room-update" && message.room.players.every((player) => player.ready));
  host.send(JSON.stringify({ type: "start", clientId: "host-play-1", code: created.room.code }));
  const started = await waitFor(guestMessages, (message) => message.type === "room-start");
  assert(started.room.started === true, "房客没有收到开球");
  guest.send(JSON.stringify({ type: "join", clientId: "late-play-1", code: created.room.code, rosterId: "kobe" }));
  const rejected = await waitFor(guestMessages, (message) => message.type === "error");
  assert(rejected.message.includes("开球"), "开球后仍允许新玩家加入");
  host.close();
  guest.close();

  const ping = await connectRaw();
  cleanups.push(() => ping.socket.end());
  ping.socket.write(encodeClientFrame(0x9, "hi"));
  const pong = await readOneFrame(ping.socket, ping.rest);
  assert(pong.opcode === 0x0a, `ping 没有回 pong，opcode=${pong.opcode}`);
  assert(pong.payload.toString() === "hi", "pong 没有回显 ping 内容");
  ping.socket.end();

  const frag = await connectRaw();
  cleanups.push(() => frag.socket.end());
  const json = JSON.stringify({ type: "create", clientId: "frag-play-1", playerCount: 4, selectedRosterId: "lebron" });
  const cut = Math.max(8, Math.floor(json.length / 2));
  frag.socket.write(encodeClientFrame(0x1, json.slice(0, cut), false));
  frag.socket.write(encodeClientFrame(0x0, json.slice(cut), true));
  const reply = await readOneFrame(frag.socket, frag.rest);
  const payload = JSON.parse(reply.payload.toString());
  assert(payload.type === "room-created", `拆帧创建房间失败：${reply.payload.toString()}`);
  frag.socket.end();
}

function waitOpen(socket) {
  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", () => reject(new Error("房间 WebSocket 连接失败")), { once: true });
  });
}

async function waitFor(list, predicate) {
  const started = Date.now();
  while (Date.now() - started < 4000) {
    const found = list.find(predicate);
    if (found) return found;
    await delay(30);
  }
  throw new Error(`没有等到期望消息：${JSON.stringify(list)}`);
}

async function testFullGame() {
  const debugPort = port + 100;
  const profile = mkdtempSync(join(tmpdir(), "nba-kill-chrome-"));
  cleanups.push(() => {
    rmSync(profile, { recursive: true, force: true });
  });
  const chrome = track(spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--mute-audio",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" }));
  let version;
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) {
        version = await response.json();
        break;
      }
    } catch {
      // Chrome 还在起来。
    }
    await delay(100);
  }
  assert(version?.webSocketDebuggerUrl, "没有连上 Chrome 调试端口");
  const browser = new WebSocket(version.webSocketDebuggerUrl);
  await waitOpen(browser);
  const client = createCdp(browser);
  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });
  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);
  await client.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__errors = [];
      window.addEventListener("error", (event) => window.__errors.push(String(event.message || "error")));
      const originalSetTimeout = window.setTimeout.bind(window);
      window.setTimeout = (fn, delay, ...args) => originalSetTimeout(fn, Math.max(0, Math.round((Number(delay) || 0) / 10)), ...args);
      class FakeNode { connect() { return this; } start() {} stop() {} }
      class FakeParam { setValueAtTime() {} exponentialRampToValueAtTime() {} }
      window.AudioContext = class {
        constructor() { this.state = "running"; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; }
        resume() { return Promise.resolve(); }
        createOscillator() { return { type: "sine", frequency: new FakeParam(), connect() { return new FakeNode(); }, start() {}, stop() {} }; }
        createGain() { return { gain: new FakeParam(), connect() { return new FakeNode(); } }; }
        createBuffer() { return { getChannelData() { return new Float32Array(8); } }; }
        createBufferSource() { const node = new FakeNode(); node.buffer = null; return node; }
        createBiquadFilter() { return { type: "lowpass", frequency: new FakeParam(), Q: new FakeParam(), connect() { return new FakeNode(); } }; }
      };
      window.webkitAudioContext = window.AudioContext;
      window.Audio = class {
        constructor() { this.volume = 1; this.preload = "auto"; }
        play() { return Promise.resolve(); }
        pause() {}
        cloneNode() { return new window.Audio(); }
      };
    `,
  }, sessionId);
  const gameUrl = `http://127.0.0.1:${port}/?autostart=1&aiSpeed=instant&aiLevel=rookie&players=4&avatar=classic`;
  await client.send("Page.navigate", { url: gameUrl }, sessionId);
  await delay(300);
  await evaluate(client, sessionId, `(() => {
    if (window.__autoPlay) return "already";
    const click = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return false;
      node.click();
      return true;
    };
    window.__humanActs = 0;
    window.__autoPlay = setInterval(() => {
      if (document.querySelector("#endModal.active")) return;
      if (click("#responsePanel.active [data-response-pass]")) return;
      const discardButtons = [...document.querySelectorAll("#hand .discard-selectable:not(.discard-selected), #hand .equip-discard:not(.discard-selected)")];
      const endBtn = document.querySelector("#endTurnBtn");
      if (endBtn && !endBtn.disabled && endBtn.textContent.includes("确认弃置")) {
        endBtn.click();
        return;
      }
      if (discardButtons.length) {
        discardButtons[0].click();
        return;
      }
      if (click("#playerGrid .player-seat.targetable")) {
        window.__humanActs += 1;
        return;
      }
      const selected = document.querySelector("#hand .action-card.selected-card");
      if (selected) {
        selected.click();
        return;
      }
      const phase = document.querySelector("#phaseLabel")?.textContent || "";
      if (phase !== "出牌") window.__humanActs = 0;
      if (phase === "出牌" && window.__humanActs >= 1 && endBtn && !endBtn.disabled) {
        endBtn.click();
        window.__humanActs = 0;
        return;
      }
      const playable = [...document.querySelectorAll("#hand .action-card")].find((card) => !card.classList.contains("disabled"));
      if (playable && window.__humanActs < 1) {
        playable.click();
        window.__humanActs += 1;
        return;
      }
      if (endBtn && !endBtn.disabled) {
        endBtn.click();
        window.__humanActs = 0;
      }
    }, 40);
    return "started";
  })()`);
  const deadline = Date.now() + Number(process.env.PLAY_DEADLINE_MS || 90000);
  let last = null;
  let lastPrint = 0;
  while (Date.now() < deadline) {
    last = await evaluate(client, sessionId, `(() => ({
      phase: document.querySelector("#phaseLabel")?.textContent || "",
      over: Boolean(document.querySelector("#endModal.active")),
      summary: document.querySelector("#endSummary")?.textContent || "",
      log: document.querySelector("#log")?.innerText?.split("\\n").slice(0, 6).join(" | ") || "",
      errors: window.__errors || [],
      startOpen: Boolean(document.querySelector("#startModal.active")),
      endDisabled: Boolean(document.querySelector("#endTurnBtn")?.disabled),
      endText: document.querySelector("#endTurnBtn")?.textContent || "",
      response: document.querySelector("#responsePanel")?.className || "",
      tip: document.querySelector("#coachTip")?.textContent || "",
      hand: document.querySelectorAll("#hand .action-card").length,
      selected: Boolean(document.querySelector("#hand .selected-card")),
      targets: document.querySelectorAll("#playerGrid .targetable").length,
    }))()`);
    if (process.env.PLAY_DEBUG && Date.now() - lastPrint > 4000) {
      lastPrint = Date.now();
      console.log(`进度 阶段=${last.phase} 结束按钮=${last.endText}/${last.endDisabled} 手牌=${last.hand} 选中=${last.selected} 目标=${last.targets} 响应=${last.response} 提示=${last.tip} 日志=${last.log}`);
    }
    if (last.over && last.summary) break;
    await delay(200);
  }
  const realErrors = (last?.errors || []).filter((message) => !/Audio|play\(\)|NotAllowed/i.test(message));
  assert(last?.over, `没有在时限内打完一局。阶段=${last?.phase} 开局弹窗=${last?.startOpen} 结束按钮=${last?.endText} 日志=${last?.log} 错误=${realErrors.join(";")}`);
  assert(last.summary.length > 0, "终场弹窗没有结果文案");
  assert(/终场|获胜/.test(last.log + last.summary), `终场文案异常：${last.summary} / ${last.log}`);
  assert(realErrors.length === 0, `页面脚本报错：${realErrors.join(";")}`);
  browser.close();
  return last.summary;
}

function createCdp(ws) {
  let seq = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result || {});
  });
  return {
    send(method, params = {}, sessionId) {
      const id = ++seq;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`CDP 超时：${method}`));
        }, 8000);
        const finish = (fn, value) => {
          clearTimeout(timer);
          fn(value);
        };
        pending.set(id, {
          resolve: (value) => finish(resolve, value),
          reject: (error) => finish(reject, error),
        });
        ws.send(JSON.stringify({ id, method, params, sessionId }));
      });
    },
  };
}

async function evaluate(client, sessionId, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  }, sessionId);
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || JSON.stringify(result.exceptionDetails));
  }
  return result.result?.value;
}

try {
  const server = startServer();
  await server.ready();
  await testLanProtocol();
  console.log("局域网房间：创建、加入、准备、开球、拒绝迟到加入、ping/pong、拆帧，均通过。");
  const summary = await testFullGame();
  console.log(`单机对局已终场：${summary}`);
  await cleanup();
  process.exit(0);
} catch (error) {
  console.error(error?.stack || error);
  await cleanup();
  process.exit(1);
}

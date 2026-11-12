import { spawn } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const artifacts = process.env.LAYOUT_ARTIFACTS || "/opt/cursor/artifacts";
mkdirSync(artifacts, { recursive: true });

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const body = readFileSync(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("missing");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const origin = `http://127.0.0.1:${port}`;

const profile = "/tmp/chrome-phone-layout";
rmSync(profile, { recursive: true, force: true });
mkdirSync(profile, { recursive: true });
const chromeBin = "/usr/local/bin/google-chrome";
const chrome = spawn(chromeBin, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--hide-scrollbars",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

let debugPort = 0;
for (let i = 0; i < 80 && !debugPort; i += 1) {
  try {
    debugPort = Number(readFileSync(`${profile}/DevToolsActivePort`, "utf8").split("\n")[0]);
  } catch {
    await sleep(100);
  }
}
if (!debugPort) {
  chrome.kill();
  throw new Error("Chrome did not open a DevTools port");
}

let version = null;
for (let i = 0; i < 50 && !version; i += 1) {
  try {
    version = await fetch(`http://127.0.0.1:${debugPort}/json/version`).then((r) => r.json());
  } catch {
    await sleep(100);
  }
}
if (!version?.webSocketDebuggerUrl) throw new Error(`Chrome DevTools did not answer on ${debugPort}`);
const browser = new WebSocket(version.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
await new Promise((resolve, reject) => {
  browser.addEventListener("open", resolve, { once: true });
  browser.addEventListener("error", reject, { once: true });
});
browser.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(`${msg.error.message || JSON.stringify(msg.error)}`));
    else resolve(msg.result);
  }
});
function send(method, params = {}, sessionId) {
  const id = ++seq;
  const payload = { id, method, params };
  if (sessionId) payload.sessionId = sessionId;
  browser.send(JSON.stringify(payload));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const failures = [];
function check(name, ok, detail) {
  const row = { name, ok: Boolean(ok), detail };
  if (!ok) failures.push(row);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  return row;
}

const SNAPSHOT = `(() => {
  const page = document.querySelector("#stage")?.contentDocument || document;
  const frame = document.querySelector("#stage");
  const view = page.defaultView || window;
  if (!page.querySelector || !page.querySelector(".game-shell")) return { ready: false };
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  };
  const inside = (inner, outer, pad = 2) => Boolean(inner && outer)
    && inner.left >= outer.left - pad && inner.top >= outer.top - pad
    && inner.right <= outer.right + pad && inner.bottom <= outer.bottom + pad
    && inner.w > 0 && inner.h > 0;
  const viewport = { left: 0, top: 0, right: view.innerWidth, bottom: view.innerHeight, w: view.innerWidth, h: view.innerHeight };
  const arena = page.querySelector(".arena");
  const arenaBox = box(arena);
  const seats = [...page.querySelectorAll(".player-seat:not(.center)")].filter((el) => el.getClientRects().length).map((seat) => {
    const name = seat.querySelector(".player-name");
    const skill = seat.querySelector(".skill-text");
    const hp = seat.querySelector(".hp-row");
    const nameBox = box(name);
    const skillBox = box(skill);
    const hpBox = box(hp);
    return {
      name: (name?.textContent || "").trim(),
      skill: (skill?.textContent || "").trim(),
      nameInside: inside(nameBox, arenaBox),
      skillInside: inside(skillBox, arenaBox),
      hpInside: inside(hpBox, arenaBox),
      nameOnStage: inside(nameBox, viewport),
      skillH: skillBox?.h || 0,
      hpH: hpBox?.h || 0,
      ellipsis: name ? view.getComputedStyle(name).textOverflow === "ellipsis" && name.scrollWidth > name.clientWidth + 2 : false,
    };
  });
  const handBox = box(page.querySelector("#hand"));
  const cards = [...page.querySelectorAll("#hand .action-card")].map((card) => {
    const title = card.querySelector(".card-title");
    const desc = card.querySelector(".card-desc");
    const cardBox = box(card);
    const titleBox = box(title);
    const descBox = box(desc);
    return {
      id: card.dataset.cardId || "",
      type: card.dataset.cardType || "",
      disabled: card.classList.contains("disabled"),
      selected: card.classList.contains("selected-card"),
      title: (title?.textContent || "").trim(),
      titleInside: inside(titleBox, handBox) && inside(titleBox, viewport),
      descInside: inside(descBox, handBox) && inside(descBox, viewport),
      center: titleBox ? { x: (titleBox.left + titleBox.right) / 2, y: (titleBox.top + titleBox.bottom) / 2 } : (cardBox ? { x: (cardBox.left + cardBox.right) / 2, y: (cardBox.top + cardBox.bottom) / 2 } : null),
    };
  });
  const response = page.querySelector("#responsePanel");
  const responseButtons = [...page.querySelectorAll("#responsePanel button")].map((button) => ({
    text: (button.textContent || "").trim().slice(0, 24),
    inside: inside(box(button), viewport),
  }));
  const endButtons = [...page.querySelectorAll("#endModal .end-actions button")].map((button) => ({
    text: (button.textContent || "").trim(),
    inside: inside(box(button), viewport),
  }));
  const fr = frame ? frame.getBoundingClientRect() : null;
  return {
    ready: true,
    href: view.location.href,
    inner: [view.innerWidth, view.innerHeight],
    shortQuery: view.matchMedia("(orientation: landscape) and (max-height: 520px)").matches,
    narrowQuery: view.matchMedia("(max-width: 1180px), (pointer: coarse) and (max-width: 1366px)").matches,
    nativeShell: page.documentElement.classList.contains("native-shell"),
    lanOption: Boolean(page.querySelector('#playModeSelect option[value="lan"]')),
    startOpen: page.querySelector("#startModal")?.classList.contains("active") || false,
    settingsOpen: page.querySelector("#settingsModal")?.classList.contains("active") || false,
    helpOpen: page.querySelector("#rulesModal")?.classList.contains("active") || false,
    endOpen: page.querySelector("#endModal")?.classList.contains("active") || false,
    responseOpen: response?.classList.contains("active") || false,
    responseText: (response?.textContent || "").trim().slice(0, 80),
    ourTurn: Boolean(page.querySelector("#endTurnBtn") && !page.querySelector("#endTurnBtn").disabled),
    endTurnText: (page.querySelector("#endTurnBtn")?.textContent || "").trim().slice(0, 24),
    handCount: cards.length,
    arena: arenaBox,
    score: box(page.querySelector(".scoreboard")),
    bench: box(page.querySelector(".bench")),
    side: box(page.querySelector(".side-panel")),
    shell: fr ? { left: fr.left, top: fr.top, width: fr.width, height: fr.height, right: fr.right, bottom: fr.bottom } : null,
    outer: frame ? [window.innerWidth, window.innerHeight] : [view.innerWidth, view.innerHeight],
    seats,
    cards,
    responseButtons,
    endButtons,
    startInside: inside(box(page.querySelector("#startBtn")), viewport),
    rotateGate: view.getComputedStyle(page.querySelector(".rotate-gate")).display !== "none",
  };
})()`;

async function openPage({ width, height, url, mobile }) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: Boolean(mobile), screenWidth: width, screenHeight: height,
  }, sessionId);
  await send("Emulation.setTouchEmulationEnabled", { enabled: Boolean(mobile) }, sessionId);
  try { await send("Emulation.setFocusEmulationEnabled", { enabled: true }, sessionId); } catch { /* older headless */ }
  try { await send("Page.bringToFront", {}, sessionId); } catch { /* already in front */ }
  await send("Page.navigate", { url }, sessionId);
  return { targetId, sessionId, width, height };
}

async function snapshot(session) {
  const result = await send("Runtime.evaluate", { expression: SNAPSHOT, returnByValue: true }, session.sessionId);
  return result.result?.value || { ready: false };
}

async function waitFor(session, predicate, timeoutMs, label) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeoutMs) {
    last = await snapshot(session);
    if (last?.ready && predicate(last)) return last;
    await sleep(200);
  }
  check(label, false, `timed out after ${timeoutMs}ms, last=${JSON.stringify({
    ready: last?.ready, inner: last?.inner, hand: last?.handCount, start: last?.startOpen,
    response: last?.responseOpen, end: last?.endOpen, ourTurn: last?.ourTurn,
  })}`);
  return last;
}

async function shot(session, filename) {
  const image = await send("Page.captureScreenshot", { format: "png" }, session.sessionId);
  const path = join(artifacts, filename);
  writeFileSync(path, Buffer.from(image.data, "base64"));
  return path;
}

async function iframeCenter(session, selector) {
  const result = await send("Runtime.evaluate", {
    expression: `(() => {
      const doc = document.querySelector("#stage")?.contentDocument || document;
      const el = doc.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 };
    })()`,
    returnByValue: true,
  }, session.sessionId);
  return result.result?.value || null;
}

async function click(session, x, y) {
  const point = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point }, session.sessionId);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", ...point, button: "left", clickCount: 1 }, session.sessionId);
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...point, button: "left", clickCount: 1 }, session.sessionId);
}

function outerPoint(snap, innerX, innerY) {
  if (!snap.shell) return { x: innerX, y: innerY };
  const scaleX = snap.shell.width / snap.inner[0];
  const scaleY = snap.shell.height / snap.inner[1];
  return {
    x: snap.shell.left + innerX * scaleX,
    y: snap.shell.top + innerY * scaleY,
  };
}

function assertStage(name, snap, viewport) {
  const rows = [];
  rows.push(check(`${name} desktop viewport`, snap.inner[0] >= 1400 && snap.inner[1] >= 860, `inner ${snap.inner.join("x")}`));
  rows.push(check(`${name} skips phone media`, snap.shortQuery === false && snap.narrowQuery === false, `short=${snap.shortQuery} narrow=${snap.narrowQuery}`));
  rows.push(check(`${name} native shell hides LAN`, snap.nativeShell === true && snap.lanOption === false, `shell=${snap.nativeShell} lan=${snap.lanOption}`));
  const visualArenaH = snap.arena.h * (snap.shell.height / snap.inner[1]);
  const visualArenaW = snap.arena.w * (snap.shell.width / snap.inner[0]);
  rows.push(check(`${name} court fills the phone`, visualArenaH >= viewport.height * 0.35 && visualArenaW >= viewport.width * 0.28,
    `visual arena ${visualArenaW.toFixed(0)}x${visualArenaH.toFixed(0)} in ${viewport.width}x${viewport.height}, css arena ${snap.arena.w.toFixed(0)}x${snap.arena.h.toFixed(0)}`));
  const gapTop = snap.shell.top;
  const gapBottom = snap.outer[1] - snap.shell.bottom;
  const gapLeft = snap.shell.left;
  const gapRight = snap.outer[0] - snap.shell.right;
  rows.push(check(`${name} stage is centered without a header band`,
    Math.abs(gapTop - gapBottom) < 8 && Math.abs(gapLeft - gapRight) < 8 && gapTop < viewport.height * 0.2
      && ((gapTop < 8 && gapBottom < 8) || (gapLeft < 8 && gapRight < 8)),
    `gaps top ${gapTop.toFixed(1)} bottom ${gapBottom.toFixed(1)} left ${gapLeft.toFixed(1)} right ${gapRight.toFixed(1)}`));
  rows.push(check(`${name} side panel present`, snap.side && snap.side.h > 200, `side ${snap.side ? `${snap.side.w.toFixed(0)}x${snap.side.h.toFixed(0)}` : "missing"}`));
  return rows;
}

function assertSeats(name, snap) {
  const rows = [];
  rows.push(check(`${name} seats`, snap.seats.length >= 4, `count ${snap.seats.length}`));
  for (const seat of snap.seats) {
    const ok = seat.name.length > 0 && seat.skill.length > 0 && seat.nameInside && seat.skillInside && seat.hpInside
      && seat.nameOnStage && seat.skillH >= 10 && seat.hpH >= 8 && !seat.ellipsis;
    rows.push(check(`${name} seat ${seat.name || "?"}`, ok,
      `nameInside=${seat.nameInside} skillInside=${seat.skillInside} hpInside=${seat.hpInside} skillH=${seat.skillH.toFixed(1)} hpH=${seat.hpH.toFixed(1)} ellipsis=${seat.ellipsis} skill="${seat.skill.slice(0, 16)}"`));
  }
  return rows;
}

function assertHand(name, snap, minCards) {
  const rows = [];
  rows.push(check(`${name} hand cards`, snap.handCount >= minCards, `count ${snap.handCount}`));
  for (const card of snap.cards) {
    rows.push(check(`${name} card ${card.title}`, card.titleInside && card.descInside && card.title.length > 0,
      `titleInside=${card.titleInside} descInside=${card.descInside}`));
  }
  rows.push(check(`${name} end-turn control`, snap.endTurnText.length > 0, snap.endTurnText));
  return rows;
}

const report = { viewports: [], shots: [] };

async function measureShell(width, height, filename, { autostart = true, gameplay = false, fullGame = false } = {}) {
  const query = autostart ? "?autostart&aiSpeed=instant&players=4" : "";
  const session = await openPage({
    width, height, mobile: true,
    url: `${origin}/www/index.html${query}`,
  });
  const label = `shell ${width}x${height}`;
  try {
    if (!autostart) {
      const setup = await waitFor(session, (snap) => snap.startOpen && snap.startInside, 8000, `${label} setup`);
      if (setup?.ready) {
        assertStage(label, setup, { width, height });
        check(`${label} setup button on stage`, setup.startInside, "start");
        report.shots.push(await shot(session, filename));
      }
      return;
    }
    const turn = await waitFor(session, (snap) => !snap.startOpen && snap.handCount >= 4 && snap.seats.length >= 4, 12000, `${label} turn`);
    if (!turn?.ready || turn.startOpen) return;
    assertStage(label, turn, { width, height });
    assertSeats(label, turn);
    assertHand(label, turn, 4);
    report.viewports.push({
      width, height,
      inner: turn.inner,
      cssArena: [Math.round(turn.arena.w), Math.round(turn.arena.h)],
      visualArena: [
        Math.round(turn.arena.w * (turn.shell.width / turn.inner[0])),
        Math.round(turn.arena.h * (turn.shell.height / turn.inner[1])),
      ],
      hand: turn.handCount,
      names: turn.seats.map((seat) => seat.name),
    });
    report.shots.push(await shot(session, filename));

    if (gameplay) {
    const clickable = await waitFor(session, (snap) => snap.ourTurn && snap.cards.some((card) => !card.disabled && card.center), 40000, `${label} our turn`);
    if (clickable?.ourTurn) {
      const card = clickable.cards.find((item) => !item.disabled && item.type.includes("进攻") && item.center)
        || clickable.cards.find((item) => !item.disabled && item.center);
      const point = outerPoint(clickable, card.center.x, card.center.y);
      const under = await send("Runtime.evaluate", {
        expression: `(() => {
          const hit = document.elementFromPoint(${point.x}, ${point.y});
          const doc = document.querySelector("#stage").contentDocument;
          const inner = doc.elementFromPoint(${card.center.x}, ${card.center.y});
          return { outer: hit ? hit.tagName + "#" + hit.id : null, inner: inner ? (inner.className || inner.tagName) : null };
        })()`,
        returnByValue: true,
      }, session.sessionId);
      await click(session, point.x, point.y);
      await sleep(450);
      const after = await snapshot(session);
      const hit = after.cards.some((item) => item.selected)
        || after.handCount !== clickable.handCount
        || after.responseOpen;
      const selected = after.cards.find((item) => item.selected);
      check(`${label} scaled click hits a card`, hit, `clicked ${card.title} at (${point.x.toFixed(1)}, ${point.y.toFixed(1)}) selected=${selected?.title || "none"} hand ${clickable.handCount}->${after.handCount} under=${JSON.stringify(under.result?.value)}`);

      const gearSnap = await snapshot(session);
      const gear = await iframeCenter(session, "#settingsBtn");
      if (gear && gearSnap.shell) {
        const gearPoint = outerPoint(gearSnap, gear.x, gear.y);
        await click(session, gearPoint.x, gearPoint.y);
        await sleep(300);
        const opened = await snapshot(session);
        check(`${label} scaled click opens settings`, opened.settingsOpen, `at (${gearPoint.x.toFixed(1)}, ${gearPoint.y.toFixed(1)})`);
        if (opened.settingsOpen) {
          report.shots.push(await shot(session, filename.replace(".png", "-settings.png")));
          const close = await iframeCenter(session, "#closeSettingsBtn");
          if (close) {
            const closePoint = outerPoint(opened, close.x, close.y);
            await click(session, closePoint.x, closePoint.y);
            await sleep(250);
          }
        }
      }
    }
    }

    if (!fullGame) return;
    let sawResponse = false;
    let lastDrive = null;
    const driveStarted = Date.now();
    while (Date.now() - driveStarted < 45000 && !sawResponse) {
      const snap = await snapshot(session);
      lastDrive = snap;
      if (!snap?.ready) { await sleep(200); continue; }
      if (snap.responseOpen && snap.responseButtons.length) {
        check(`${label} response actions on stage`, snap.responseButtons.every((button) => button.inside) && snap.arena.h >= 450,
          `arena ${snap.arena.h.toFixed(0)}; ${snap.responseButtons.map((button) => button.text).join(" | ")}`);
        assertSeats(`${label} response`, snap);
        assertHand(`${label} response`, snap, 1);
        report.shots.push(await shot(session, filename.replace(".png", "-response.png")));
        sawResponse = true;
        break;
      }
      if ((snap.endTurnText || "").includes("确认弃置") && !snap.ourTurn) {
        await send("Runtime.evaluate", {
          expression: `(() => {
            const doc = document.querySelector("#stage").contentDocument;
            doc.querySelector("#hand .action-card:not(.discard-selected)")?.click();
          })()`,
        }, session.sessionId);
        await sleep(200);
        continue;
      }
      if (snap.settingsOpen) {
        await send("Runtime.evaluate", {
          expression: `document.querySelector("#stage").contentDocument.querySelector("#closeSettingsBtn")?.click()`,
        }, session.sessionId);
        await sleep(200);
        continue;
      }
      if (snap.ourTurn) {
        const end = await iframeCenter(session, "#endTurnBtn");
        if (end) {
          const endPoint = outerPoint(snap, end.x, end.y);
          await click(session, endPoint.x, endPoint.y);
        }
        await send("Runtime.evaluate", {
          expression: `document.querySelector("#stage").contentDocument.querySelector("#endTurnBtn")?.click()`,
        }, session.sessionId);
        await sleep(350);
        continue;
      }
      await sleep(200);
    }
    check(`${label} response banner reached`, sawResponse, sawResponse ? "seen" : `not reached within 45s (ourTurn=${lastDrive?.ourTurn} end="${lastDrive?.endTurnText || ""}" hand=${lastDrive?.handCount})`);

    // The match itself does not reach 终场 inside this bound. Open the real
    // #endModal on the live page. Game rules stay in app.js and are not shortened.
    await send("Runtime.evaluate", {
      expression: `(() => {
        const doc = document.querySelector("#stage").contentDocument;
        const summary = doc.querySelector("#endSummary");
        if (summary) summary.textContent = "挑战者阵营获胜，球队核心离场。";
        doc.querySelector("#endModal")?.classList.add("active");
      })()`,
    }, session.sessionId);
    await sleep(200);
    const ended = await snapshot(session);
    check(`${label} end dialog on stage`, Boolean(ended?.endOpen && ended.endButtons.length >= 3 && ended.endButtons.every((button) => button.inside)),
      ended?.endButtons?.map((button) => `${button.text}:${button.inside}`).join(", ") || "missing");
    if (ended?.endOpen) report.shots.push(await shot(session, filename.replace(".png", "-end.png")));
  } finally {
    await send("Target.closeTarget", { targetId: session.targetId });
  }
}

async function measureDirect(width, height, filename, { mobile, nativeClass = false, expectDesktop = false, expectTablet = false }) {
  const session = await openPage({
    width, height, mobile,
    url: `${origin}/index.html?autostart&aiSpeed=instant&players=4`,
  });
  const label = `direct ${width}x${height}`;
  try {
    if (nativeClass) {
      await send("Runtime.evaluate", {
        expression: "document.documentElement.classList.add('native-shell')",
      }, session.sessionId);
    }
    const snap = await waitFor(session, (item) => !item.startOpen && item.handCount >= 1, 12000, `${label} loaded`);
    if (!snap?.ready) return;
    report.shots.push(await shot(session, filename));
    if (expectDesktop) {
      check(`${label} stays two-column desktop`, snap.narrowQuery === false && snap.shortQuery === false && snap.arena.h >= 400 && snap.side && snap.side.x > snap.arena.x,
        `inner ${snap.inner.join("x")} arena ${snap.arena.w.toFixed(0)}x${snap.arena.h.toFixed(0)} narrow=${snap.narrowQuery}`);
      check(`${label} website still offers LAN`, snap.lanOption === true && snap.nativeShell === false, `lan=${snap.lanOption}`);
      check(`${label} no rotate gate`, snap.rotateGate === false, "");
    }
    if (expectTablet) {
      check(`${label} iPad web still shows a court`, snap.arena.h >= 300 && snap.rotateGate === false && snap.handCount >= 1,
        `arena ${snap.arena.w.toFixed(0)}x${snap.arena.h.toFixed(0)} hand ${snap.handCount}`);
    }
    return snap;
  } finally {
    await send("Target.closeTarget", { targetId: session.targetId });
  }
}

const deviceBefore = [
  "/home/ubuntu/.cursor/projects/agent-repos-nba-basketball-kill/assets/bbk-mobile-cropped-court.jpg",
  "/home/workdir/attachments/image.jpg",
].find((path) => {
  try { readFileSync(path); return true; } catch { return false; }
});
if (deviceBefore) {
  const dest = join(artifacts, "before-device-v1.0.3.jpg");
  copyFileSync(deviceBefore, dest);
  report.shots.push(dest);
}

console.log(`Serving ${origin}`);
await measureDirect(1024, 461, "before-web-1024x461.png", { mobile: true });
await measureDirect(1024, 320, "before-web-short-1024x320.png", { mobile: true });
await measureDirect(1440, 900, "desktop-web-1440x900.png", { mobile: false, expectDesktop: true });
await measureDirect(1280, 800, "desktop-web-1280x800.png", { mobile: false, expectDesktop: true });
await measureDirect(1024, 768, "ipad-web-1024x768.png", { mobile: true, expectTablet: true });

await measureShell(1024, 461, "after-setup-1024x461.png", { autostart: false });
await measureShell(1024, 461, "after-turn-1024x461.png", { gameplay: true });
await measureShell(1024, 461, "after-response-1024x461.png", { fullGame: true });
await measureShell(844, 390, "after-turn-844x390.png", { gameplay: true });
await measureShell(740, 360, "after-turn-740x360.png");
await measureShell(1180, 820, "after-tablet-1180x820.png");

writeFileSync(join(artifacts, "phone-layout-report.json"), JSON.stringify({ failures, viewports: report.viewports, shots: report.shots }, null, 2));
console.log(`\n${failures.length} failed checks. Screenshots: ${report.shots.length}`);
chrome.kill();
server.close();
process.exit(failures.length ? 1 : 0);

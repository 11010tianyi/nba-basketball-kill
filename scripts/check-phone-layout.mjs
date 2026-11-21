import { spawn } from "node:child_process";
import { accessSync, constants, copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const artifacts = process.env.LAYOUT_ARTIFACTS || "/workspace/bbk-mobile-v105-preview";
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

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/local/bin/google-chrome",
    "/home/box/bin/google-chrome",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next known location.
    }
  }
  throw new Error(`Chrome not found. Checked: ${candidates.join(", ")}`);
}
const chrome = spawn(findChrome(), [
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
      nameInsideSeat: inside(nameBox, box(seat)),
      hpInsideSeat: inside(hpBox, box(seat)),
      nameOnStage: inside(nameBox, viewport),
      seatBox: box(seat),
      nameBox,
      skillBox,
      hpBox,
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
  const shown = (el) => {
    if (!el) return false;
    const cs = view.getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    return el.getClientRects().length > 0;
  };
  const logVisible = shown(page.querySelector("#log"));
  const chatVisible = shown(page.querySelector("#chatInput")) && shown(page.querySelector("#chatForm"));
  const discardVisible = shown(page.querySelector("#discardPile"));
  const response = page.querySelector("#responsePanel");
  const responseButtons = [...page.querySelectorAll("#responsePanel button")].map((button) => ({
    text: (button.textContent || "").trim().slice(0, 24),
    inside: inside(box(button), viewport),
  }));
  const endButtons = [...page.querySelectorAll("#endModal .end-actions button")].map((button) => ({
    text: (button.textContent || "").trim(),
    inside: inside(box(button), viewport),
  }));
  const safeValue = (name) => {
    const inline = parseFloat(page.documentElement.style.getPropertyValue(name));
    return Number.isFinite(inline) ? inline : 0;
  };
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
    chatMessagesBox: box(page.querySelector("#chatMessages")),
    chatFormBox: box(page.querySelector("#chatForm")),
    chatInputBox: box(page.querySelector("#chatInput")),
    logBox: box(page.querySelector("#log")),
    discardBox: box(page.querySelector("#discardPile")),
    gridScroll: (() => {
      const grid = page.querySelector("#playerGrid");
      return grid ? { client: grid.clientHeight, scroll: grid.scrollHeight } : null;
    })(),
    shell: fr ? { left: fr.left, top: fr.top, width: fr.width, height: fr.height, right: fr.right, bottom: fr.bottom } : null,
    outer: frame ? [window.innerWidth, window.innerHeight] : [view.innerWidth, view.innerHeight],
    safe: {
      top: safeValue("--safe-area-inset-top"),
      right: safeValue("--safe-area-inset-right"),
      bottom: safeValue("--safe-area-inset-bottom"),
      left: safeValue("--safe-area-inset-left"),
    },
    scoreInside: inside(box(page.querySelector(".scoreboard")), viewport),
    benchInside: inside(box(page.querySelector(".bench")), viewport),
    sideInside: inside(box(page.querySelector(".side-panel")), viewport),
    logVisible,
    chatVisible,
    discardVisible,
    endTurnInside: inside(box(page.querySelector("#endTurnBtn")), viewport),
    sortInside: inside(box(page.querySelector("#sortHandBtn")), viewport),
    closeRulesInside: inside(box(page.querySelector("#closeRulesBtn")), viewport),
    closeSettingsInside: inside(box(page.querySelector("#closeSettingsBtn")), viewport),
    startCard: box(page.querySelector("#startModal .modal-card")),
    rulesCard: box(page.querySelector("#rulesModal .modal-card")),
    settingsCard: box(page.querySelector("#settingsModal .modal-card")),
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
  const buffer = Buffer.from(image.data, "base64");
  const path = join(artifacts, filename);
  writeFileSync(path, buffer);
  if (filename.startsWith("shell-landscape-")) {
    for (const folder of ["landscape-full", "landscape-tight", "landscape-balanced", "landscape-fill"]) {
      const mirror = join(artifacts, folder);
      mkdirSync(mirror, { recursive: true });
      writeFileSync(join(mirror, filename), buffer);
    }
  }
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

// Landscape now runs play.html at the real visual viewport, so the 1440x1080
// stage assertions no longer apply. Verify the shell is pixel-for-pixel 1:1,
// the phone CSS is active, and the court/seats/hand/sidebar stay on screen.
function assertLandscapeFrame(name, snap, viewport, { short = true } = {}) {
  const rows = [];
  const tol = 2;
  rows.push(check(`${name} iframe fills the viewport 1:1`,
    snap.shell && Math.abs(snap.shell.width - viewport.width) <= tol
      && Math.abs(snap.shell.height - viewport.height) <= tol
      && Math.abs(snap.shell.left) <= tol && Math.abs(snap.shell.top) <= tol,
    snap.shell ? `shell ${snap.shell.left.toFixed(1)},${snap.shell.top.toFixed(1)} ${snap.shell.width.toFixed(1)}x${snap.shell.height.toFixed(1)} vs ${viewport.width}x${viewport.height}` : "missing"));
  rows.push(check(`${name} inner is the real viewport`,
    Math.abs(snap.inner[0] - viewport.width) <= 4 && Math.abs(snap.inner[1] - viewport.height) <= 4,
    `inner ${snap.inner.join("x")}`));
  rows.push(check(`${name} no black bars`,
    snap.shell && Math.abs(snap.outer[0] - snap.shell.right) <= tol && Math.abs(snap.outer[1] - snap.shell.bottom) <= tol,
    snap.shell ? `outer ${snap.outer.join("x")} shell right ${snap.shell.right.toFixed(1)} bottom ${snap.shell.bottom.toFixed(1)}` : "missing"));
  rows.push(check(`${name} no rotate gate`, snap.rotateGate === false, ""));
  rows.push(check(`${name} native shell hides LAN`, snap.nativeShell === true && snap.lanOption === false,
    `shell=${snap.nativeShell} lan=${snap.lanOption}`));
  if (short) {
    rows.push(check(`${name} short-landscape CSS active`, snap.shortQuery === true, `short=${snap.shortQuery}`));
  }
  return rows;
}

function assertLandscapeSetup(name, snap, viewport, { short = true } = {}) {
  const rows = assertLandscapeFrame(name, snap, viewport, { short });
  const viewportBox = { left: 0, top: 0, right: snap.inner[0], bottom: snap.inner[1], w: snap.inner[0], h: snap.inner[1] };
  rows.push(check(`${name} setup start button on screen`, snap.startInside, `${snap.startInside}`));
  rows.push(check(`${name} start dialog inside screen`, insideBox(snap.startCard, viewportBox),
    `card ${snap.startCard ? `${snap.startCard.left.toFixed(1)},${snap.startCard.top.toFixed(1)} ${snap.startCard.w.toFixed(0)}x${snap.startCard.h.toFixed(0)}` : "missing"}`));
  return rows;
}

function assertLandscape(name, snap, viewport, { short = true } = {}) {
  const rows = assertLandscapeFrame(name, snap, viewport, { short });
  if (short) {
    // The court now stretches across its grid column instead of contain-fitting
    // the desktop artwork ratio, so measure the gutters around it rather than
    // its aspect ratio. Left gutter + right gutter to the sidebar should be
    // tiny; the sidebar stays a compact band with a working chat input.
    const gutterLeft = snap.arena ? snap.arena.left : Infinity;
    const gutterRight = snap.arena && snap.side ? snap.side.left - snap.arena.right : Infinity;
    const gutterTotal = gutterLeft + gutterRight;
    rows.push(check(`${name} court fills its column edge to edge`,
      Boolean(snap.arena && snap.arena.w > 0 && snap.arena.h >= 110
        && Number.isFinite(gutterTotal) && gutterTotal <= 16),
      `arena ${snap.arena ? `${snap.arena.w.toFixed(0)}x${snap.arena.h.toFixed(0)}` : "missing"} gutters ${Number.isFinite(gutterLeft) ? gutterLeft.toFixed(1) : "?"}+${Number.isFinite(gutterRight) ? gutterRight.toFixed(1) : "?"}=${Number.isFinite(gutterTotal) ? gutterTotal.toFixed(1) : "?"}px`));
    const sideShare = snap.side && viewport.width ? snap.side.w / viewport.width : 0;
    rows.push(check(`${name} court larger than compact sidebar`,
      Boolean(snap.side && snap.arena
        && snap.side.w >= 210 && snap.side.w <= 340
        && sideShare >= 0.22 && sideShare <= 0.38
        && snap.arena.w > snap.side.w
        && snap.arena.w >= viewport.width * 0.45),
      `side ${snap.side ? snap.side.w.toFixed(0) : "missing"} (${(sideShare * 100).toFixed(0)}%) arena ${snap.arena ? snap.arena.w.toFixed(0) : "missing"}`));
  } else {
    rows.push(check(`${name} court on screen`, snap.arena && snap.arena.w >= viewport.width * 0.4
      && snap.arena.h >= 250,
    `arena ${snap.arena ? `${snap.arena.w.toFixed(0)}x${snap.arena.h.toFixed(0)}` : "missing"}`));
  }
  rows.push(check(`${name} seats around the court`, snap.seats.length >= 4, `count ${snap.seats.length}`));
  for (const seat of snap.seats) {
    const ok = seat.name.length > 0 && seat.nameInside && seat.hpInside && seat.nameOnStage
      && seat.hpH >= 8 && !seat.ellipsis;
    rows.push(check(`${name} seat ${seat.name || "?"}`, ok,
      `name=${seat.nameInside} stage=${seat.nameOnStage} hp=${seat.hpInside} skill=${seat.skillInside} hpH=${seat.hpH.toFixed(1)} skillBox=${seat.skillBox ? `${seat.skillBox.top.toFixed(0)}..${seat.skillBox.bottom.toFixed(0)}` : "none"} seat=${seat.seatBox ? `${seat.seatBox.top.toFixed(0)}..${seat.seatBox.bottom.toFixed(0)}` : "none"} arena=${snap.arena ? `${snap.arena.top.toFixed(0)}..${snap.arena.bottom.toFixed(0)}` : "none"} ellipsis=${seat.ellipsis}`));
  }
  const visibleCards = snap.cards.filter((card) => card.titleInside && card.descInside && card.title.length > 0);
  rows.push(check(`${name} hand titles and descriptions on screen`,
    visibleCards.length >= Math.min(4, snap.handCount),
    `${visibleCards.length}/${snap.handCount}: ${visibleCards.map((card) => card.title).join(" | ")}`));
  rows.push(check(`${name} turn controls on screen`, snap.endTurnInside && snap.sortInside,
    `end=${snap.endTurnInside} sort=${snap.sortInside}`));
  if (short) {
    rows.push(check(`${name} sidebar keeps log/chat/discard`,
      snap.sideInside && snap.logVisible && snap.chatVisible && snap.discardVisible,
      `side=${snap.sideInside} log=${snap.logVisible} chat=${snap.chatVisible} discard=${snap.discardVisible}`));
    const viewportBox = { left: 0, top: 0, right: viewport.width, bottom: viewport.height, w: viewport.width, h: viewport.height };
    rows.push(check(`${name} chat form and input on screen`,
      snap.chatVisible && insideBox(snap.chatFormBox, viewportBox) && insideBox(snap.chatInputBox, viewportBox),
      `form=${snap.chatFormBox ? `${snap.chatFormBox.left.toFixed(0)},${snap.chatFormBox.top.toFixed(0)} ${snap.chatFormBox.w.toFixed(0)}x${snap.chatFormBox.h.toFixed(0)}` : "missing"} input=${snap.chatInputBox ? `${snap.chatInputBox.w.toFixed(0)}x${snap.chatInputBox.h.toFixed(0)}` : "missing"}`));
    if (viewport.width >= 800) {
      rows.push(check(`${name} chat messages have visible height`,
        Boolean(snap.chatMessagesBox && snap.chatMessagesBox.h > 0 && insideBox(snap.chatMessagesBox, viewportBox)),
        snap.chatMessagesBox ? `messages ${snap.chatMessagesBox.w.toFixed(0)}x${snap.chatMessagesBox.h.toFixed(0)}` : "missing"));
    }
  } else {
    rows.push(check(`${name} side panel present`, Boolean(snap.side && snap.side.h > 100),
      `side ${snap.side ? `${snap.side.w.toFixed(0)}x${snap.side.h.toFixed(0)}` : "missing"}`));
  }
  return rows;
}

function assertSeats(name, snap) {
  const rows = [];
  rows.push(check(`${name} seats`, snap.seats.length >= 4, `count ${snap.seats.length}`));
  for (const seat of snap.seats) {
    const ok = seat.name.length > 0 && seat.skill.length > 0 && seat.nameInside && seat.skillInside && seat.hpInside
      && seat.nameOnStage && seat.skillH >= 10 && seat.hpH >= 8 && !seat.ellipsis;
    rows.push(check(`${name} seat ${seat.name || "?"}`, ok,
      `nameInside=${seat.nameInside} skillInside=${seat.skillInside} hpInside=${seat.hpInside} skillH=${seat.skillH.toFixed(1)} hpH=${seat.hpH.toFixed(1)} ellipsis=${seat.ellipsis} skillBox=${seat.skillBox ? `${seat.skillBox.top.toFixed(0)}..${seat.skillBox.bottom.toFixed(0)}` : "none"} seat=${seat.seatBox ? `${seat.seatBox.top.toFixed(0)}..${seat.seatBox.bottom.toFixed(0)}` : "none"} arena=${snap.arena ? `${snap.arena.top.toFixed(0)}..${snap.arena.bottom.toFixed(0)}` : "none"} skill="${seat.skill.slice(0, 16)}"`));
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

function insideBox(inner, outer, pad = 2) {
  return Boolean(inner && outer)
    && inner.left >= outer.left - pad && inner.top >= outer.top - pad
    && inner.right <= outer.right + pad && inner.bottom <= outer.bottom + pad
    && inner.w > 0 && inner.h > 0;
}

async function setSafeArea(session, safe) {
  const expression = `(() => {
    const doc = document.querySelector("#stage")?.contentDocument || document;
    const root = doc.documentElement;
    const values = ${JSON.stringify(safe)};
    for (const [side, value] of Object.entries(values)) {
      root.style.setProperty("--safe-area-inset-" + side, value + "px");
    }
    return true;
  })()`;
  await send("Runtime.evaluate", { expression, returnByValue: true }, session.sessionId);
  await sleep(250);
}

async function clickInner(session, selector) {
  await send("Runtime.evaluate", {
    expression: `(() => {
      const doc = document.querySelector("#stage")?.contentDocument || document;
      doc.querySelector(${JSON.stringify(selector)})?.click();
      return true;
    })()`,
    returnByValue: true,
  }, session.sessionId);
  await sleep(250);
}

function assertPortrait(name, snap, viewport, { safeTop = 0, safeBottom = 0, minCards = 4 } = {}) {
  const rows = [];
  const viewportBox = { left: 0, top: 0, right: snap.inner[0], bottom: snap.inner[1], w: snap.inner[0], h: snap.inner[1] };
  const tolerance = 3;
  rows.push(check(`${name} portrait viewport`, snap.inner[1] > snap.inner[0], `inner ${snap.inner.join("x")}`));
  rows.push(check(`${name} no rotate gate`, snap.rotateGate === false, ""));
  rows.push(check(`${name} scoreboard on screen`, snap.scoreInside && snap.score.top >= safeTop - tolerance,
    `score top ${snap.score?.top?.toFixed(1)} safe ${safeTop}`));
  rows.push(check(`${name} seats are a grid`, snap.seats.length >= 4, `count ${snap.seats.length}`));
  for (const seat of snap.seats) {
    const fighter = seat.name.length > 0 && seat.skill.length > 0 && seat.hpInside && seat.nameOnStage
      && insideBox(seat.seatBox, viewportBox) && seat.skillH >= 10 && seat.hpH >= 8 && !seat.ellipsis;
    rows.push(check(`${name} portrait seat ${seat.name || "?"}`, fighter,
      `seat=${insideBox(seat.seatBox, viewportBox)} name=${seat.nameOnStage} hp=${seat.hpInside} skill=${seat.skillH.toFixed(1)} hpHeight=${seat.hpH.toFixed(1)} ellipsis=${seat.ellipsis}`));
  }
  const bottom = Math.max(snap.bench?.bottom || 0, snap.side?.bottom || 0, snap.endTurnInside ? snap.bench?.bottom || 0 : 0);
  rows.push(check(`${name} bench and log above the home bar`, snap.benchInside && snap.sideInside
    && bottom <= snap.inner[1] - safeBottom + tolerance,
  `bench=${snap.benchInside} side=${snap.sideInside} bottom=${bottom.toFixed(1)} limit ${(snap.inner[1] - safeBottom).toFixed(1)}`));
  rows.push(check(`${name} hand count`, snap.handCount >= minCards, `count ${snap.handCount}`));
  const visibleCards = snap.cards.filter((card) => card.titleInside && card.descInside && card.title.length > 0);
  rows.push(check(`${name} visible hand cards`, visibleCards.length >= Math.min(minCards, snap.handCount),
    `${visibleCards.length}/${snap.handCount} visible: ${visibleCards.map((card) => card.title).join(" | ")}`));
  rows.push(check(`${name} turn controls on screen`, snap.endTurnInside && snap.sortInside,
    `end=${snap.endTurnInside} sort=${snap.sortInside}`));
  return rows;
}

function assertPortraitSeatScroll(name, snap, expectedSeats) {
  const rows = [];
  rows.push(check(`${name} seat count`, snap.seats.length === expectedSeats, `count ${snap.seats.length}`));
  const fits = Boolean(snap.gridScroll) && snap.gridScroll.scroll <= snap.gridScroll.client + 2;
  const scrolls = Boolean(snap.gridScroll) && snap.gridScroll.scroll > snap.gridScroll.client + 2;
  rows.push(check(`${name} extra seats fit or scroll`, fits || scrolls,
    snap.gridScroll ? `client ${snap.gridScroll.client} scroll ${snap.gridScroll.scroll} fits=${fits}` : "missing grid"));
  for (const seat of snap.seats) {
    const onStage = !fits || insideBox(seat.seatBox, { left: 0, top: 0, right: snap.inner[0], bottom: snap.inner[1], w: snap.inner[0], h: snap.inner[1] });
    rows.push(check(`${name} readable seat ${seat.name || "?"}`, seat.name.length > 0 && seat.nameInsideSeat && seat.hpInsideSeat
      && seat.hpH >= 8 && !seat.ellipsis && onStage,
    `nameInSeat=${seat.nameInsideSeat} hpInSeat=${seat.hpInsideSeat} hpHeight=${seat.hpH.toFixed(1)} ellipsis=${seat.ellipsis} onStage=${onStage}`));
  }
  return rows;
}

const report = { viewports: [], shots: [] };

async function measureShell(width, height, filename, { autostart = true, gameplay = false, fullGame = false, safe = null, portraitExtras = false } = {}) {
  const query = autostart ? "?autostart&aiSpeed=instant&players=4" : "";
  const session = await openPage({
    width, height, mobile: true,
    url: `${origin}/www/index.html${query}`,
  });
  const label = `shell ${width}x${height}`;
  const isPortrait = height > width;
  const safeTop = safe?.top || 0;
  const safeBottom = safe?.bottom || 0;
  try {
    await waitFor(session, (snap) => snap.ready, 8000, `${label} load`);
    if (safe) await setSafeArea(session, safe);
    if (!autostart) {
      const setup = await waitFor(session, (snap) => snap.startOpen && snap.startInside, 8000, `${label} setup`);
      if (setup?.ready) {
        const viewport = { width, height };
        if (isPortrait) {
          const viewportBox = { left: 0, top: 0, right: setup.inner[0], bottom: setup.inner[1], w: setup.inner[0], h: setup.inner[1] };
          check(`${label} setup has no rotate gate`, setup.rotateGate === false, "");
          check(`${label} setup viewport`, setup.inner[1] > setup.inner[0], `inner ${setup.inner.join("x")}`);
          check(`${label} setup button on screen`, setup.startInside, "start");
          check(`${label} setup dialog respects safe area`, insideBox(setup.startCard, viewportBox)
            && setup.startCard.top >= safeTop - 3 && setup.startCard.bottom <= setup.inner[1] - safeBottom + 3,
          `card ${setup.startCard ? `${setup.startCard.top.toFixed(1)}..${setup.startCard.bottom.toFixed(1)}` : "missing"} safe ${safeTop}/${safeBottom}`);
        } else {
          assertLandscapeSetup(label, setup, viewport, { short: height <= 520 });
        }
        report.shots.push(await shot(session, filename));
      }
      return;
    }
    const turn = await waitFor(session, (snap) => !snap.startOpen && snap.handCount >= 4 && snap.seats.length >= 4, 12000, `${label} turn`);
    if (!turn?.ready || turn.startOpen) return;
    if (isPortrait) {
      assertPortrait(label, turn, { width, height }, { safeTop, safeBottom, minCards: 4 });
      check(`${label} portrait iframe is 1:1`, turn.shell
        && Math.abs(turn.shell.width - width) <= 2 && Math.abs(turn.shell.height - height) <= 2
        && turn.shell.left <= 1 && turn.shell.top <= 1,
      turn.shell ? `shell ${turn.shell.left.toFixed(1)},${turn.shell.top.toFixed(1)} ${turn.shell.width.toFixed(1)}x${turn.shell.height.toFixed(1)}` : "missing");
      check(`${label} native shell hides LAN`, turn.nativeShell === true && turn.lanOption === false,
        `shell=${turn.nativeShell} lan=${turn.lanOption}`);
    } else {
      assertLandscape(label, turn, { width, height }, { short: height <= 520 });
    }
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

    if (isPortrait && portraitExtras) {
      await clickInner(session, "#helpBtn");
      const help = await waitFor(session, (snap) => snap.helpOpen && snap.closeRulesInside, 5000, `${label} help`);
      if (help?.ready) {
        const viewportBox = { left: 0, top: 0, right: help.inner[0], bottom: help.inner[1], w: help.inner[0], h: help.inner[1] };
        check(`${label} help close button on screen`, help.closeRulesInside
          && insideBox(help.rulesCard, viewportBox)
          && help.rulesCard.bottom <= help.inner[1] - safeBottom + 3,
        `card ${help.rulesCard ? `${help.rulesCard.top.toFixed(1)}..${help.rulesCard.bottom.toFixed(1)}` : "missing"}`);
        report.shots.push(await shot(session, filename.replace(".png", "-help.png")));
        await clickInner(session, "#closeRulesBtn");
      }
      await clickInner(session, "#settingsBtn");
      const settings = await waitFor(session, (snap) => snap.settingsOpen && snap.closeSettingsInside, 5000, `${label} settings`);
      if (settings?.ready) {
        const viewportBox = { left: 0, top: 0, right: settings.inner[0], bottom: settings.inner[1], w: settings.inner[0], h: settings.inner[1] };
        check(`${label} settings close button on screen`, settings.closeSettingsInside
          && insideBox(settings.settingsCard, viewportBox)
          && settings.settingsCard.bottom <= settings.inner[1] - safeBottom + 3,
        `card ${settings.settingsCard ? `${settings.settingsCard.top.toFixed(1)}..${settings.settingsCard.bottom.toFixed(1)}` : "missing"}`);
        report.shots.push(await shot(session, filename.replace(".png", "-settings.png")));
        await clickInner(session, "#closeSettingsBtn");
      }
    }

    if (isPortrait) return;

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
        check(`${label} response actions on screen`, snap.responseButtons.every((button) => button.inside) && snap.arena.h >= 110,
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

async function measureDirect(width, height, filename, { mobile, nativeClass = false, expectDesktop = false, expectTablet = false, portrait = false, safe = null, autostart = true, openHelp = false, openSettings = false, players = 4, seatScroll = false }) {
  const session = await openPage({
    width, height, mobile,
    url: `${origin}/index.html${autostart ? `?autostart&aiSpeed=instant&players=${players}` : ""}`,
  });
  const label = `direct ${width}x${height}`;
  const safeTop = safe?.top || 0;
  const safeBottom = safe?.bottom || 0;
  try {
    await waitFor(session, (item) => item.ready, 8000, `${label} ready`);
    if (nativeClass) {
      await send("Runtime.evaluate", {
        expression: "document.documentElement.classList.add('native-shell')",
      }, session.sessionId);
    }
    if (safe) await setSafeArea(session, safe);
    if (!autostart) {
      const setup = await waitFor(session, (item) => item.startOpen && item.startInside, 8000, `${label} setup`);
      if (!setup?.ready) return;
      report.shots.push(await shot(session, filename));
      if (portrait) {
        const viewportBox = { left: 0, top: 0, right: setup.inner[0], bottom: setup.inner[1], w: setup.inner[0], h: setup.inner[1] };
        check(`${label} setup no rotate gate`, setup.rotateGate === false, "");
        check(`${label} setup button on screen`, setup.startInside, "start");
        check(`${label} setup dialog within safe area`, insideBox(setup.startCard, viewportBox)
          && setup.startCard.top >= safeTop - 3 && setup.startCard.bottom <= setup.inner[1] - safeBottom + 3,
        `card ${setup.startCard ? `${setup.startCard.top.toFixed(1)}..${setup.startCard.bottom.toFixed(1)}` : "missing"}`);
      }
      return setup;
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
    if (portrait) {
      if (seatScroll) {
        assertPortraitSeatScroll(label, snap, players);
        check(`${label} six-player hand still on screen`, snap.endTurnInside && snap.sortInside,
          `end=${snap.endTurnInside} sort=${snap.sortInside}`);
      } else {
        assertPortrait(label, snap, { width, height }, { safeTop, safeBottom, minCards: 4 });
      }
      check(`${label} website still offers LAN`, snap.lanOption === true && snap.nativeShell === false, `lan=${snap.lanOption}`);
      const viewportBox = { left: 0, top: 0, right: snap.inner[0], bottom: snap.inner[1], w: snap.inner[0], h: snap.inner[1] };
      if (openHelp) {
        await clickInner(session, "#helpBtn");
        const help = await waitFor(session, (item) => item.helpOpen && item.closeRulesInside, 5000, `${label} help`);
        if (help?.ready) {
          check(`${label} help close button on screen`, help.closeRulesInside
            && insideBox(help.rulesCard, viewportBox)
            && help.rulesCard.bottom <= help.inner[1] - safeBottom + 3,
          `card ${help.rulesCard ? `${help.rulesCard.top.toFixed(1)}..${help.rulesCard.bottom.toFixed(1)}` : "missing"}`);
          report.shots.push(await shot(session, filename.replace(".png", "-help.png")));
          await clickInner(session, "#closeRulesBtn");
        }
      }
      if (openSettings) {
        await clickInner(session, "#settingsBtn");
        const settings = await waitFor(session, (item) => item.settingsOpen && item.closeSettingsInside, 5000, `${label} settings`);
        if (settings?.ready) {
          check(`${label} settings close button on screen`, settings.closeSettingsInside
            && insideBox(settings.settingsCard, viewportBox)
            && settings.settingsCard.bottom <= settings.inner[1] - safeBottom + 3,
          `card ${settings.settingsCard ? `${settings.settingsCard.top.toFixed(1)}..${settings.settingsCard.bottom.toFixed(1)}` : "missing"}`);
          report.shots.push(await shot(session, filename.replace(".png", "-settings.png")));
          await clickInner(session, "#closeSettingsBtn");
        }
      }
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

const portraitSafe = { top: 59, right: 0, bottom: 34, left: 0 };
await measureDirect(390, 844, "portrait-390x844-start.png", { mobile: true, portrait: true, autostart: false });
await measureDirect(430, 932, "portrait-430x932-safe-start.png", { mobile: true, portrait: true, autostart: false, safe: portraitSafe });
await measureDirect(390, 844, "portrait-390x844-turn.png", { mobile: true, portrait: true });
await measureDirect(390, 844, "portrait-390x844-six-players.png", { mobile: true, portrait: true, players: 6, seatScroll: true });
await measureDirect(430, 932, "portrait-430x932-safe.png", { mobile: true, portrait: true, safe: portraitSafe, openHelp: true, openSettings: true });

await measureShell(1024, 461, "shell-landscape-1024x461-start.png", { autostart: false });
await measureShell(1024, 461, "shell-landscape-1024x461-turn.png", { gameplay: true });
await measureShell(1024, 461, "shell-landscape-1024x461-full.png", { fullGame: true });
await measureShell(844, 390, "shell-landscape-844x390-start.png", { autostart: false });
await measureShell(844, 390, "shell-landscape-844x390-turn.png", { gameplay: true });
await measureShell(740, 360, "shell-landscape-740x360-start.png", { autostart: false });
await measureShell(740, 360, "shell-landscape-740x360-turn.png", { gameplay: true });
await measureShell(1180, 820, "shell-landscape-tablet-1180x820.png");

await measureShell(390, 844, "shell-portrait-390x844-start.png", { autostart: false });
await measureShell(390, 844, "shell-portrait-390x844-turn.png", { portraitExtras: true });
await measureShell(430, 932, "shell-portrait-430x932-safe-turn.png", { safe: portraitSafe, portraitExtras: true });

writeFileSync(join(artifacts, "phone-layout-report.json"), JSON.stringify({ failures, viewports: report.viewports, shots: report.shots }, null, 2));
console.log(`\n${failures.length} failed checks. Screenshots: ${report.shots.length}`);
chrome.kill();
server.close();
process.exit(failures.length ? 1 : 0);

import { createHash, randomBytes } from "node:crypto";
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { basename, extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const root = new URL(".", import.meta.url).pathname;
const port = Number(process.env.PORT || 4173);
const rooms = new Map();

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
};
const cardImageExtensions = new Set([".png", ".webp", ".jpg", ".jpeg"]);
const cardPackKinds = new Set(["offense", "reactive", "tactic", "heal", "equip", "utility"]);

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/api/card-packs") {
    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    });
    res.end(JSON.stringify({ packs: scanCardPacks() }));
    return;
  }
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const file = normalize(join(root, requested));
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, {
    "cache-control": "no-store",
    "content-type": types[extname(file)] || "application/octet-stream",
  });
  createReadStream(file).pipe(res);
});

function scanCardPacks() {
  const cardsRoot = join(root, "assets", "cards");
  if (!existsSync(cardsRoot)) return [];
  return readdirSync(cardsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => scanCardPack(entry.name, join(cardsRoot, entry.name)))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
}

function scanCardPack(folderName, folderPath) {
  const files = {};
  for (const entry of readdirSync(folderPath, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = extname(entry.name).toLowerCase();
    const kind = basename(entry.name, ext).toLowerCase();
    if (!cardImageExtensions.has(ext) || !cardPackKinds.has(kind)) continue;
    const filePath = join(folderPath, entry.name);
    if (!statSync(filePath).isFile()) continue;
    files[kind] = `assets/cards/${encodeURIComponent(folderName)}/${encodeURIComponent(entry.name)}`;
  }
  if (!Object.keys(files).length) return null;
  return {
    id: folderName,
    name: folderName,
    description: `识别到 ${Object.keys(files).length}/${cardPackKinds.size} 类卡牌背景。`,
    files,
  };
}

server.on("upgrade", (req, socket) => {
  if (req.url !== "/room") return socket.destroy();
  const key = req.headers["sec-websocket-key"];
  const accept = createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");
  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "",
    "",
  ].join("\r\n"));
  socket.id = randomBytes(4).toString("hex");
  socket.frameBuffer = Buffer.alloc(0);
  socket.on("data", (data) => {
    socket.frameBuffer = Buffer.concat([socket.frameBuffer, data]);
    parseFrames(socket).forEach((message) => handleMessage(socket, message));
  });
  socket.on("error", () => leaveRooms(socket));
  socket.on("close", () => leaveRooms(socket));
});

function handleMessage(socket, message) {
  let payload;
  try {
    payload = JSON.parse(message);
  } catch {
    return send(socket, { type: "error", message: "消息格式错误。" });
  }
  const clientId = normalizeClientId(payload.clientId || socket.clientId);
  if (clientId) socket.clientId = clientId;
  if (payload.type === "create") {
    if (!clientId) return send(socket, { type: "error", message: "缺少玩家标识，请刷新页面后重试。" });
    leaveRooms(socket);
    const code = createCode();
    const room = {
      code,
      host: clientId,
      playerCount: clampPlayerCount(payload.playerCount),
      selectedRosterId: payload.selectedRosterId || "lebron",
      started: false,
      gameState: null,
      chatMessages: [],
      players: [{ id: clientId, socketId: socket.id, ready: true, rosterId: payload.selectedRosterId || "lebron" }],
      sockets: new Map([[clientId, socket]]),
    };
    rooms.set(code, room);
    socket.roomCode = code;
    return send(socket, { type: "room-created", room: publicRoom(room) });
  }
  if (payload.type === "join") {
    if (!clientId) return send(socket, { type: "error", message: "缺少玩家标识，请刷新页面后重试。" });
    const room = rooms.get(String(payload.code || "").toUpperCase());
    if (!room) return send(socket, { type: "error", message: "没有找到这个房间。" });
    const existing = room.players.find((player) => player.id === clientId);
    if (existing) {
      const oldSocket = room.sockets.get(clientId);
      if (oldSocket && oldSocket !== socket) oldSocket.roomCode = "";
      existing.socketId = socket.id;
      room.sockets.set(clientId, socket);
      socket.roomCode = room.code;
      send(socket, { type: "room-joined", room: publicRoom(room), alreadyJoined: true });
      if (room.gameState) send(socket, { type: "game-state", room: publicRoom(room), game: room.gameState });
      return;
    }
    if (room.started) return send(socket, { type: "error", message: "这局已经开球，不能中途加入。" });
    leaveRooms(socket);
    if (room.players.length >= room.playerCount) return send(socket, { type: "error", message: `房间已满，当前上限为 ${room.playerCount} 人。` });
    room.players.push({ id: clientId, socketId: socket.id, ready: false, rosterId: payload.rosterId || payload.selectedRosterId || "lebron" });
    room.sockets.set(clientId, socket);
    socket.roomCode = room.code;
    return broadcast(room, { type: "room-joined", room: publicRoom(room) });
  }
  const room = rooms.get(String(payload.code || socket.roomCode || "").toUpperCase());
  if (!room) return send(socket, { type: "error", message: "房间不存在。" });
  if (payload.type === "patch" && clientId === room.host) {
    if (payload.playerCount) {
      const nextCount = clampPlayerCount(payload.playerCount);
      room.playerCount = Math.max(nextCount, room.players.length);
    }
    if (payload.selectedRosterId) room.selectedRosterId = payload.selectedRosterId;
    const hostPlayer = room.players.find((player) => player.id === room.host);
    if (hostPlayer && payload.selectedRosterId) hostPlayer.rosterId = payload.selectedRosterId;
    return broadcast(room, { type: "room-update", room: publicRoom(room) });
  }
  if (payload.type === "ready") {
    const player = room.players.find((item) => item.id === clientId);
    if (!player) return send(socket, { type: "error", message: "你不在这个房间里。" });
    if (room.started) return send(socket, { type: "error", message: "比赛已经开始。" });
    if (payload.rosterId) {
      player.rosterId = String(payload.rosterId).replace(/[^a-z0-9-]/gi, "").slice(0, 40) || player.rosterId;
      if (player.id === room.host) room.selectedRosterId = player.rosterId;
    }
    player.ready = player.id === room.host ? true : Boolean(payload.ready);
    return broadcast(room, { type: "room-update", room: publicRoom(room) });
  }
  if (payload.type === "start") {
    if (clientId !== room.host) return send(socket, { type: "error", message: "只有房主可以开球。" });
    const unready = room.players.filter((player) => player.id !== room.host && !player.ready);
    if (unready.length) return send(socket, { type: "error", message: "还有玩家未准备，不能开球。" });
    room.started = true;
    return broadcast(room, { type: "room-start", room: publicRoom(room) });
  }
  if (payload.type === "game-state") {
    if (clientId !== room.host) return send(socket, { type: "error", message: "只有房主可以同步比赛。" });
    room.gameState = payload.game || null;
    return broadcast(room, { type: "game-state", room: publicRoom(room), game: room.gameState });
  }
  if (payload.type === "game-action") {
    const hostSocket = room.sockets.get(room.host);
    if (!hostSocket) return send(socket, { type: "error", message: "房主暂时不在线。" });
    return send(hostSocket, { type: "game-action", room: publicRoom(room), from: clientId, action: payload.action || {} });
  }
  if (payload.type === "chat") {
    const message = normalizeChatMessage(payload.message, clientId);
    if (!message) return;
    room.chatMessages = [...(room.chatMessages || []), message].slice(-80);
    return broadcast(room, { type: "chat", room: publicRoom(room), message });
  }
}

function parseFrames(socket) {
  const messages = [];
  let buffer = socket.frameBuffer;
  while (buffer.length >= 2) {
    const opcode = buffer[0] & 0x0f;
    if (opcode === 8) {
      socket.end();
      socket.frameBuffer = Buffer.alloc(0);
      return messages;
    }
    let offset = 2;
    let length = buffer[1] & 0x7f;
    if (length === 126) {
      if (buffer.length < offset + 2) break;
      length = buffer.readUInt16BE(offset);
      offset += 2;
    } else if (length === 127) {
      if (buffer.length < offset + 8) break;
      length = Number(buffer.readBigUInt64BE(offset));
      offset += 8;
    }
    const masked = Boolean(buffer[1] & 0x80);
    const maskLength = masked ? 4 : 0;
    if (buffer.length < offset + maskLength + length) break;
    const mask = masked ? buffer.subarray(offset, offset + 4) : null;
    offset += maskLength;
    const payload = Buffer.from(buffer.subarray(offset, offset + length));
    if (mask) {
      for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i % 4];
    }
    messages.push(payload.toString("utf8"));
    buffer = buffer.subarray(offset + length);
  }
  socket.frameBuffer = buffer;
  return messages;
}

function parseFrame(buffer) {
  const opcode = buffer[0] & 0x0f;
  if (opcode === 8) return null;
  let offset = 2;
  let length = buffer[1] & 0x7f;
  if (length === 126) {
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    length = Number(buffer.readBigUInt64BE(offset));
    offset += 8;
  }
  const mask = buffer.subarray(offset, offset + 4);
  offset += 4;
  const payload = buffer.subarray(offset, offset + length);
  for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i % 4];
  return payload.toString("utf8");
}

function send(socket, data) {
  if (!socket || socket.destroyed || socket.writableEnded || socket.writableDestroyed) return;
  const json = Buffer.from(JSON.stringify(data));
  let header;
  if (json.length < 126) {
    header = Buffer.from([0x81, json.length]);
  } else if (json.length <= 0xffff) {
    header = Buffer.from([0x81, 126, json.length >> 8, json.length & 255]);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(json.length), 2);
  }
  try {
    socket.write(Buffer.concat([header, json]));
  } catch {
    leaveRooms(socket);
  }
}

function broadcast(room, data) {
  [...room.sockets.values()].forEach((socket) => send(socket, data));
}

function leaveRooms(socket) {
  const room = rooms.get(socket.roomCode);
  if (!room) return;
  const player = room.players.find((item) => item.socketId === socket.id);
  if (!player) return;
  room.sockets.delete(player.id);
  room.players = room.players.filter((item) => item.id !== player.id);
  if (!room.players.length) rooms.delete(room.code);
  else {
    if (room.host === player.id) room.host = room.players[0].id;
    broadcast(room, { type: "room-update", room: publicRoom(room) });
  }
}

function publicRoom(room) {
  return {
    code: room.code,
    host: room.host,
    playerCount: room.playerCount,
    selectedRosterId: room.selectedRosterId,
    started: room.started,
    chatMessages: room.chatMessages || [],
    players: room.players.map((player, index) => ({
      id: player.id,
      seat: index,
      ready: player.id === room.host ? true : Boolean(player.ready),
      rosterId: player.rosterId || "lebron",
      host: player.id === room.host,
    })),
  };
}

function normalizeChatMessage(value, clientId) {
  const text = String(value?.text || "").trim().slice(0, 90);
  if (!text) return null;
  return {
    id: String(value?.id || `${Date.now()}-${Math.random()}`).replace(/[^a-z0-9-]/gi, "").slice(0, 64),
    text,
    kind: ["signature", "emoji", "culture", "text"].includes(value?.kind) ? value.kind : "text",
    speaker: String(value?.speaker || "球迷").trim().slice(0, 16),
    roleId: String(value?.roleId || "").replace(/[^a-z0-9-]/gi, "").slice(0, 24),
    clientId,
    ts: Number(value?.ts) || Date.now(),
  };
}

function normalizeClientId(value) {
  const id = String(value || "").replace(/[^a-z0-9-]/gi, "").slice(0, 48);
  return id || "";
}

function clampPlayerCount(value) {
  return Math.max(4, Math.min(8, Number(value) || 4));
}

function createCode() {
  let code = "";
  do {
    code = randomBytes(3).toString("hex").toUpperCase();
  } while (rooms.has(code));
  return code;
}

function localIps() {
  return Object.values(networkInterfaces()).flat().filter((item) => item?.family === "IPv4" && !item.internal).map((item) => item.address);
}

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`端口 ${port} 已被占用。请先关闭旧服务，或用 PORT=4174 npm start 换一个端口。`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, "0.0.0.0", () => {
  console.log(`NBA Basketball Kill: http://127.0.0.1:${port}/`);
  localIps().forEach((ip) => console.log(`LAN: http://${ip}:${port}/`));
});

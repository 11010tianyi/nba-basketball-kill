const roster = [
  {
    id: "lebron",
    name: "LeBron James",
    cn: "勒布朗",
    team: "LAL",
    no: 23,
    pos: "前锋",
    hp: 5,
    tags: ["核心", "组织", "冲筐"],
    color: "#552583",
    skin: "#9b623e",
    hair: "#171717",
    beard: 1,
    skill: "王者推进：突破造成伤害后摸 1 张。",
    photoFile: "LeBron James Layup (Cleveland vs Brooklyn 2018).jpg",
  },
  {
    id: "curry",
    name: "Stephen Curry",
    cn: "库里",
    team: "GSW",
    no: 30,
    pos: "后卫",
    hp: 3,
    tags: ["射手", "跑位", "三分"],
    color: "#1d428a",
    skin: "#b8794f",
    hair: "#211915",
    beard: 0.72,
    skill: "无球引力：三分若被防守抵消，你摸 1 张。",
    photoFile: "Stephen Curry Shooting.jpg",
  },
  {
    id: "jokic",
    name: "Nikola Jokic",
    cn: "约基奇",
    team: "DEN",
    no: 15,
    pos: "中锋",
    hp: 4,
    tags: ["策应", "内线", "传球"],
    color: "#0e2240",
    skin: "#f0b17f",
    hair: "#6b402a",
    beard: 0.55,
    skill: "中轴策应：助攻额外令目标摸 1 张。",
    photoFile: "Nikola Jokic (40980299891).jpg",
  },
  {
    id: "giannis",
    name: "Giannis Antetokounmpo",
    cn: "字母哥",
    team: "MIL",
    no: 34,
    pos: "前锋",
    hp: 5,
    tags: ["冲击", "防守", "长臂"],
    color: "#00471b",
    skin: "#5f3828",
    hair: "#111111",
    beard: 0.45,
    skill: "禁区碾压：突破命中时额外弃目标 1 张。",
    photoFile: "Giannis Antetokounmpo (24845003687).jpg",
  },
  {
    id: "doncic",
    name: "Luka Doncic",
    cn: "东契奇",
    team: "LAL",
    no: 77,
    pos: "后卫",
    hp: 4,
    tags: ["持球", "节奏", "单打"],
    color: "#fdb927",
    skin: "#efb17f",
    hair: "#5b3524",
    beard: 0.62,
    skill: "节奏大师：每回合第一张战术牌结算后摸 1 张。",
    photoFile: "Luka Doncic (51177393625).jpg",
  },
  {
    id: "shai",
    name: "Shai Gilgeous-Alexander",
    cn: "亚历山大",
    team: "OKC",
    no: 2,
    pos: "后卫",
    hp: 4,
    tags: ["突破", "罚球", "冷静"],
    color: "#007ac1",
    skin: "#6f442f",
    hair: "#151515",
    beard: 0.28,
    skill: "丝滑变向：被防守后可令目标弃 1 张。",
    photoFile: "Shai Gilgeous-Alexander (51815871018) (cropped).jpg",
  },
  {
    id: "tatum",
    name: "Jayson Tatum",
    cn: "塔图姆",
    team: "BOS",
    no: 0,
    pos: "前锋",
    hp: 4,
    tags: ["单打", "锋线", "终结"],
    color: "#007a33",
    skin: "#8b5638",
    hair: "#151515",
    beard: 0.5,
    skill: "侧翼单打：手牌少于体能时，突破距离 +1。",
    photoFile: "Jayson Tatum (40666256774).jpg",
  },
  {
    id: "edwards",
    name: "Anthony Edwards",
    cn: "爱德华兹",
    team: "MIN",
    no: 5,
    pos: "后卫",
    hp: 4,
    tags: ["爆发", "扣篮", "压迫"],
    color: "#0c2340",
    skin: "#6a3f2d",
    hair: "#111111",
    beard: 0.35,
    skill: "起飞隔扣：快攻造成首次伤害后再摸 1 张。",
    photoFile: "Anthony Edwards (cropped).jpg",
  },
  {
    id: "wemby",
    name: "Victor Wembanyama",
    cn: "文班亚马",
    team: "SAS",
    no: 1,
    pos: "中锋",
    hp: 4,
    tags: ["护框", "封盖", "空间"],
    color: "#8a8d8f",
    skin: "#7f4d34",
    hair: "#20130f",
    beard: 0.12,
    skill: "遮天蔽日：每轮第一次受到进攻可自动防守。",
    photoFile: "Victor Wembanyama.jpg",
  },
  {
    id: "brunson",
    name: "Jalen Brunson",
    cn: "布伦森",
    team: "NYK",
    no: 11,
    pos: "后卫",
    hp: 4,
    tags: ["背身", "控场", "坚韧"],
    color: "#f58426",
    skin: "#6c402e",
    hair: "#111111",
    beard: 0.62,
    skill: "低位控卫：体能首次降至 1 时摸 2 张。",
    photoFile: "Jalen Brunson.jpg",
  },
  {
    id: "yao",
    name: "Yao Ming",
    cn: "姚明",
    team: "HOU",
    no: 11,
    pos: "中锋",
    hp: 5,
    tags: ["中国", "内线", "护框"],
    color: "#ce1141",
    skin: "#d09261",
    hair: "#15110f",
    beard: 0.08,
    skill: "长城护框：你每轮第一次用盖帽响应后，摸 1 张。",
    photoFile: "Yao Ming in 2014 (cropped).jpg",
  },
  {
    id: "jordan",
    name: "Michael Jordan",
    cn: "乔丹",
    team: "CHI",
    no: 23,
    pos: "后卫",
    hp: 5,
    tags: ["历史", "终结", "防守"],
    color: "#ce1141",
    skin: "#7a4932",
    hair: "#0b0b0b",
    beard: 0.18,
    skill: "最后一投：你体能为 1 时，进攻命中后额外摸 1 张。",
    photoFile: "Michael Jordan.jpg",
  },
  {
    id: "kobe",
    name: "Kobe Bryant",
    cn: "科比",
    team: "LAL",
    no: 24,
    pos: "后卫",
    hp: 4,
    tags: ["历史", "单打", "关键球"],
    color: "#552583",
    skin: "#8a5639",
    hair: "#111111",
    beard: 0.28,
    skill: "曼巴强投：你可额外使用 1 张进攻牌，但第二张命中后不加分。",
    photoFile: "Kobe Bryant 2014.jpg",
  },
  {
    id: "shaq",
    name: "Shaquille O'Neal",
    cn: "奥尼尔",
    team: "LAL",
    no: 34,
    pos: "中锋",
    hp: 5,
    tags: ["历史", "力量", "禁区"],
    color: "#fdb927",
    skin: "#6a3f2d",
    hair: "#080808",
    beard: 0.22,
    skill: "篮下暴扣：距离 1 的突破需要 2 张防守响应。",
    photoFile: "Shaquille O'Neal1.jpg",
  },
  {
    id: "iverson",
    name: "Allen Iverson",
    cn: "艾弗森",
    team: "PHI",
    no: 3,
    pos: "后卫",
    hp: 3,
    tags: ["历史", "变向", "抢断"],
    color: "#006bb6",
    skin: "#70432f",
    hair: "#121212",
    beard: 0.36,
    skill: "交叉步：你使用突破时，目标响应牌需求距离 +1。",
    photoFile: "Allen Iverson Lipofsky.jpg",
    photoPosition: "50% 18%",
  },
  {
    id: "duncan",
    name: "Tim Duncan",
    cn: "邓肯",
    team: "SAS",
    no: 21,
    pos: "大前",
    hp: 5,
    tags: ["历史", "稳定", "护筐"],
    color: "#8a8d8f",
    skin: "#6f422d",
    hair: "#111111",
    beard: 0.26,
    skill: "基本功：你每轮第一次受到伤害 -1。",
    photoFile: "Tim Duncan.jpg",
  },
  {
    id: "nash",
    name: "Steve Nash",
    cn: "纳什",
    team: "PHX",
    no: 13,
    pos: "后卫",
    hp: 3,
    tags: ["历史", "组织", "传球"],
    color: "#e56020",
    skin: "#e4a06f",
    hair: "#9b6a38",
    beard: 0.28,
    skill: "太阳快传：你使用助攻后，自己也摸 1 张。",
    photoFile: "Steve Nash 00054544.jpg",
  },
  {
    id: "yi",
    name: "Yi Jianlian",
    cn: "易建联",
    team: "CHN",
    no: 11,
    pos: "大前",
    hp: 4,
    tags: ["中国", "空间", "篮板"],
    color: "#d71920",
    skin: "#d39462",
    hair: "#14110f",
    beard: 0.08,
    skill: "空间四号位：三分距离 +1；罚球红色时额外摸 1 张。",
    photoFile: "Yi Chan Lian - Team China Bball (2752816350).jpg",
    photoPosition: "50% 12%",
  },
  {
    id: "wang",
    name: "Wang Zhizhi",
    cn: "王治郅",
    team: "CHN",
    no: 14,
    pos: "中锋",
    hp: 4,
    tags: ["中国", "投射", "内线"],
    color: "#b91c1c",
    skin: "#d59461",
    hair: "#15110f",
    beard: 0.05,
    skill: "内外摇摆：你使用三分被防守后，可弃目标 1 张牌。",
    photoFile: "Wang ZhiZhi.jpg",
  },
  {
    id: "guo",
    name: "Guo Ailun",
    cn: "郭艾伦",
    team: "CHN",
    no: 6,
    pos: "后卫",
    hp: 4,
    tags: ["中国", "突破", "控球"],
    color: "#c8102e",
    skin: "#d28f5e",
    hair: "#15110f",
    beard: 0.05,
    skill: "亚洲第一步：你使用突破时，进攻距离 +1。",
    photoFile: "Guo Ailun 2012.jpg",
  },
];

const cardCatalog = {
  breakthrough: {
    name: "突破",
    type: "进攻",
    icon: "↯",
    color: "#e24d3c",
    desc: "攻击距离内一名角色需防守，否则 -1 体能。",
    target: "enemy",
    offensive: true,
    range: 1,
  },
  three: {
    name: "三分",
    type: "进攻",
    icon: "3",
    color: "#2c86ff",
    desc: "远距离出手。被防守后你摸 1 张。",
    target: "enemy",
    offensive: true,
    range: 3,
  },
  defense: {
    name: "防守",
    type: "反应",
    icon: "⌂",
    color: "#13a66f",
    desc: "抵消一次突破或三分。",
    target: "none",
    reactive: true,
  },
  timeout: {
    name: "暂停",
    type: "治疗",
    icon: "+",
    color: "#efb832",
    desc: "回复 1 点体能，或救回受伤队友。",
    target: "self",
  },
  assist: {
    name: "助攻",
    type: "战术",
    icon: "→",
    color: "#22c2b4",
    desc: "令一名角色摸 2 张。",
    target: "any",
    tactic: true,
  },
  steal: {
    name: "抢断",
    type: "战术",
    icon: "!",
    color: "#ac5cff",
    desc: "弃置目标 1 张手牌或装备。",
    target: "enemy",
    tactic: true,
  },
  block: {
    name: "盖帽",
    type: "反应",
    icon: "×",
    color: "#5cc8ff",
    desc: "抵消一次战术或进攻。",
    target: "none",
    reactive: true,
  },
  challenge: {
    name: "教练挑战",
    type: "反应",
    icon: "?",
    color: "#f97316",
    desc: "响应链中抵消一张战术牌。",
    target: "none",
    reactive: true,
  },
  fastbreak: {
    name: "快攻",
    type: "战术",
    icon: "»",
    color: "#ff7b29",
    desc: "自动攻击两个敌方目标。",
    target: "none",
    tactic: true,
  },
  double: {
    name: "包夹",
    type: "战术",
    icon: "Ⅱ",
    color: "#b52736",
    desc: "目标弃 2 张；不足则 -1 体能。",
    target: "enemy",
    tactic: true,
  },
  penalty: {
    name: "罚球",
    type: "治疗",
    icon: "1",
    color: "#f5c542",
    desc: "判定：红色回复 1 点，黑色摸 1 张。",
    target: "self",
    judge: true,
  },
  screen: {
    name: "挡拆",
    type: "战术",
    icon: "⊢",
    color: "#14b8a6",
    desc: "本回合下一次进攻距离无限。",
    target: "self",
    tactic: true,
  },
  foul: {
    name: "战术犯规",
    type: "战术",
    icon: "!",
    color: "#7f1d1d",
    desc: "令目标本回合不能使用进攻牌。",
    target: "enemy",
    tactic: true,
    hostile: true,
  },
  momentum: {
    name: "更衣室鼓舞",
    type: "战术",
    icon: "★",
    color: "#facc15",
    desc: "你与一名角色各摸 1 张。",
    target: "any",
    tactic: true,
  },
  shoes: {
    name: "球鞋",
    type: "装备",
    icon: "⌁",
    color: "#ffffff",
    desc: "进攻距离 +1。",
    target: "self",
    equip: "shoes",
  },
  sleeve: {
    name: "护臂",
    type: "装备",
    icon: "▣",
    color: "#cbd5e1",
    desc: "每轮第一次受伤 -1。",
    target: "self",
    equip: "sleeve",
  },
  board: {
    name: "战术板",
    type: "装备",
    icon: "▤",
    color: "#94a3b8",
    desc: "手牌上限 +1。",
    target: "self",
    equip: "board",
  },
  ring: {
    name: "冠军戒指",
    type: "装备",
    icon: "◇",
    color: "#fde68a",
    desc: "濒死时自动回复 1 点并弃置。",
    target: "self",
    equip: "ring",
  },
};

const deckRecipe = [
  ["breakthrough", 26],
  ["defense", 22],
  ["timeout", 10],
  ["three", 12],
  ["penalty", 8],
  ["assist", 10],
  ["steal", 8],
  ["block", 8],
  ["challenge", 5],
  ["fastbreak", 5],
  ["double", 6],
  ["screen", 6],
  ["foul", 5],
  ["momentum", 4],
  ["shoes", 5],
  ["sleeve", 5],
  ["board", 4],
  ["ring", 3],
];

function makeId(prefix = "id") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${prefix}-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getClientId() {
  let id = localStorage.getItem("nbaKillClientId");
  if (!id) {
    id = makeId("client");
    localStorage.setItem("nbaKillClientId", id);
  }
  return id;
}

const state = {
  players: [],
  deck: [],
  discard: [],
  selectedRosterId: "lebron",
  playerCount: Number(localStorage.getItem("nbaKillPlayerCount")) || 4,
  playMode: localStorage.getItem("nbaKillPlayMode") || "solo",
  clientId: getClientId(),
  roomCode: "",
  roomPlayers: [],
  roomStarted: false,
  roomReady: false,
  avatarStyle: localStorage.getItem("nbaKillAvatarStyle") || "portrait",
  soundPack: localStorage.getItem("nbaKillSoundPack") || "live",
  logEntries: [],
  current: 0,
  phase: "setup",
  selectedCardIndex: null,
  awaitingTarget: null,
  pendingResponse: null,
  discardRequest: null,
  offensiveUsed: false,
  turnNumber: 1,
  clock: 720,
  countdownLabel: "",
  countdownLeft: 0,
  homeScore: 0,
  awayScore: 0,
  gameOver: false,
  sound: true,
  audioReady: false,
};

const seatLayouts = {
  4: ["bottom", "left", "top", "right"],
  5: ["bottom", "left", "top", "right", "top-left"],
  6: ["bottom", "left", "top", "right", "top-left", "top-right"],
  7: ["bottom", "left", "top", "right", "top-left", "top-right", "left-low"],
  8: ["bottom", "left", "top", "right", "top-left", "top-right", "left-low", "right-low"],
};
const identityLayouts = {
  4: ["挑战者", "队友", "独狼"],
  5: ["挑战者", "挑战者", "队友", "独狼"],
  6: ["挑战者", "挑战者", "队友", "队友", "独狼"],
  7: ["挑战者", "挑战者", "挑战者", "队友", "队友", "独狼"],
  8: ["挑战者", "挑战者", "挑战者", "队友", "队友", "队友", "独狼"],
};
const suits = ["♠", "♥", "♣", "♦"];
const cardSortOrder = {
  breakthrough: 1,
  three: 2,
  defense: 3,
  block: 4,
  challenge: 5,
  timeout: 6,
  penalty: 7,
  assist: 8,
  steal: 9,
  double: 10,
  fastbreak: 11,
  screen: 12,
  foul: 13,
  momentum: 14,
  shoes: 15,
  sleeve: 16,
  board: 17,
  ring: 18,
};
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
})[char]);

function cloneCard(id) {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return {
    id,
    uid: makeId("card"),
    suit,
    rank: 1 + Math.floor(Math.random() * 13),
    colorName: suit === "♥" || suit === "♦" ? "red" : "black",
    ...cardCatalog[id],
  };
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  const cards = [];
  deckRecipe.forEach(([id, count]) => {
    for (let i = 0; i < count; i += 1) cards.push(cloneCard(id));
  });
  return shuffle(cards);
}

function buildRoster() {
  const rosterEl = qs("#roster");
  qs("#playerCountSelect").value = String(state.playerCount);
  qs("#playModeSelect").value = state.playMode;
  rosterEl.innerHTML = roster.map((player) => `
    <button class="roster-card ${player.id === state.selectedRosterId ? "selected" : ""}" type="button" data-roster="${player.id}">
      ${renderPlayerCard({ role: player, identity: "核心", hp: player.hp, maxHp: player.hp, hand: [], equipment: {}, revealed: true }, true)}
    </button>
  `).join("");
  renderLanPanel();
}

function renderPlayerCard(player, compact = false) {
  const role = player.role;
  const hearts = Array.from({ length: player.maxHp }, (_, i) => `<span class="heart ${i < player.hp ? "" : "empty"}"></span>`).join("");
  const cards = Array.from({ length: Math.min(player.hand?.length || 0, 8) }, () => `<span class="mini-card"></span>`).join("");
  const equipment = Object.values(player.equipment || {}).map((card) => `<span class="pill">${card.name}</span>`).join("");
  return `
    <article class="player-card avatar-mode-${state.avatarStyle}" style="--team:${role.color};--skin:${role.skin};--hair:${role.hair};--beard:${role.beard};--photo-position:${role.photoPosition || "50% 12%"}">
      ${renderAvatar(role)}
      <div class="player-copy">
        <h3 class="player-name">${role.cn}</h3>
        <div class="meta-row">
          <span class="pill">${role.team}</span>
          <span class="pill">${role.pos}</span>
          ${role.tags.slice(0, compact ? 2 : 3).map((tag) => `<span class="pill">${tag}</span>`).join("")}
        </div>
        <div class="hp-row">${hearts}</div>
        <div class="card-row">${cards || `<span class="pill">无手牌</span>`}</div>
        ${equipment ? `<div class="meta-row">${equipment}</div>` : ""}
        <p class="skill-text">${role.skill}</p>
      </div>
    </article>
  `;
}

function renderAvatar(role) {
  if (state.avatarStyle === "classic") {
    return `
      <div class="avatar" aria-hidden="true">
        <div class="arm left"></div>
        <div class="arm right"></div>
        <div class="body"></div>
        <div class="jersey-number">${role.no}</div>
        <div class="head"></div>
        <div class="hair"></div>
        <div class="beard"></div>
      </div>
    `;
  }
  if (state.avatarStyle === "photo") return renderPhotoAvatar(role);
  return renderPortraitAvatar(role);
}

function renderPhotoAvatar(role) {
  if (!role.photoFile) return renderPortraitAvatar(role);
  return `
    <div class="photo-avatar" aria-hidden="true">
      <img src="${commonsPhoto(role.photoFile)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.classList.add('photo-failed');">
      <div class="photo-fallback">
        ${renderPortraitAvatar(role)}
      </div>
      <span class="photo-badge">${role.team} · #${role.no}</span>
    </div>
  `;
}

function renderPortraitAvatar(role) {
  return `
    <div class="portrait-avatar portrait-${role.id}" aria-hidden="true">
      <div class="portrait-glow"></div>
      <div class="portrait-shoulders">
        <span class="portrait-number">${role.no}</span>
      </div>
      <div class="portrait-neck"></div>
      <div class="portrait-ear left"></div>
      <div class="portrait-ear right"></div>
      <div class="portrait-head">
        <div class="portrait-hair"></div>
        <div class="portrait-forehead"></div>
        <div class="portrait-brows"><span></span><span></span></div>
        <div class="portrait-eyes"><span></span><span></span></div>
        <div class="portrait-nose"></div>
        <div class="portrait-mouth"></div>
        <div class="portrait-beard"></div>
      </div>
      <div class="portrait-arm left"></div>
      <div class="portrait-arm right"></div>
      <div class="portrait-ball"></div>
    </div>
  `;
}

function commonsPhoto(file) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=640`;
}

function initGame(options = {}) {
  clearCountdown();
  clearAutoEnd();
  unlockAudio();
  startMusic();
  const selected = roster.find((p) => p.id === state.selectedRosterId) || roster[0];
  const count = Math.max(4, Math.min(8, state.playerCount || 4));
  const seats = seatLayouts[count] || seatLayouts[4];
  const roomPlayers = options.lan ? Array.isArray(state.roomPlayers) ? state.roomPlayers : [] : [];
  const humanRosterIds = roomPlayers.map((player, index) => index === 0 ? (player.rosterId || state.selectedRosterId) : (player.rosterId || null));
  const humanRoles = roomPlayers
    .slice(0, count)
    .map((roomPlayer, index) => {
      const rosterId = humanRosterIds[index] || roomPlayer.rosterId || selected.id;
      const fallback = roster.find((role) => !humanRosterIds.includes(role.id)) || selected;
      return roster.find((role) => role.id === rosterId) || fallback;
    });
  const usedRoleIds = new Set(humanRoles.map((role) => role.id));
  const fillRoles = shuffle(roster.filter((role) => !usedRoleIds.has(role.id))).slice(0, Math.max(0, count - humanRoles.length));
  const roles = options.lan && humanRoles.length ? [...humanRoles, ...fillRoles] : [selected, ...shuffle(roster.filter((p) => p.id !== selected.id)).slice(0, count - 1)];
  const aiIdentities = shuffle(identityLayouts[count] || identityLayouts[4]);
  state.players = roles.map((role, index) => ({
    id: makeId("player"),
    seat: seats[index],
    role,
    identity: index === 0 ? "核心" : aiIdentities[index - 1],
    revealed: index === 0,
    hp: role.hp + (index === 0 ? 1 : 0),
    maxHp: role.hp + (index === 0 ? 1 : 0),
    hand: [],
    equipment: {},
    alive: true,
    ai: options.lan ? index >= roomPlayers.length : index !== 0,
    clientId: options.lan && roomPlayers[index] ? roomPlayers[index].id : "",
    autoGuardUsed: false,
    sleeveUsed: false,
    fundamentalsUsed: false,
    screenTurns: 0,
    offenseLocked: false,
    extraOffenseUsed: false,
    yaoBlockDrawn: false,
    lowHpTriggered: false,
  }));
  state.deck = buildDeck();
  state.discard = [];
  state.current = 0;
  state.phase = "draw";
  state.offensiveUsed = false;
  state.selectedCardIndex = null;
  state.awaitingTarget = null;
  state.pendingResponse = null;
  state.discardRequest = null;
  state.turnNumber = 1;
  state.clock = 720;
  state.countdownLabel = "";
  state.countdownLeft = 0;
  state.homeScore = 0;
  state.awayScore = 0;
  state.gameOver = false;
  state.logEntries = [];
  qs("#log").innerHTML = "";
  qs("#discardPile").innerHTML = "";

  state.players.forEach((player) => drawCards(player, 4, false));
  qs("#startModal").classList.remove("active");
  log(options.lan ? "局域网开球！房主同步整场比赛。" : "开球！你是球队核心，身份公开。");
  showTip("新手提示：先点一张手牌，再点球员目标。结束回合若超出手牌上限，可以自己选择弃牌。", 6200);
  playSound("crowd");
  startTurn();
  publishGameState();
}

function drawOne() {
  if (!state.deck.length) {
    state.deck = shuffle(state.discard.splice(0).map((card) => cloneCard(card.id)));
    log("牌堆打乱重洗。");
  }
  return state.deck.pop();
}

function drawCards(player, count, announce = true) {
  for (let i = 0; i < count; i += 1) {
    const card = drawOne();
    if (card) player.hand.push(card);
  }
  if (announce) log(`${player.role.cn} 摸了 ${count} 张牌。`);
  playSound("draw");
}

function startTurn() {
  if (state.gameOver) return;
  clearCountdown();
  clearAutoEnd();
  const player = currentPlayer();
  if (!player?.alive) return nextTurn();
  state.phase = "draw";
  state.offensiveUsed = false;
  state.awaitingTarget = null;
  state.selectedCardIndex = null;
  player.autoGuardUsed = false;
  player.sleeveUsed = false;
  player.fundamentalsUsed = false;
  player.yaoBlockDrawn = false;
  player.offenseLocked = false;
  player.extraOffenseUsed = false;
  player.screenTurns = Math.max(0, player.screenTurns || 0);
  tickClock();
  render();
  log(`轮到 ${player.role.cn}。`);
  drawCards(player, 2);
  state.phase = "play";
  render();
  if (player.ai) {
    setTimeout(() => aiTurn(player), 700);
  } else {
    startCountdown(45, "出牌", () => {
      showTip("进攻时间到，自动结束本回合。");
      if (isAuthoritativeClient() && currentPlayer() === player && state.phase === "play") nextTurn();
    });
    if (isLocalPlayer(player)) maybeAutoEndUserTurn();
    else maybeAutoEndHumanTurn(player);
  }
}

function currentPlayer() {
  return state.players[state.current];
}

function localPlayerIndex() {
  if (state.playMode === "lan" && state.roomCode) {
    const index = state.players.findIndex((player) => player.clientId === state.clientId);
    return index >= 0 ? index : 0;
  }
  return 0;
}

function localPlayer() {
  return state.players[localPlayerIndex()];
}

function isLocalPlayer(player) {
  return state.players.indexOf(player) === localPlayerIndex();
}

function isAuthoritativeClient() {
  return state.playMode !== "lan" || !state.roomCode || roomHost;
}

function isLanHostGame() {
  return state.playMode === "lan" && state.roomCode && state.roomStarted && roomHost;
}

function nextTurn() {
  if (!cleanupHandLimit(currentPlayer(), advanceTurn)) return;
  advanceTurn();
}

function advanceTurn() {
  clearCountdown();
  clearAutoEnd();
  state.current = nextAliveIndex(state.current);
  state.turnNumber += 1;
  if (state.turnNumber % 4 === 1) {
    state.players.forEach((p) => {
      p.autoGuardUsed = false;
      p.sleeveUsed = false;
      p.fundamentalsUsed = false;
      p.yaoBlockDrawn = false;
    });
  }
  startTurn();
}

function nextAliveIndex(from) {
  let next = from;
  do {
    next = (next + 1) % state.players.length;
  } while (!state.players[next].alive);
  return next;
}

function cleanupHandLimit(player, onDone = null) {
  if (!player?.alive) return true;
  const limit = Math.max(1, player.hp + (player.equipment.board ? 1 : 0));
  if (!player.ai && player.hand.length > limit) {
    const need = player.hand.length - limit;
    startDiscardRequest({
      player,
      count: need,
      reason: `手牌上限为 ${limit}，请选择弃置 ${need} 张。`,
      onDone,
    });
    return false;
  }
  while (player.hand.length > limit) {
    const card = discardCard(player, player.hand.length - 1);
    if (card) log(`${player.role.cn} 因手牌上限弃置 ${card.name}。`);
  }
  return true;
}

function tickClock() {
  state.clock = Math.max(0, state.clock - (12 + Math.floor(Math.random() * 10)));
  if (state.clock === 0) state.clock = 720;
}

function render() {
  renderScoreboard();
  renderPlayers();
  renderHand();
  renderDiscard();
  renderLog();
  renderTargetHint();
  renderResponsePanel();
  publishGameState();
}

function renderScoreboard() {
  qs("#homeScore").textContent = String(state.homeScore).padStart(2, "0");
  qs("#awayScore").textContent = String(state.awayScore).padStart(2, "0");
  qs("#quarterLabel").textContent = `Q${Math.min(4, Math.ceil(state.turnNumber / 8))}`;
  const minutes = Math.floor(state.clock / 60);
  const seconds = state.clock % 60;
  qs("#clockLabel").textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
  qs("#phaseLabel").textContent = phaseLabel();
  qs("#turnTimerLabel").textContent = state.countdownLabel ? `${state.countdownLabel} ${state.countdownLeft}` : "";
  qs("#soundToggle").textContent = state.sound ? "♪" : "×";
  qs("#settingsBtn").textContent = ({ portrait: "◉", classic: "◐", photo: "◍" })[state.avatarStyle] || "◉";
}

function countdownBadge(scope) {
  if (state.countdownLabel !== scope || state.countdownLeft <= 0) return "";
  return `<span class="btn-countdown">${state.countdownLeft}</span>`;
}

function buttonWithCountdown(label, scope) {
  return `${label}${countdownBadge(scope)}`;
}

function renderCountdownControls() {
  const endTurnBtn = qs("#endTurnBtn");
  if (endTurnBtn) {
    if (state.discardRequest?.playerIndex === localPlayerIndex()) {
      const selected = state.discardRequest.selected?.length || 0;
      endTurnBtn.innerHTML = `确认弃置 ${selected}/${discardRequestNeeded()}${countdownBadge("弃牌")}`;
    } else {
      endTurnBtn.innerHTML = buttonWithCountdown("结束回合", "出牌");
    }
  }
  qsa("[data-countdown-scope]").forEach((button) => {
    button.innerHTML = buttonWithCountdown(button.dataset.responseLabel, button.dataset.countdownScope);
  });
}

function phaseLabel() {
  if (state.gameOver) return "终场";
  if (state.discardRequest) return "弃牌";
  if (state.pendingResponse) return "响应";
  if (state.awaitingTarget) return "选目标";
  if (state.phase === "draw") return "摸牌";
  if (state.phase === "play") return currentPlayer()?.ai ? "AI" : "出牌";
  return "开球";
}

function renderPlayers() {
  const grid = qs("#playerGrid");
  grid.className = `player-grid count-${state.players.length}`;
  grid.innerHTML = state.players.map((player, index) => {
    const targetable = isTargetable(index);
    const identityVisible = player.revealed || !player.alive || player.identity === "核心" || index === localPlayerIndex();
    const displaySeat = displaySeatFor(index);
    return `
      <button class="player-seat ${displaySeat} ${index === localPlayerIndex() ? "local-seat" : ""} ${index === state.current ? "active-turn" : ""} ${targetable ? "targetable" : ""} ${player.alive ? "" : "eliminated"}"
        type="button" data-player="${index}" ${targetable ? "" : "tabindex='-1'"} style="--seat:${index}">
        <span class="identity-badge ${identityVisible ? "" : "hidden"}">${identityVisible ? player.identity : "隐藏"}</span>
        ${renderPlayerCard(player)}
      </button>
    `;
  }).join("") + `<div class="player-seat center"></div>`;
  qsa("[data-player]").forEach((el) => {
    el.addEventListener("click", () => chooseTarget(Number(el.dataset.player)));
  });
}

function displaySeatFor(index) {
  const count = state.players.length || 4;
  const seats = seatLayouts[count] || seatLayouts[4];
  const localIndex = localPlayerIndex();
  const visualIndex = (index - localIndex + count) % count;
  return seats[visualIndex] || "center";
}

function renderHand() {
  const hand = qs("#hand");
  const user = localPlayer();
  if (!user) {
    qs("#handCount").textContent = "0";
    hand.innerHTML = "";
    qs("#sortHandBtn").disabled = true;
    qs("#endTurnBtn").disabled = true;
    return;
  }
  qs("#handCount").textContent = String(user.hand.length);
  const discardMode = Boolean(state.discardRequest?.playerIndex === localPlayerIndex());
  const selectedDiscard = state.discardRequest?.selected || [];
  hand.innerHTML = user.hand.map((card, index) => {
    const reason = cardBlockReason(user, card);
    const discardKey = `hand:${card.uid}`;
    const disabled = discardMode ? false : Boolean(reason);
    return `
      <button class="action-card ${disabled ? "disabled" : ""} ${discardMode ? "discard-selectable" : ""} ${selectedDiscard.includes(discardKey) ? "discard-selected" : ""}" type="button" draggable="true" data-card="${index}" data-discard-key="${discardKey}" title="${discardMode ? "点击选择弃置" : reason || card.desc}" style="--card-color:${card.color}">
        <span class="card-type">${card.type} · ${card.suit}${card.rank}</span>
        <div class="card-title">${card.name}</div>
        <div class="card-art">${card.icon}</div>
        <p class="card-desc">${card.desc}</p>
      </button>
    `;
  }).join("");
  qsa("[data-card]").forEach((el) => {
    el.addEventListener("click", () => {
      if (state.discardRequest?.playerIndex === localPlayerIndex()) {
        toggleDiscardChoice(el.dataset.discardKey);
      } else {
        selectCard(Number(el.dataset.card));
      }
    });
    el.addEventListener("dragstart", handleHandDragStart);
    el.addEventListener("dragover", handleHandDragOver);
    el.addEventListener("dragleave", handleHandDragLeave);
    el.addEventListener("drop", handleHandDrop);
    el.addEventListener("dragend", handleHandDragEnd);
  });
  qs("#sortHandBtn").disabled = state.gameOver || discardMode || user.hand.length < 2;
  const discardNeeded = discardMode ? discardRequestNeeded() : 0;
  qs("#endTurnBtn").innerHTML = discardMode ? `确认弃置 ${selectedDiscard.length}/${discardNeeded}${countdownBadge("弃牌")}` : buttonWithCountdown("结束回合", "出牌");
  qs("#endTurnBtn").disabled = state.gameOver || state.pendingResponse || (discardMode && selectedDiscard.length < discardNeeded) || (!discardMode && (currentPlayer() !== user || state.phase !== "play"));
}

function renderDiscard() {
  qs("#discardPile").innerHTML = state.discard.slice(-20).reverse().map((card) => `<span class="discard-chip">${card.name}</span>`).join("");
}

function renderLog() {
  const logEl = qs("#log");
  if (!logEl || !state.logEntries?.length) return;
  logEl.innerHTML = state.logEntries.map((message) => `<div class="log-entry">${escapeHtml(message)}</div>`).join("");
}

function renderTargetHint() {
  const hint = qs("#targetHint");
  if (!state.awaitingTarget) {
    hint.classList.remove("active");
    hint.textContent = "";
    return;
  }
  const card = state.awaitingTarget.card;
  hint.textContent = `选择 ${card.name} 的目标`;
  hint.classList.add("active");
}

function renderResponsePanel() {
  const panel = qs("#responsePanel");
  if (!state.pendingResponse || state.pendingResponse.playerIndex !== localPlayerIndex()) {
    panel.classList.remove("active");
    panel.innerHTML = "";
    return;
  }
  const pending = state.pendingResponse;
  const target = state.players[pending.playerIndex];
  const source = state.players[pending.sourceIndex];
  const allowedNames = pending.allowed.map((id) => cardCatalog[id].name).join(" / ");
  panel.classList.add("active");
  panel.innerHTML = `
    <div class="response-copy">
      <strong>${target.role.cn} 需要响应 ${source.role.cn} 的 ${pending.card.name}</strong>
      <span>可用：${allowedNames}。还需要 ${pending.need - pending.used} 张。</span>
    </div>
    <div class="response-actions">
      ${pending.allowed.map((id) => `<button type="button" data-response-card="${id}">${cardCatalog[id].name}</button>`).join("")}
      <button type="button" data-response-pass="1" data-response-label="不响应" data-countdown-scope="响应">${buttonWithCountdown("不响应", "响应")}</button>
    </div>
  `;
  qsa("[data-response-card]").forEach((button) => {
    button.addEventListener("click", () => respondWithCard(button.dataset.responseCard));
  });
  qs("[data-response-pass]")?.addEventListener("click", passResponse);
}

function renderDiscardPanel() {
  const panel = qs("#discardPanel");
  if (!panel) return;
  const req = state.discardRequest;
  if (!req || req.playerIndex !== localPlayerIndex()) {
    panel.classList.remove("active");
    panel.innerHTML = "";
    return;
  }
  const player = state.players[req.playerIndex];
  const choices = discardableItems(player);
  const needed = Math.min(req.count, choices.length);
  const selected = req.selected || [];
  panel.classList.add("active");
  panel.innerHTML = `
    <div class="discard-copy">
      <strong>请选择弃牌</strong>
      <span>${req.reason} 已选 ${selected.length}/${needed}。</span>
    </div>
    <div class="discard-choices">
      ${choices.map((item) => `
        <button class="discard-choice ${selected.includes(item.key) ? "selected" : ""}" type="button" data-discard-key="${item.key}">
          ${item.label}
        </button>
      `).join("") || "<span class='pill'>没有可弃置的牌</span>"}
    </div>
    <div class="discard-actions">
      <button type="button" data-confirm-discard="1" ${selected.length < needed ? "disabled" : ""}>确认弃置</button>
    </div>
  `;
  qsa("[data-discard-key]").forEach((button) => {
    button.addEventListener("click", () => toggleDiscardChoice(button.dataset.discardKey));
  });
  qs("[data-confirm-discard]")?.addEventListener("click", confirmDiscardRequest);
}

function discardRequestNeeded(req = state.discardRequest) {
  if (!req) return 0;
  return Math.min(req.count, discardableItems(state.players[req.playerIndex]).length);
}

function handleHandDragStart(event) {
  event.currentTarget.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", event.currentTarget.dataset.card);
  createDragGhost(event.currentTarget, event.clientX, event.clientY);
  event.dataTransfer.setDragImage(qs("#dragGhost"), 54, 69);
  document.addEventListener("dragover", moveDragGhost);
}

function handleHandDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drop-target");
}

function handleHandDragLeave(event) {
  event.currentTarget.classList.remove("drop-target");
}

function handleHandDrop(event) {
  event.preventDefault();
  const from = Number(event.dataTransfer.getData("text/plain"));
  const to = Number(event.currentTarget.dataset.card);
  qsa(".action-card").forEach((card) => card.classList.remove("drop-target", "dragging"));
  reorderHand(from, to);
}

function handleHandDragEnd() {
  qsa(".action-card").forEach((card) => card.classList.remove("drop-target", "dragging"));
  document.removeEventListener("dragover", moveDragGhost);
  removeDragGhost();
}

function createDragGhost(source, x, y) {
  removeDragGhost();
  const ghost = document.createElement("div");
  ghost.id = "dragGhost";
  ghost.className = "drag-ghost";
  ghost.innerHTML = source.outerHTML;
  document.body.appendChild(ghost);
  positionDragGhost(x, y);
}

function moveDragGhost(event) {
  positionDragGhost(event.clientX, event.clientY);
}

function positionDragGhost(x, y) {
  const ghost = qs("#dragGhost");
  if (!ghost) return;
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
}

function removeDragGhost() {
  qs("#dragGhost")?.remove();
}

function reorderHand(from, to) {
  const player = localPlayer();
  if (!player || Number.isNaN(from) || Number.isNaN(to) || from === to) return;
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "reorder", from, to });
    showTip("已发送手牌排序。", 1200);
    return;
  }
  const [card] = player.hand.splice(from, 1);
  if (!card) return;
  player.hand.splice(to, 0, card);
  showTip("手牌顺序已调整。", 1400);
  render();
}

function sortUserHand() {
  const player = localPlayer();
  if (!player) return;
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "sort" });
    showTip("已发送一键排序。", 1200);
    return;
  }
  sortHandForPlayer(player);
  showTip("已按进攻、响应、治疗、战术、装备排序。");
  render();
}

function sortHandForPlayer(player) {
  const suitOrder = { "♠": 1, "♥": 2, "♣": 3, "♦": 4 };
  player.hand.sort((a, b) => {
    const typeDiff = (cardSortOrder[a.id] || 99) - (cardSortOrder[b.id] || 99);
    if (typeDiff) return typeDiff;
    const suitDiff = (suitOrder[a.suit] || 9) - (suitOrder[b.suit] || 9);
    if (suitDiff) return suitDiff;
    return a.rank - b.rank;
  });
}

function canPlayCard(player, card) {
  return !cardBlockReason(player, card);
}

function cardBlockReason(player, card) {
  if (state.gameOver) return "比赛已经结束。";
  if (state.discardRequest) return "正在弃牌，请先完成弃牌选择。";
  if (state.pendingResponse) {
    if (state.pendingResponse.playerIndex !== state.players.indexOf(player)) return "现在不是你响应。";
    if (!state.pendingResponse.allowed.includes(card.id)) {
      const allowedNames = state.pendingResponse.allowed.map((id) => cardCatalog[id].name).join(" / ");
      return `这次响应只能用 ${allowedNames}。`;
    }
    return "";
  }
  if (currentPlayer() !== player) return "还没轮到你。";
  if (state.phase !== "play") return "当前不是出牌阶段。";
  if (state.awaitingTarget) return "请先选择上一张牌的目标。";
  if (card.reactive) return `${card.name} 是响应牌，只能在被进攻或被战术指定时使用。`;
  if (card.offensive && player.offenseLocked) return "你被战术犯规，本回合不能使用进攻牌。";
  if (card.offensive && !canUseOffensive(player)) return "本回合已使用过进攻牌。";
  if (card.id === "timeout" && player.hp >= player.maxHp) return "当前体能已满，不能使用暂停回血。";
  if (!hasLegalTarget(player, card)) return targetlessReason(player, card);
  return "";
}

function canUseOffensive(player) {
  if (!state.offensiveUsed) return true;
  return player.role.id === "kobe" && !player.extraOffenseUsed;
}

function selectCard(index) {
  const player = localPlayer();
  if (!player) return;
  const card = player.hand[index];
  if (!card) return;
  const reason = cardBlockReason(player, card);
  if (reason) {
    showTip(reason);
    playSound("deny");
    return;
  }
  unlockAudio();
  if (state.pendingResponse) {
    respondWithCard(card.id, index);
    return;
  }
  state.selectedCardIndex = index;
  if (card.target === "none" || card.target === "self") {
    const targetIndex = card.target === "self" ? localPlayerIndex() : null;
    if (!isAuthoritativeClient()) {
      sendLanAction({ kind: "play", cardUid: card.uid, cardIndex: index, targetIndex });
      return;
    }
    playCard(player, card, targetIndex, index);
  } else {
    state.awaitingTarget = { playerIndex: localPlayerIndex(), card, cardIndex: index };
    showTip(`请选择 ${card.name} 的目标。`);
    render();
  }
}

function isTargetable(index) {
  if (!state.awaitingTarget || !state.players[index]?.alive) return false;
  const { playerIndex, card } = state.awaitingTarget;
  if (index === playerIndex && card.target !== "any") return false;
  if (card.target === "enemy") {
    return index !== playerIndex && isInCardRange(state.players[playerIndex], state.players[index], card);
  }
  if (card.target === "any") return true;
  return false;
}

function hasLegalTarget(player, card) {
  if (card.target === "self" || card.target === "none") return true;
  if (card.target === "any") return state.players.some((p) => p.alive);
  if (card.target === "enemy") {
    return state.players.some((p) => p.alive && p !== player && isInCardRange(player, p, card));
  }
  return true;
}

function targetlessReason(player, card) {
  if (card.target !== "enemy") return "当前没有合法目标。";
  const nearest = state.players
    .filter((p) => p.alive && p !== player)
    .map((p) => tableDistance(player, p))
    .sort((a, b) => a - b)[0];
  const range = card.offensive ? attackRange(player, card) : 1 + (player.equipment.shoes ? 1 : 0);
  return `没有目标在距离内：${card.name} 可达距离 ${range}，最近目标距离 ${nearest ?? "-"}。`;
}

function alivePlayers() {
  return state.players.filter((player) => player.alive);
}

function tableDistance(from, to) {
  if (!from || !to || from === to) return 0;
  const alive = alivePlayers();
  const fromPos = alive.indexOf(from);
  const toPos = alive.indexOf(to);
  if (fromPos < 0 || toPos < 0) return 99;
  const diff = Math.abs(fromPos - toPos);
  return Math.min(diff, alive.length - diff);
}

function attackRange(player, card) {
  let range = card.range || 1;
  if (player.equipment.shoes) range += 1;
  if (player.role.id === "curry" && card.id === "three") range += 2;
  if (player.role.id === "yi" && card.id === "three") range += 1;
  if (player.role.id === "guo" && card.id === "breakthrough") range += 1;
  if (player.role.id === "tatum" && player.hand.length < player.hp && card.id === "breakthrough") range += 1;
  if (player.screenTurns > 0 && card.offensive) return 99;
  return range;
}

function defenseDistanceBonus(player) {
  return player.equipment.sleeve ? 1 : 0;
}

function isInCardRange(player, target, card) {
  if (!card.offensive && !card.hostile && !["steal", "double", "foul"].includes(card.id)) return true;
  const base = card.offensive ? attackRange(player, card) : 1 + (player.equipment.shoes ? 1 : 0);
  return tableDistance(player, target) <= base + defenseDistanceBonus(target);
}

function chooseTarget(targetIndex) {
  if (!isTargetable(targetIndex)) {
    showTip(targetBlockReason(targetIndex));
    playSound("deny");
    return;
  }
  const pending = state.awaitingTarget;
  state.awaitingTarget = null;
  const player = state.players[pending.playerIndex];
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "play", cardUid: pending.card.uid, cardIndex: pending.cardIndex, targetIndex });
    showTip("已提交出牌。", 1200);
    render();
    return;
  }
  playCard(player, pending.card, targetIndex, pending.cardIndex);
}

function targetBlockReason(targetIndex) {
  const target = state.players[targetIndex];
  if (!state.awaitingTarget) return "先选择一张需要目标的手牌。";
  if (!target?.alive) return "这个球员已经离场，不能作为目标。";
  const { playerIndex, card } = state.awaitingTarget;
  const player = state.players[playerIndex];
  if (targetIndex === playerIndex && card.target !== "any") return "这张牌不能指定自己。";
  if (card.target === "enemy" && targetIndex === playerIndex) return "进攻和干扰牌需要指定其他球员。";
  if (card.target === "enemy" && !isInCardRange(player, target, card)) {
    const distance = tableDistance(player, target);
    const range = card.offensive ? attackRange(player, card) : 1 + (player.equipment.shoes ? 1 : 0);
    return `距离不够：当前距离 ${distance}，${card.name} 可达 ${range}${target.equipment.sleeve ? "，目标护臂让防守距离更远" : ""}。`;
  }
  return "这个目标不符合当前牌的使用条件。";
}

function playCard(player, card, targetIndex, cardIndex = player.hand.findIndex((c) => c.uid === card.uid)) {
  if (!player.alive) return;
  const [used] = player.hand.splice(cardIndex, 1);
  if (used && !card.equip) state.discard.push(used);
  if (card.offensive) {
    if (state.offensiveUsed) player.extraOffenseUsed = true;
    state.offensiveUsed = true;
    if (player.screenTurns > 0) player.screenTurns -= 1;
  }
  log(`${player.role.cn} 使用 ${card.name}${targetIndex !== null && targetIndex !== undefined ? `，目标 ${state.players[targetIndex].role.cn}` : ""}。`);
  animateBallTo(player, targetIndex);
  playSound(soundForCard(card));

  if (card.id === "breakthrough" || card.id === "three") resolveAttack(player, state.players[targetIndex], card);
  if (card.id === "timeout") heal(player, 1);
  if (card.id === "penalty") resolvePenalty(player);
  if (card.id === "assist") resolveAssist(player, state.players[targetIndex]);
  if (card.id === "steal") resolveSteal(player, state.players[targetIndex]);
  if (card.id === "fastbreak") resolveFastbreak(player);
  if (card.id === "double") resolveDouble(player, state.players[targetIndex]);
  if (card.id === "screen") resolveScreen(player);
  if (card.id === "foul") resolveFoul(player, state.players[targetIndex]);
  if (card.id === "momentum") resolveMomentum(player, state.players[targetIndex]);
  if (card.equip) equipCard(player, card);

  if (player.role.id === "doncic" && card.tactic) {
    drawCards(player, 1);
    log("东契奇发动节奏大师。");
  }
  if (player.role.id === "nash" && card.id === "assist") {
    drawCards(player, 1);
    log("纳什发动太阳快传。");
  }
  checkWin();
  render();
  if (!player.ai && !state.gameOver && !state.pendingResponse && currentPlayer() === player && state.phase === "play") {
    if (isLocalPlayer(player)) maybeAutoEndUserTurn();
    else maybeAutoEndHumanTurn(player);
  }
}

function resolveAttack(attacker, target, card) {
  if (!target?.alive) return;
  if (!isInCardRange(attacker, target, card)) {
    log(`${target.role.cn} 不在 ${card.name} 距离内，进攻无效。`);
    return;
  }
  const autoGuard = target.role.id === "wemby" && !target.autoGuardUsed;
  if (autoGuard) {
    target.autoGuardUsed = true;
    log(`${target.role.cn} 发动遮天蔽日，自动防守。`);
    playSound("block");
    if (card.id === "three" || attacker.role.id === "curry") drawCards(attacker, 1);
    return;
  }
  const need = attackResponseNeed(attacker, target, card);
  startResponse({
    type: "attack",
    sourceIndex: state.players.indexOf(attacker),
    playerIndex: state.players.indexOf(target),
    card,
    allowed: ["defense", "block"],
    need,
    onSuccess: () => {
      log(`${target.role.cn} 完成防守，化解 ${card.name}。`);
      playSound("block");
      if (card.id === "three" || attacker.role.id === "curry") drawCards(attacker, 1);
      if (target.role.id === "shai") discardFrom(attacker, 1, "亚历山大丝滑变向：请选择弃置 1 张牌。");
      if (target.role.id === "yao" && !target.yaoBlockDrawn) {
        target.yaoBlockDrawn = true;
        drawCards(target, 1);
        log("姚明发动长城护框。");
      }
    },
    onFail: () => completeAttack(attacker, target, card),
  });
}

function attackResponseNeed(attacker, target, card) {
  if (card.id !== "breakthrough") return 1;
  if (attacker.role.id === "giannis" || attacker.role.id === "shaq") return 2;
  return 1;
}

function completeAttack(attacker, target, card) {
  damage(attacker, target, 1, card.id === "three" ? "三分命中" : "突破上篮");
  if (!target.alive) return;
  if (attacker.role.id === "lebron" && card.id === "breakthrough") {
    drawCards(attacker, 1);
    log("勒布朗发动王者推进。");
  }
  if ((attacker.role.id === "giannis" || attacker.role.id === "shaq") && card.id === "breakthrough") {
    discardFrom(target, 1, `${attacker.role.cn} 的禁区压制：请选择弃置 1 张牌。`);
    log(`${attacker.role.cn} 发动禁区压制。`);
  }
  if (attacker.role.id === "jordan" && attacker.hp === 1) {
    drawCards(attacker, 1);
    log("乔丹发动最后一投。");
  }
  if (attacker.role.id === "wang" && card.id === "three") {
    discardFrom(target, 1, "王治郅的内外摇摆：请选择弃置 1 张牌。");
    log("王治郅发动内外摇摆。");
  }
}

function resolveAssist(player, target) {
  if (!target?.alive) return;
  drawCards(target, player.role.id === "jokic" ? 3 : 2);
  if (player.role.id === "jokic") log("约基奇发动中轴策应。");
}

function resolveSteal(player, target) {
  if (!target?.alive) return;
  startHostileTactic(player, target, cardCatalog.steal, () => {
    discardFrom(target, 1, `${player.role.cn} 抢断：请选择弃置 1 张牌。`, (discarded) => {
      if (!discarded) log(`${target.role.cn} 没有可抢断的牌。`);
      playSound("whistle");
      render();
    });
  });
}

function resolveFastbreak(player) {
  const targets = state.players.filter((p) => p.alive && p !== player).slice(0, 2);
  const resolveNext = (index = 0) => {
    if (index >= targets.length || state.gameOver || !player.alive) return;
    if (state.pendingResponse || state.discardRequest) {
      window.setTimeout(() => resolveNext(index), 300);
      return;
    }
    const target = targets[index];
    if (target?.alive) {
      log(`快攻冲向 ${target.role.cn}。`);
      resolveAttack(player, target, { id: "breakthrough", ...cardCatalog.breakthrough });
      if (player.role.id === "edwards" && index === 0) {
        drawCards(player, 1);
        log("爱德华兹发动起飞隔扣。");
      }
      render();
    }
    window.setTimeout(() => resolveNext(index + 1), 320);
  };
  resolveNext();
}

function resolveDouble(player, target) {
  startHostileTactic(player, target, cardCatalog.double, () => {
    discardFrom(target, 2, `${player.role.cn} 包夹：请选择弃置 2 张牌。`, (discarded) => {
      if (discarded < 2) damage(player, target, 1, "包夹失误");
      render();
    });
  });
}

function resolvePenalty(player) {
  const judged = judge("罚球");
  if (judged.colorName === "red") {
    heal(player, 1);
    if (player.role.id === "yi") drawCards(player, 1);
  } else {
    drawCards(player, 1);
  }
}

function resolveScreen(player) {
  player.screenTurns = 1;
  log(`${player.role.cn} 完成挡拆，下一次进攻距离无限。`);
}

function resolveFoul(player, target) {
  startHostileTactic(player, target, cardCatalog.foul, () => {
    target.offenseLocked = true;
    log(`${target.role.cn} 被战术犯规，本回合不能使用进攻牌。`);
    playSound("whistle");
  });
}

function resolveMomentum(player, target) {
  drawCards(player, 1);
  if (target && target !== player) drawCards(target, 1);
  log(`${player.role.cn} 发动更衣室鼓舞。`);
}

function startHostileTactic(player, target, card, onResolve) {
  if (!target?.alive) return;
  if (!isInCardRange(player, target, card)) {
    log(`${target.role.cn} 不在 ${card.name} 距离内，战术无效。`);
    return;
  }
  startResponse({
    type: "tactic",
    sourceIndex: state.players.indexOf(player),
    playerIndex: state.players.indexOf(target),
    card,
    allowed: ["block", "challenge"],
    need: 1,
    onSuccess: () => {
      log(`${target.role.cn} 抵消了 ${card.name}。`);
      playSound("block");
    },
    onFail: onResolve,
  });
}

function equipCard(player, card) {
  if (player.equipment[card.equip]) state.discard.push(player.equipment[card.equip]);
  player.equipment[card.equip] = card;
  log(`${player.role.cn} 装备了 ${card.name}。`);
}

function judge(reason) {
  const card = drawOne();
  if (!card) return { colorName: "black", suit: "♠", rank: 1, name: "空牌" };
  state.discard.push(card);
  log(`${reason} 判定：${card.name} ${card.suit}${card.rank}，${card.colorName === "red" ? "红色" : "黑色"}。`);
  playSound(card.colorName === "red" ? "swish" : "whistle");
  return card;
}

function startResponse(config) {
  if (state.pendingResponse || state.discardRequest) {
    log("上一段响应链仍在结算，新的响应暂缓。");
    return;
  }
  const target = state.players[config.playerIndex];
  if (!target?.alive) return config.onFail?.();
  const availableResponses = countCards(target, config.allowed);
  const aiCanRespond = target.ai && availableResponses >= config.need;
  if (target.ai) {
    if (aiCanRespond) {
      for (let i = 0; i < config.need; i += 1) {
        const index = findCardIndex(target, config.allowed);
        if (index === -1) return config.onFail?.();
        const card = discardCard(target, index);
        log(`${target.role.cn} 响应 ${card.name}。`);
      }
      return config.onSuccess?.();
    }
    return config.onFail?.();
  }
  if (!availableResponses) {
    const allowedNames = config.allowed.map((id) => cardCatalog[id].name).join(" / ");
    showTip(`手上没有 ${allowedNames}，快速跳过响应。`);
    clearAutoEnd();
    autoEndTimer = window.setTimeout(() => {
      config.onFail?.();
      checkWin();
      if (!state.gameOver && !state.discardRequest && currentPlayer()?.ai) setTimeout(nextTurn, 650);
      render();
    }, 650);
    return;
  }
  state.pendingResponse = { ...config, used: 0 };
  render();
  startCountdown(12, "响应", () => {
    showTip("响应时间到，自动放弃响应。");
    passResponseForPlayer(config.playerIndex);
  });
}

function respondWithCard(cardId, explicitIndex = null) {
  const pending = state.pendingResponse;
  if (!pending || pending.playerIndex !== localPlayerIndex() || !pending.allowed.includes(cardId)) return;
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "response", cardId, explicitIndex });
    showTip("已提交响应。", 1200);
    return;
  }
  respondWithCardForPlayer(pending.playerIndex, cardId, explicitIndex);
}

function respondWithCardForPlayer(playerIndex, cardId, explicitIndex = null) {
  const pending = state.pendingResponse;
  if (!pending || pending.playerIndex !== playerIndex || !pending.allowed.includes(cardId)) return;
  const player = state.players[pending.playerIndex];
  const requestedIndex = explicitIndex === null || explicitIndex === undefined ? -1 : Number(explicitIndex);
  const index = player.hand[requestedIndex]?.id === cardId ? requestedIndex : findCardIndex(player, [cardId]);
  if (index === -1) {
    log(`你没有可用的 ${cardCatalog[cardId].name}。`);
    showTip(`你没有 ${cardCatalog[cardId].name}，可以换另一张响应牌或点不响应。`);
    return;
  }
  clearAutoEnd();
  const card = discardCard(player, index);
  pending.used += 1;
  log(`${player.role.cn} 响应 ${card.name}。`);
  if (pending.used >= pending.need) {
    clearCountdown();
    const onSuccess = pending.onSuccess;
    state.pendingResponse = null;
    onSuccess?.();
    checkWin();
    if (!state.gameOver && !state.discardRequest && currentPlayer()?.ai) setTimeout(nextTurn, 650);
  } else if (findCardIndex(player, pending.allowed) === -1) {
    showTip(`${player.role.cn} 没有剩余响应牌，自动不响应。`);
    window.setTimeout(() => passResponseForPlayer(playerIndex), 320);
  }
  render();
}

function passResponse() {
  const pending = state.pendingResponse;
  if (!pending || pending.playerIndex !== localPlayerIndex()) return;
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "pass-response" });
    showTip("已选择不响应。", 1200);
    return;
  }
  passResponseForPlayer(pending.playerIndex);
}

function passResponseForPlayer(playerIndex) {
  const pending = state.pendingResponse;
  if (!pending || pending.playerIndex !== playerIndex) return;
  clearCountdown();
  clearAutoEnd();
  const onFail = pending.onFail;
  state.pendingResponse = null;
  log(`${state.players[pending.playerIndex].role.cn} 放弃响应。`);
  onFail?.();
  checkWin();
  if (!state.gameOver && !state.discardRequest && currentPlayer()?.ai) setTimeout(nextTurn, 650);
  render();
}

function heal(player, amount) {
  const before = player.hp;
  player.hp = Math.min(player.maxHp, player.hp + amount);
  if (player.hp > before) {
    log(`${player.role.cn} 回复 ${player.hp - before} 点体能。`);
    playSound("swish");
  }
}

function damage(source, target, amount, reason) {
  if (!target?.alive) return;
  let finalAmount = amount;
  if (target.equipment.sleeve && !target.sleeveUsed) {
    target.sleeveUsed = true;
    finalAmount = Math.max(0, finalAmount - 1);
    log(`${target.role.cn} 的护臂吸收了伤害。`);
  }
  if (target.role.id === "duncan" && !target.fundamentalsUsed) {
    target.fundamentalsUsed = true;
    finalAmount = Math.max(0, finalAmount - 1);
    log("邓肯发动基本功，减少 1 点伤害。");
  }
  if (finalAmount <= 0) return;
  target.hp -= finalAmount;
  log(`${reason}！${target.role.cn} 失去 ${finalAmount} 点体能。`);
  addScore(source, reason.includes("三分") ? 3 : 2);
  flashSeat(target);
  playSound(reason.includes("三分") ? "swish" : "hit");
  if (target.role.id === "brunson" && target.hp === 1 && !target.lowHpTriggered) {
    target.lowHpTriggered = true;
    drawCards(target, 2);
    log("布伦森发动低位控卫。");
  }
  if (target.hp <= 0) attemptRescue(source, target);
}

function attemptRescue(source, target) {
  if (target.equipment.ring) {
    state.discard.push(target.equipment.ring);
    delete target.equipment.ring;
    target.hp = 1;
    log(`${target.role.cn} 的冠军戒指生效，自动回到 1 点体能。`);
    playSound("swish");
    return;
  }
  const savior = state.players.find((player) => player.alive && findCardIndex(player, ["timeout"]) !== -1);
  if (savior) {
    discardCard(savior, findCardIndex(savior, ["timeout"]));
    target.hp = 1;
    log(`${savior.role.cn} 请求暂停，救回 ${target.role.cn}。`);
    playSound("whistle");
    return;
  }
  eliminate(source, target);
}

function eliminate(source, target) {
  target.alive = false;
  target.revealed = true;
  target.hp = 0;
  target.hand.splice(0).forEach((card) => state.discard.push(card));
  Object.keys(target.equipment).forEach((key) => delete target.equipment[key]);
  log(`${target.role.cn} 离场，身份是 ${target.identity}。`);
  playSound("buzzer");
  if (target.identity === "挑战者" && source?.alive) {
    drawCards(source, 3);
    log(`${source.role.cn} 淘汰挑战者，摸 3 张。`);
  }
  if (source?.identity === "核心" && target.identity === "队友") {
    source.hand.splice(0).forEach((card) => state.discard.push(card));
    Object.keys(source.equipment).forEach((key) => delete source.equipment[key]);
    log("核心误伤队友，清空手牌和装备。");
  }
}

function checkWin() {
  const core = state.players.find((p) => p.identity === "核心");
  const alive = state.players.filter((p) => p.alive);
  if (!core.alive && alive.length === 1 && alive[0].identity === "独狼") {
    return finishGame("独狼获胜，完成最后单挑。");
  }
  if (!core.alive) return finishGame("挑战者阵营获胜，球队核心离场。");
  const enemies = alive.filter((p) => p.identity === "挑战者" || p.identity === "独狼");
  if (!enemies.length) return finishGame("核心阵营获胜，清除了所有威胁。");
  const lone = alive.find((p) => p.identity === "独狼");
  if (alive.length === 1 && lone) return finishGame("独狼获胜，完成最后单挑。");
  return null;
}

function finishGame(message) {
  if (state.gameOver) return;
  state.gameOver = true;
  state.phase = "gameover";
  log(`终场：${message}`);
  stopMusic();
  playSound("buzzer");
  render();
}

function addScore(player, points) {
  if (!player) return;
  if (player.ai) state.awayScore += points;
  else state.homeScore += points;
}

function discardCard(player, index) {
  if (index < 0) return null;
  const [card] = player.hand.splice(index, 1);
  if (card) state.discard.push(card);
  return card;
}

function discardEquipment(player, key) {
  const card = player.equipment[key];
  if (!card) return null;
  delete player.equipment[key];
  state.discard.push(card);
  return card;
}

function discardableItems(player) {
  if (!player) return [];
  const hand = player.hand.map((card) => ({
    key: `hand:${card.uid}`,
    label: `${card.name} ${card.suit}${card.rank}`,
    type: "hand",
    uid: card.uid,
  }));
  if (!player.ai) return hand;
  const equipment = Object.entries(player.equipment).map(([slot, card]) => ({
    key: `equip:${slot}`,
    label: `装备 · ${card.name}`,
    type: "equip",
    slot,
  }));
  return [...hand, ...equipment];
}

function discardFrom(player, count, reason, onDone = null) {
  if (!player?.alive) {
    onDone?.(0);
    return 0;
  }
  if (!discardableItems(player).length) {
    onDone?.(0);
    return 0;
  }
  if (!player.ai) {
    startDiscardRequest({ player, count, reason, onDone, resumeAi: Boolean(currentPlayer()?.ai) });
    return null;
  }
  let discarded = 0;
  for (let i = 0; i < count; i += 1) {
    if (discardRandom(player)) discarded += 1;
  }
  onDone?.(discarded);
  return discarded;
}

function startDiscardRequest({ player, count, reason, onDone, resumeAi = false }) {
  clearCountdown();
  clearAutoEnd();
  const playerIndex = state.players.indexOf(player);
  const available = discardableItems(player).length;
  if (playerIndex < 0 || !available) {
    onDone?.(0);
    return;
  }
  const needed = Math.min(count, available);
  state.discardRequest = {
    playerIndex,
    count: needed,
    reason: count > available ? `${reason} 当前只有 ${available} 张可弃，弃完即可。` : reason,
    selected: [],
    onDone,
    resumeAi,
  };
  state.awaitingTarget = null;
  state.selectedCardIndex = null;
  showTip(reason, 4200);
  render();
  if (!player.ai && isAuthoritativeClient()) {
    startCountdown(15, "弃牌", () => {
      showTip("弃牌时间到，自动弃置最右侧手牌。");
      autoDiscardRequest();
    });
  }
}

function toggleDiscardChoice(key) {
  const req = state.discardRequest;
  if (!req || req.playerIndex !== localPlayerIndex()) return;
  const selected = req.selected || [];
  const needed = discardRequestNeeded(req);
  if (selected.includes(key)) {
    req.selected = selected.filter((item) => item !== key);
  } else if (selected.length < needed) {
    req.selected = [...selected, key];
  } else {
    showTip(`最多选择 ${needed} 张。`);
  }
  if (!isAuthoritativeClient()) sendLanAction({ kind: "discard-selection", selected: req.selected });
  render();
}

function autoDiscardRequest() {
  const req = state.discardRequest;
  if (!req) return;
  const player = state.players[req.playerIndex];
  const choices = discardableItems(player);
  const needed = discardRequestNeeded(req);
  const handKeys = player.hand.slice(Math.max(0, player.hand.length - needed)).map((card) => `hand:${card.uid}`);
  const fallbackKeys = choices.map((item) => item.key).filter((key) => !handKeys.includes(key));
  req.selected = [...handKeys, ...fallbackKeys].slice(0, needed);
  confirmDiscardRequest(true);
}

function confirmDiscardRequest(force = false) {
  const req = state.discardRequest;
  if (!req || (!force && req.playerIndex !== localPlayerIndex())) return;
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "discard-confirm", selected: req.selected || [] });
    showTip("已确认弃牌，等待房主同步。", 1400);
    return;
  }
  const player = state.players[req.playerIndex];
  const needed = discardRequestNeeded(req);
  if ((req.selected || []).length < needed) {
    showTip(`还需要选择 ${needed - (req.selected || []).length} 张。`);
    return;
  }
  clearCountdown();
  clearAutoEnd();
  let discarded = 0;
  req.selected.slice(0, needed).forEach((key) => {
    const [kind, id] = key.split(":");
    let card = null;
    if (kind === "hand") {
      const index = player.hand.findIndex((item) => item.uid === id);
      card = discardCard(player, index);
    } else {
      card = discardEquipment(player, id);
    }
    if (card) {
      discarded += 1;
      log(`${player.role.cn} 弃置 ${card.name}。`);
    }
  });
  const onDone = req.onDone;
  const resumeAi = req.resumeAi;
  state.discardRequest = null;
  onDone?.(discarded);
  if (resumeAi && !state.gameOver && currentPlayer()?.ai && !state.pendingResponse) {
    window.setTimeout(nextTurn, 650);
  }
  render();
}

function discardRandom(player) {
  const handIndex = player.hand.length ? Math.floor(Math.random() * player.hand.length) : -1;
  if (handIndex >= 0) {
    const card = discardCard(player, handIndex);
    log(`${player.role.cn} 弃置 ${card.name}。`);
    return true;
  }
  const equipKeys = Object.keys(player.equipment);
  if (equipKeys.length) {
    const key = equipKeys[Math.floor(Math.random() * equipKeys.length)];
    const card = player.equipment[key];
    delete player.equipment[key];
    state.discard.push(card);
    log(`${player.role.cn} 失去装备 ${card.name}。`);
    return true;
  }
  return false;
}

function findCardIndex(player, ids) {
  return player.hand.findIndex((card) => ids.includes(card.id));
}

function countCards(player, ids) {
  return player.hand.filter((card) => ids.includes(card.id)).length;
}

function aiTurn(player) {
  if (state.gameOver || currentPlayer() !== player) return;
  const playables = () => player.hand
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => !card.reactive && !(card.offensive && (player.offenseLocked || !canUseOffensive(player))));

  const low = player.hp < player.maxHp ? playables().find((x) => x.card.id === "timeout") : null;
  if (low) playCard(player, low.card, state.players.indexOf(player), low.index);

  const equip = playables().find((x) => x.card.equip && !player.equipment[x.card.equip]);
  if (equip) playCard(player, equip.card, state.players.indexOf(player), equip.index);

  const attempts = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < attempts; i += 1) {
    const options = playables().filter(({ card }) => card.id !== "timeout" && !card.equip && hasAiTarget(player, card));
    if (!options.length) break;
    const preferred = options.find(({ card }) => ["breakthrough", "three", "double", "steal", "foul", "fastbreak"].includes(card.id)) || options[0];
    const targetIndex = chooseAiTarget(player, preferred.card);
    playCard(player, preferred.card, targetIndex, preferred.index);
    if (state.gameOver) break;
    if (state.discardRequest) return;
    if (state.pendingResponse) return;
  }
  setTimeout(nextTurn, 860);
}

function hasAiTarget(player, card) {
  if (card.target === "self" || card.target === "none") return true;
  if (card.target === "any") return state.players.some((p) => p.alive);
  if (card.target === "enemy") {
    return state.players.some((p) => p.alive && p !== player && isInCardRange(player, p, card));
  }
  return false;
}

function chooseAiTarget(player, card) {
  const selfIndex = state.players.indexOf(player);
  if (card.target === "self") return selfIndex;
  if (card.target === "any" && Math.random() < 0.35) return selfIndex;
  const candidates = state.players
    .map((p, index) => ({ p, index }))
    .filter(({ p, index }) => p.alive && index !== selfIndex && isInCardRange(player, p, card));
  if (!candidates.length) return selfIndex;
  const core = candidates.find(({ p }) => p.identity === "核心");
  const weak = [...candidates].sort((a, b) => a.p.hp - b.p.hp)[0];
  if (player.identity === "队友") return candidates.find(({ p }) => p.identity !== "核心")?.index ?? weak.index;
  if (player.identity === "独狼" && state.players.filter((p) => p.alive).length <= 2 && core) return core.index;
  return (core && Math.random() < 0.64) ? core.index : weak.index;
}

function animateBallTo(player, targetIndex) {
  const ball = qs("#ball");
  const fromEl = qs(`[data-player="${state.players.indexOf(player)}"]`);
  const toEl = targetIndex !== null && targetIndex !== undefined ? qs(`[data-player="${targetIndex}"]`) : fromEl;
  if (!fromEl || !toEl) return;
  const arenaBox = qs(".arena").getBoundingClientRect();
  const toBox = toEl.getBoundingClientRect();
  const x = toBox.left + toBox.width / 2 - arenaBox.left;
  const y = toBox.top + toBox.height / 2 - arenaBox.top;
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  ball.classList.remove("shoot");
  void ball.offsetWidth;
  ball.classList.add("shoot");
}

function flashSeat(player) {
  const index = state.players.indexOf(player);
  const seat = qs(`[data-player="${index}"]`);
  if (!seat) return;
  seat.classList.remove("flash");
  void seat.offsetWidth;
  seat.classList.add("flash");
}

function log(message) {
  state.logEntries = [message, ...(state.logEntries || [])].slice(0, 80);
  const logEl = qs("#log");
  if (!logEl) return;
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = message;
  logEl.prepend(entry);
  while (logEl.children.length > 80) logEl.lastElementChild.remove();
}

let countdownTimer = null;
let autoEndTimer = null;
let coachTipTimer = null;

function startCountdown(seconds, label, onExpire) {
  clearCountdown();
  state.countdownLabel = label;
  state.countdownLeft = seconds;
  renderScoreboard();
  renderCountdownControls();
  publishGameState();
  countdownTimer = window.setInterval(() => {
    state.countdownLeft = Math.max(0, state.countdownLeft - 1);
    renderScoreboard();
    renderCountdownControls();
    publishGameState();
    if (state.countdownLeft <= 0) {
      clearCountdown();
      onExpire?.();
    }
  }, 1000);
}

function clearCountdown() {
  if (countdownTimer) window.clearInterval(countdownTimer);
  countdownTimer = null;
  state.countdownLabel = "";
  state.countdownLeft = 0;
  if (qs("#turnTimerLabel")) {
    renderScoreboard();
    renderCountdownControls();
  }
}

function clearAutoEnd() {
  if (autoEndTimer) window.clearTimeout(autoEndTimer);
  autoEndTimer = null;
}

function showTip(message, duration = 3600) {
  const tip = qs("#coachTip");
  if (!tip) return;
  tip.textContent = message;
  tip.classList.add("active");
  if (coachTipTimer) window.clearTimeout(coachTipTimer);
  coachTipTimer = window.setTimeout(() => {
    tip.classList.remove("active");
  }, duration);
}

function endCurrentTurn() {
  if (state.gameOver || state.pendingResponse || state.discardRequest) return;
  if (!isAuthoritativeClient()) {
    sendLanAction({ kind: "end-turn" });
    showTip("已请求结束回合。", 1200);
    return;
  }
  if (currentPlayer() !== localPlayer() || state.phase !== "play") return;
  nextTurn();
}

function playableActions(player) {
  return player.hand.filter((card) => !cardBlockReason(player, card));
}

function maybeAutoEndUserTurn() {
  const player = localPlayer();
  if (state.gameOver || currentPlayer() !== player || state.phase !== "play") return;
  if (playableActions(player).length) return;
  showTip("当前没有可出的牌，系统将快速结束你的回合。");
  clearAutoEnd();
  autoEndTimer = window.setTimeout(endCurrentTurn, 1200);
}

function maybeAutoEndHumanTurn(player) {
  if (!isAuthoritativeClient() || !player || player.ai || state.gameOver || currentPlayer() !== player || state.phase !== "play") return;
  if (playableActions(player).length) return;
  log(`${player.role.cn} 没有可出的牌，系统快速结束回合。`);
  clearAutoEnd();
  autoEndTimer = window.setTimeout(() => {
    if (!state.gameOver && !state.pendingResponse && !state.discardRequest && currentPlayer() === player) nextTurn();
  }, 1200);
}

function soundForCard(card) {
  if (card.id === "three") return "shoot";
  if (card.id === "breakthrough") return "bounce";
  if (card.id === "timeout") return "whistle";
  if (card.id === "block") return "block";
  if (card.id === "steal" || card.id === "double") return "whistle";
  return "draw";
}

function pendingResponseSnapshot() {
  if (!state.pendingResponse) return null;
  const { type, sourceIndex, playerIndex, card, allowed, need, used } = state.pendingResponse;
  return { type, sourceIndex, playerIndex, card, allowed, need, used };
}

function discardRequestSnapshot() {
  if (!state.discardRequest) return null;
  const { playerIndex, count, reason, selected, resumeAi } = state.discardRequest;
  return { playerIndex, count, reason, selected: [...(selected || [])], resumeAi: Boolean(resumeAi) };
}

function gameSnapshot() {
  return JSON.parse(JSON.stringify({
    players: state.players,
    deck: state.deck,
    discard: state.discard,
    current: state.current,
    phase: state.phase,
    offensiveUsed: state.offensiveUsed,
    selectedCardIndex: null,
    awaitingTarget: null,
    pendingResponse: pendingResponseSnapshot(),
    discardRequest: discardRequestSnapshot(),
    turnNumber: state.turnNumber,
    clock: state.clock,
    countdownLabel: state.countdownLabel,
    countdownLeft: state.countdownLeft,
    homeScore: state.homeScore,
    awayScore: state.awayScore,
    gameOver: state.gameOver,
    logEntries: state.logEntries || [],
  }));
}

function publishGameState() {
  if (applyingRemoteState || !isLanHostGame() || pendingPublish) return;
  pendingPublish = true;
  queueMicrotask(() => {
    pendingPublish = false;
    if (!isLanHostGame() || applyingRemoteState) return;
    sendRoom({ type: "game-state", code: state.roomCode, game: gameSnapshot() });
  });
}

function applyGameSnapshot(game) {
  if (!game || roomHost) return;
  if (countdownTimer) window.clearInterval(countdownTimer);
  if (autoEndTimer) window.clearTimeout(autoEndTimer);
  countdownTimer = null;
  autoEndTimer = null;
  applyingRemoteState = true;
  Object.assign(state, {
    players: game.players || [],
    deck: game.deck || [],
    discard: game.discard || [],
    current: Number(game.current) || 0,
    phase: game.phase || "setup",
    offensiveUsed: Boolean(game.offensiveUsed),
    selectedCardIndex: null,
    awaitingTarget: null,
    pendingResponse: game.pendingResponse || null,
    discardRequest: game.discardRequest || null,
    turnNumber: Number(game.turnNumber) || 1,
    clock: Number(game.clock) || 720,
    countdownLabel: game.countdownLabel || "",
    countdownLeft: Number(game.countdownLeft) || 0,
    homeScore: Number(game.homeScore) || 0,
    awayScore: Number(game.awayScore) || 0,
    gameOver: Boolean(game.gameOver),
    logEntries: Array.isArray(game.logEntries) ? game.logEntries : [],
  });
  qs("#startModal").classList.remove("active");
  render();
  applyingRemoteState = false;
}

function sendLanAction(action) {
  if (state.playMode !== "lan" || !state.roomCode || roomHost) return;
  sendRoom({ type: "game-action", code: state.roomCode, action });
}

function playerIndexForClient(clientId) {
  return state.players.findIndex((player) => player.clientId === clientId);
}

function applyHostAction(from, action = {}) {
  if (!roomHost || !state.roomStarted) return;
  const playerIndex = playerIndexForClient(from);
  if (playerIndex < 0) return;
  const player = state.players[playerIndex];
  if (!player || player.ai) return;
  if (action.kind === "sort") {
    sortHandForPlayer(player);
    log(`${player.role.cn} 整理了手牌。`);
    return render();
  }
  if (action.kind === "reorder") {
    const fromIndex = Number(action.from);
    const toIndex = Number(action.to);
    if (!Number.isNaN(fromIndex) && !Number.isNaN(toIndex) && fromIndex !== toIndex) {
      const [card] = player.hand.splice(fromIndex, 1);
      if (card) player.hand.splice(toIndex, 0, card);
      render();
    }
    return;
  }
  if (action.kind === "discard-selection" && state.discardRequest?.playerIndex === playerIndex) {
    const valid = new Set(discardableItems(player).map((item) => item.key));
    state.discardRequest.selected = (action.selected || []).filter((key) => valid.has(key)).slice(0, state.discardRequest.count);
    return render();
  }
  if (action.kind === "discard-confirm" && state.discardRequest?.playerIndex === playerIndex) {
    const valid = new Set(discardableItems(player).map((item) => item.key));
    state.discardRequest.selected = (action.selected || state.discardRequest.selected || []).filter((key) => valid.has(key)).slice(0, state.discardRequest.count);
    return confirmDiscardRequest(true);
  }
  if (action.kind === "response") return respondWithCardForPlayer(playerIndex, action.cardId, action.explicitIndex);
  if (action.kind === "pass-response") return passResponseForPlayer(playerIndex);
  if (action.kind === "end-turn") {
    if (!state.gameOver && !state.pendingResponse && !state.discardRequest && state.phase === "play" && state.current === playerIndex) nextTurn();
    return;
  }
  if (action.kind === "play") {
    if (state.gameOver || state.pendingResponse || state.discardRequest || state.phase !== "play" || state.current !== playerIndex) return;
    const indexByUid = player.hand.findIndex((card) => card.uid === action.cardUid);
    if (action.cardUid && indexByUid < 0) return;
    const cardIndex = indexByUid >= 0 ? indexByUid : Number(action.cardIndex);
    const card = player.hand[cardIndex];
    if (!card) return;
    const reason = cardBlockReason(player, card);
    if (reason) {
      log(`${player.role.cn} 出牌失败：${reason}`);
      return render();
    }
    const targetIndex = action.targetIndex === null || action.targetIndex === undefined ? null : Number(action.targetIndex);
    if ((card.target === "enemy" || card.target === "any") && !isTargetableFor(playerIndex, card, targetIndex)) {
      log(`${player.role.cn} 出牌失败：目标不合法。`);
      return render();
    }
    playCard(player, card, card.target === "self" ? playerIndex : targetIndex, cardIndex);
  }
}

function isTargetableFor(playerIndex, card, targetIndex) {
  const target = state.players[targetIndex];
  if (!target?.alive) return false;
  if (targetIndex === playerIndex && card.target !== "any") return false;
  if (card.target === "enemy") return targetIndex !== playerIndex && isInCardRange(state.players[playerIndex], target, card);
  if (card.target === "any") return true;
  return card.target === "self" ? targetIndex === playerIndex : true;
}

let audioCtx;
let musicTimer = null;
let roomSocket = null;
let roomHost = false;
let startAfterRoomCreate = false;
let applyingRemoteState = false;
let pendingPublish = false;
const liveAudio = {};
const liveAudioFiles = {
  swish: "assets/audio/swish.mp3",
  bounce: "assets/audio/bounce.mp3",
  whistle: "assets/audio/whistle.mp3",
  crowd: "assets/audio/crowd.mp3",
  applause: "assets/audio/applause.mp3",
};

function unlockAudio() {
  if (state.audioReady || !state.sound) return;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  initLiveAudio();
  state.audioReady = true;
}

function startMusic() {
  if (!state.sound || musicTimer) return;
  if (state.soundPack === "live") {
    playLiveLoop();
    musicTimer = window.setInterval(playLiveLoop, 6000);
    return;
  }
  const loop = () => {
    if (!state.sound || !state.audioReady || !audioCtx) return;
    tone(55, 0.22, "sine", 0.025);
    tone(110, 0.16, "triangle", 0.018, 0.18);
    tone(165, 0.12, "triangle", 0.014, 0.36);
    noise(0.05, 0.01);
  };
  loop();
  musicTimer = window.setInterval(loop, 1800);
}

function stopMusic() {
  if (!musicTimer) return;
  window.clearInterval(musicTimer);
  musicTimer = null;
  Object.values(liveAudio).forEach((audio) => {
    if (audio.loop) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

function initLiveAudio() {
  Object.entries(liveAudioFiles).forEach(([name, src]) => {
    if (liveAudio[name]) return;
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = name === "crowd" ? 0.18 : 0.58;
    liveAudio[name] = audio;
  });
  if (liveAudio.crowd) liveAudio.crowd.loop = true;
}

function playLiveClip(name, volume = 0.65) {
  initLiveAudio();
  const base = liveAudio[name];
  if (!base) return;
  const clip = base.cloneNode();
  clip.volume = volume;
  clip.play().catch(() => {});
}

function playLiveLoop() {
  initLiveAudio();
  const crowd = liveAudio.crowd;
  if (!crowd || !state.sound || state.soundPack !== "live") return;
  crowd.volume = 0.16;
  crowd.play().catch(() => {});
}

function tone(freq, duration, type = "sine", gain = 0.08, delay = 0) {
  if (!state.sound || !state.audioReady || !audioCtx) return;
  const start = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noise(duration, gain = 0.06) {
  if (!state.sound || !state.audioReady || !audioCtx) return;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audioCtx.createBufferSource();
  const amp = audioCtx.createGain();
  amp.gain.setValueAtTime(gain, audioCtx.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  source.buffer = buffer;
  source.connect(amp).connect(audioCtx.destination);
  source.start();
  source.stop(audioCtx.currentTime + duration);
}

function filteredNoise(duration, gain = 0.05, filterType = "bandpass", frequency = 1200, q = 1.2, delay = 0) {
  if (!state.sound || !state.audioReady || !audioCtx) return;
  const start = audioCtx.currentTime + delay;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const amp = audioCtx.createGain();
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, start);
  filter.Q.setValueAtTime(q, start);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(filter).connect(amp).connect(audioCtx.destination);
  source.start(start);
  source.stop(start + duration);
}

function playSound(name) {
  if (!state.sound) return;
  if (!state.audioReady) return;
  if (state.soundPack === "live") return playLiveSound(name);
  if (name === "bounce") {
    tone(92, 0.09, "sine", 0.12);
    tone(58, 0.08, "sine", 0.09, 0.09);
  }
  if (name === "shoot") {
    tone(440, 0.08, "triangle", 0.08);
    tone(740, 0.12, "triangle", 0.06, 0.08);
  }
  if (name === "swish") {
    noise(0.18, 0.035);
    tone(920, 0.16, "sine", 0.045);
  }
  if (name === "whistle") {
    tone(1600, 0.18, "square", 0.05);
    tone(1900, 0.16, "square", 0.04, 0.12);
  }
  if (name === "block") {
    noise(0.1, 0.08);
    tone(180, 0.12, "sawtooth", 0.05);
  }
  if (name === "hit") {
    tone(120, 0.12, "sawtooth", 0.09);
    noise(0.08, 0.035);
  }
  if (name === "draw") {
    tone(320, 0.04, "triangle", 0.035);
    tone(420, 0.04, "triangle", 0.028, 0.04);
  }
  if (name === "buzzer") {
    tone(150, 0.55, "sawtooth", 0.07);
  }
  if (name === "crowd") {
    noise(0.45, 0.018);
    tone(220, 0.14, "triangle", 0.025);
    tone(330, 0.18, "triangle", 0.02, 0.12);
  }
  if (name === "deny") {
    tone(160, 0.08, "square", 0.035);
    tone(120, 0.08, "square", 0.025, 0.08);
  }
}

function playLiveSound(name) {
  if (name === "bounce") {
    playLiveClip("bounce", 0.56);
  }
  if (name === "shoot") {
    playLiveClip("bounce", 0.28);
  }
  if (name === "swish") {
    playLiveClip("swish", 0.78);
    window.setTimeout(() => playLiveClip("applause", 0.22), 120);
  }
  if (name === "whistle") {
    playLiveClip("whistle", 0.72);
  }
  if (name === "block") {
    playLiveClip("bounce", 0.82);
  }
  if (name === "hit") {
    playLiveClip("bounce", 0.66);
  }
  if (name === "draw") {
    playLiveClip("swish", 0.22);
  }
  if (name === "buzzer") {
    playLiveClip("whistle", 0.8);
  }
  if (name === "crowd") {
    playLiveClip("applause", 0.28);
  }
  if (name === "deny") {
    playLiveClip("whistle", 0.28);
  }
}

qs("#startBtn").addEventListener("click", () => {
  if (!startLanRoomGame()) initGame();
});
qs("#newGameBtn").addEventListener("click", () => {
  clearCountdown();
  clearAutoEnd();
  stopMusic();
  qs("#log").innerHTML = "";
  qs("#discardPile").innerHTML = "";
  state.pendingResponse = null;
  state.discardRequest = null;
  state.roomCode = "";
  state.roomPlayers = [];
  state.roomStarted = false;
  state.roomReady = false;
  roomHost = false;
  qs("#startModal").classList.add("active");
  buildRoster();
});
qs("#endTurnBtn").addEventListener("click", () => {
  if (state.discardRequest?.playerIndex === localPlayerIndex()) confirmDiscardRequest();
  else endCurrentTurn();
});
qs("#sortHandBtn").addEventListener("click", sortUserHand);
qs("#soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) {
    unlockAudio();
    startMusic();
  } else {
    stopMusic();
  }
  render();
});
qs("#tipBtn").addEventListener("click", () => qs("#rulesModal").classList.add("active"));
qs("#helpBtn").addEventListener("click", () => qs("#rulesModal").classList.add("active"));
qs("#closeRulesBtn").addEventListener("click", () => qs("#rulesModal").classList.remove("active"));
qs("#settingsBtn").addEventListener("click", () => {
  renderSettings();
  qs("#settingsModal").classList.add("active");
});
qs("#closeSettingsBtn").addEventListener("click", () => qs("#settingsModal").classList.remove("active"));
qsa("[data-avatar-style]").forEach((button) => {
  button.addEventListener("click", () => {
    state.avatarStyle = button.dataset.avatarStyle;
    localStorage.setItem("nbaKillAvatarStyle", state.avatarStyle);
    renderSettings();
    buildRoster();
    render();
  });
});
qsa("[data-sound-pack]").forEach((button) => {
  button.addEventListener("click", () => {
    state.soundPack = button.dataset.soundPack;
    localStorage.setItem("nbaKillSoundPack", state.soundPack);
    stopMusic();
    if (state.sound) {
      unlockAudio();
      startMusic();
      playSound("crowd");
    }
    renderSettings();
    showTip(state.soundPack === "live" ? "已切换到球场现场音效。" : "已切换到街机合成音效。");
  });
});
qs("#roster").addEventListener("click", (event) => {
  const card = event.target.closest("[data-roster]");
  if (!card) return;
  state.selectedRosterId = card.dataset.roster;
  if (state.playMode === "lan" && state.roomCode && !roomHost) {
    state.roomReady = false;
    sendRoom({ type: "ready", code: state.roomCode, ready: false, rosterId: state.selectedRosterId });
  } else {
    syncRoomPatch({ selectedRosterId: state.selectedRosterId });
  }
  buildRoster();
});
qs("#playerCountSelect").addEventListener("change", (event) => {
  if (state.playMode === "lan" && state.roomCode && !roomHost) {
    event.target.value = String(state.playerCount);
    showTip("局域网房间中只有房主可以改人数。");
    return;
  }
  state.playerCount = Number(event.target.value) || 4;
  localStorage.setItem("nbaKillPlayerCount", String(state.playerCount));
  syncRoomPatch({ playerCount: state.playerCount });
});
qs("#playModeSelect").addEventListener("change", (event) => {
  state.playMode = event.target.value;
  localStorage.setItem("nbaKillPlayMode", state.playMode);
  renderLanPanel();
});
qs("#createRoomBtn").addEventListener("click", createLanRoom);
qs("#joinRoomBtn").addEventListener("click", joinLanRoom);

function renderSettings() {
  qsa("[data-avatar-style]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.avatarStyle === state.avatarStyle);
  });
  qsa("[data-sound-pack]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.soundPack === state.soundPack);
  });
}

function renderLanPanel() {
  const isLan = state.playMode === "lan";
  const roomPlayers = Array.isArray(state.roomPlayers) ? state.roomPlayers : [];
  qs("#lanPanel")?.classList.toggle("active", isLan);
  const inRoom = Boolean(state.roomCode);
  const me = roomPlayers.find((player) => player.id === state.clientId);
  const createBtn = qs("#createRoomBtn");
  const joinBtn = qs("#joinRoomBtn");
  const startBtn = qs("#startBtn");
  const playerCountSelect = qs("#playerCountSelect");
  if (createBtn) createBtn.disabled = isLan && inRoom;
  if (joinBtn) joinBtn.disabled = isLan && inRoom;
  if (startBtn) {
    if (isLan && inRoom && !roomHost) {
      startBtn.textContent = me?.ready ? "已准备" : "准备";
      startBtn.disabled = state.roomStarted || Boolean(me?.ready);
    } else {
      startBtn.textContent = "开球";
      startBtn.disabled = isLan && (state.roomStarted || (roomHost && !allRoomGuestsReady()));
    }
  }
  if (playerCountSelect) playerCountSelect.disabled = isLan && inRoom && !roomHost;
}

function allRoomGuestsReady() {
  const players = Array.isArray(state.roomPlayers) ? state.roomPlayers : [];
  return players.every((player) => player.id === state.clientId || player.ready);
}

function roomUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/room`;
}

function connectRoomSocket() {
  if (roomSocket && roomSocket.readyState <= 1) return roomSocket;
  roomSocket = new WebSocket(roomUrl());
  roomSocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "room-created" || message.type === "room-joined" || message.type === "room-update") {
      state.roomCode = message.room.code;
      state.playerCount = message.room.playerCount || state.playerCount;
      state.roomPlayers = message.room.players || [];
      state.roomStarted = Boolean(message.room.started);
      roomHost = message.room.host === state.clientId;
      state.roomReady = Boolean(state.roomPlayers.find((player) => player.id === state.clientId)?.ready);
      if (message.room.selectedRosterId) state.selectedRosterId = message.room.selectedRosterId;
      const me = state.roomPlayers.find((player) => player.id === state.clientId);
      if (me?.rosterId && !roomHost) state.selectedRosterId = me.rosterId;
      qs("#roomCodeInput").value = state.roomCode;
      qs("#roomStatus").textContent = roomStatusText(message.room, message.alreadyJoined);
      qs("#playerCountSelect").value = String(state.playerCount);
      renderLanPanel();
      buildRoster();
      if (startAfterRoomCreate && roomHost && message.type === "room-created") {
        startAfterRoomCreate = false;
        requestLanStart();
      }
    }
    if (message.type === "room-start") {
      state.playerCount = message.room.playerCount || state.playerCount;
      state.roomPlayers = message.room.players || [];
      state.roomStarted = true;
      state.selectedRosterId = message.room.selectedRosterId || state.selectedRosterId;
      roomHost = message.room.host === state.clientId;
      qs("#roomStatus").textContent = roomHost ? "正在开球并同步给其他玩家..." : "房主已开球，等待同步比赛状态...";
      renderLanPanel();
      if (roomHost && qs("#startModal")?.classList.contains("active")) initGame({ lan: true });
    }
    if (message.type === "game-state") {
      state.roomCode = message.room?.code || state.roomCode;
      state.roomPlayers = message.room?.players || state.roomPlayers;
      state.roomStarted = Boolean(message.room?.started ?? state.roomStarted);
      roomHost = message.room?.host === state.clientId;
      applyGameSnapshot(message.game);
    }
    if (message.type === "game-action") {
      applyHostAction(message.from, message.action);
    }
    if (message.type === "error") {
      startAfterRoomCreate = false;
      qs("#roomStatus").textContent = message.message;
      showTip(message.message);
    }
  });
  roomSocket.addEventListener("open", () => {
    if (!state.roomCode) qs("#roomStatus").textContent = "已连接房间服务器。";
  });
  roomSocket.addEventListener("error", () => {
    startAfterRoomCreate = false;
    qs("#roomStatus").textContent = "房间连接失败，请确认当前页面是 npm start 输出的 4173 地址。";
    showTip("房间连接失败，请刷新页面后重试。");
  });
  roomSocket.addEventListener("close", () => {
    startAfterRoomCreate = false;
    qs("#roomStatus").textContent = "房间服务器未连接，请用 npm start 启动局域网服务器。";
    state.roomCode = "";
    state.roomPlayers = [];
    state.roomStarted = false;
    roomHost = false;
    renderLanPanel();
  });
  return roomSocket;
}

function roomStatusText(room, alreadyJoined = false) {
  const role = room.host === state.clientId ? "你是房主" : "等待房主开球";
  const joined = alreadyJoined ? " · 已在房间中" : "";
  const started = room.started ? " · 已开球" : "";
  const ready = room.players.filter((player) => player.ready).length;
  return `房间 ${room.code} · ${room.players.length}/${room.playerCount} 人在线 · ${ready}/${room.players.length} 已准备 · ${role}${joined}${started}`;
}

function sendRoom(message) {
  const socket = connectRoomSocket();
  const payload = () => socket.send(JSON.stringify({ clientId: state.clientId, ...message }));
  if (socket.readyState === WebSocket.OPEN) payload();
  else socket.addEventListener("open", payload, { once: true });
}

function createLanRoom({ autoStart = false } = {}) {
  if (state.roomCode && !state.roomStarted) {
    showTip("你已经在房间里了。");
    return;
  }
  startAfterRoomCreate = autoStart;
  roomHost = true;
  state.roomReady = true;
  qs("#roomStatus").textContent = autoStart ? "正在创建房间并开球..." : "正在创建房间...";
  sendRoom({
    type: "create",
    playerCount: state.playerCount,
    selectedRosterId: state.selectedRosterId,
  });
}

function joinLanRoom() {
  roomHost = false;
  const code = qs("#roomCodeInput").value.trim().toUpperCase();
  if (!code) return showTip("请输入房间码。");
  if (state.roomCode === code && !state.roomStarted) {
    showTip("你已经加入这个房间了。");
    return;
  }
  startAfterRoomCreate = false;
  qs("#roomStatus").textContent = `正在加入房间 ${code}...`;
  sendRoom({ type: "join", code, rosterId: state.selectedRosterId });
}

function syncRoomPatch(patch) {
  if (state.playMode !== "lan" || !state.roomCode || !roomHost) return;
  sendRoom({ type: "patch", code: state.roomCode, ...patch });
}

function requestLanStart() {
  if (!allRoomGuestsReady()) {
    showTip("还有玩家未准备，不能开球。");
    return;
  }
  syncRoomPatch({ playerCount: state.playerCount, selectedRosterId: state.selectedRosterId });
  sendRoom({ type: "start", code: state.roomCode });
}

function startLanRoomGame() {
  if (state.playMode !== "lan") return false;
  if (!state.roomCode) {
    createLanRoom({ autoStart: true });
    return true;
  }
  if (!roomHost) {
    state.roomReady = true;
    sendRoom({ type: "ready", code: state.roomCode, ready: true, rosterId: state.selectedRosterId });
    showTip("已准备，等待房主开球。");
    renderLanPanel();
    return true;
  }
  requestLanStart();
  return true;
}

const bootParams = new URLSearchParams(window.location.search);
const bootAvatar = bootParams.get("avatar");
if (["portrait", "classic", "photo"].includes(bootAvatar)) {
  state.avatarStyle = bootAvatar;
  localStorage.setItem("nbaKillAvatarStyle", state.avatarStyle);
}
const bootPlayers = Number(bootParams.get("players"));
if (bootPlayers >= 4 && bootPlayers <= 8) {
  state.playerCount = bootPlayers;
  localStorage.setItem("nbaKillPlayerCount", String(state.playerCount));
}

buildRoster();
renderSettings();
render();

if (bootParams.has("autostart")) {
  setTimeout(initGame, 80);
}

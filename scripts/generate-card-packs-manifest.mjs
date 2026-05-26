import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const cardsRoot = join(root, "assets", "cards");
const output = join(cardsRoot, "manifest.json");
const imageExtensions = new Set([".png", ".webp", ".jpg", ".jpeg"]);
const packKinds = new Set(["offense", "reactive", "tactic", "heal", "equip", "utility"]);

function scanCardPacks() {
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
    if (!imageExtensions.has(ext) || !packKinds.has(kind)) continue;
    const filePath = join(folderPath, entry.name);
    if (!statSync(filePath).isFile()) continue;
    files[kind] = `assets/cards/${encodeURIComponent(folderName)}/${encodeURIComponent(entry.name)}`;
  }
  if (!Object.keys(files).length) return null;
  return {
    id: folderName,
    name: folderName,
    description: `识别到 ${Object.keys(files).length}/${packKinds.size} 类卡牌背景。`,
    files,
  };
}

mkdirSync(cardsRoot, { recursive: true });
writeFileSync(output, `${JSON.stringify({ packs: scanCardPacks() }, null, 2)}\n`);
console.log(`Generated ${output}`);

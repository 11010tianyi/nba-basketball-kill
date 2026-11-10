import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const www = join(root, "www");

const generated = spawnSync(process.execPath, ["scripts/generate-card-packs-manifest.mjs"], {
  cwd: root,
  stdio: "inherit",
});
if (generated.status !== 0) process.exit(generated.status ?? 1);

rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

for (const file of ["index.html", "app.js", "styles.css"]) {
  cpSync(join(root, file), join(www, file));
}
cpSync(join(root, "assets"), join(www, "assets"), { recursive: true });

const htmlPath = join(www, "index.html");
const html = readFileSync(htmlPath, "utf8");
let marked = html.replace(
  "<html lang=\"zh-CN\">",
  "<html lang=\"zh-CN\" class=\"native-shell\">",
);
if (!marked.includes("viewport-fit=cover")) {
  marked = marked.replace(
    'content="width=device-width, initial-scale=1.0"',
    'content="width=device-width, initial-scale=1.0, viewport-fit=cover"',
  );
}
if (!marked.includes("class=\"native-shell\"") || !marked.includes("viewport-fit=cover")) {
  console.error("Could not mark the packaged index.html as a native shell.");
  process.exit(1);
}
writeFileSync(htmlPath, marked);
console.log(`Prepared ${www} for Capacitor. webDir is this static copy, so relative asset paths stay intact.`);

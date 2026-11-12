import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const www = join(root, "www");

// The packaged page is a fixed desktop stage. Phone media queries must not see
// the real window, or they crush the court. 1440 wide misses the 1366px coarse
// layout. 1080 tall misses the 520px phone layout and leaves room for the
// response banner plus full hand cards under the court.
const STAGE_W = 1440;
const STAGE_H = 1080;

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

const gamePath = join(www, "play.html");
const html = readFileSync(join(www, "index.html"), "utf8");
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
  console.error("Could not mark the packaged game page as a native shell.");
  process.exit(1);
}
writeFileSync(gamePath, marked);

const shell = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>篮球杀</title>
  <style>
    html, body {
      margin: 0;
      height: 100%;
      background: #10151e;
      overflow: hidden;
      color-scheme: dark;
    }
    #stage {
      position: absolute;
      top: 0;
      left: 0;
      width: ${STAGE_W}px;
      height: ${STAGE_H}px;
      border: 0;
      background: #10151e;
      transform-origin: 0 0;
    }
  </style>
</head>
<body>
  <iframe id="stage" title="篮球杀" scrolling="no" src="play.html"></iframe>
  <script>
    const STAGE_W = ${STAGE_W};
    const STAGE_H = ${STAGE_H};
    const frame = document.getElementById("stage");
    const incoming = new URLSearchParams(location.search);
    const mode = incoming.get("fit") === "transform" ? "transform" : "zoom";
    incoming.delete("fit");
    const query = incoming.toString();
    frame.src = query ? "play.html?" + query : "play.html";

    function available() {
      const root = document.documentElement;
      const vv = window.visualViewport;
      const vw = Math.min(root.clientWidth, vv ? vv.width : root.clientWidth);
      const vh = Math.min(root.clientHeight, vv ? vv.height : root.clientHeight);
      return { vw, vh };
    }

    function fit() {
      const { vw, vh } = available();
      if (!vw || !vh) return;
      const scale = Math.min(vw / STAGE_W, vh / STAGE_H);
      const ox = (vw - STAGE_W * scale) / 2;
      const oy = (vh - STAGE_H * scale) / 2;
      if (mode === "transform") {
        frame.style.zoom = "1";
        frame.style.left = "0px";
        frame.style.top = "0px";
        frame.style.transform = "translate(" + ox + "px, " + oy + "px) scale(" + scale + ")";
      } else {
        // Chrome applies zoom to left/top as well as width/height. Divide the
        // offset so the visual letterbox stays centered. Hit testing follows
        // the zoomed border box, which getBoundingClientRect already reports.
        frame.style.transform = "none";
        frame.style.zoom = String(scale);
        frame.style.left = (ox / scale) + "px";
        frame.style.top = (oy / scale) + "px";
      }
    }

    addEventListener("resize", fit);
    if (window.visualViewport) {
      visualViewport.addEventListener("resize", fit);
      visualViewport.addEventListener("scroll", fit);
    }
    fit();
  </script>
</body>
</html>
`;
writeFileSync(join(www, "index.html"), shell);

// The public 900px-tall desktop bench clips the bottom of a 186px card.
// The packaged stage gives that row enough height. The court keeps the
// desktop seat grid; only this copy of the stylesheet changes.
const packagedLayout = `
html.native-shell .game-shell {
  grid-template-rows: auto minmax(500px, 1fr) auto;
}
html.native-shell .bench {
  height: auto;
  min-height: 248px;
}
html.native-shell .hand {
  height: 196px;
  min-height: 196px;
}
html.native-shell .arena {
  aspect-ratio: auto;
  height: 100%;
  min-height: 500px;
}
`;
writeFileSync(join(www, "styles.css"), `${readFileSync(join(www, "styles.css"), "utf8")}\n${packagedLayout}`);
console.log(`Prepared ${www}: index.html scales a ${STAGE_W}x${STAGE_H} play.html stage. Pages still serves the repo index.html.`);

import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const www = join(root, "www");

// Both portrait and landscape run play.html at the 1:1 visual viewport so its
// phone layouts (including the short-landscape court + sidebar layout) see the
// real window instead of a scaled 1440x1080 desktop stage. ?fit=stage keeps the
// old letterboxed stage available as a debug switch; it is never the default.
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
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
  <title>篮球杀</title>
  <style>
    html, body {
      margin: 0;
      height: 100%;
      background: #10151e;
      overflow: hidden;
      overscroll-behavior: none;
      color-scheme: dark;
      -webkit-tap-highlight-color: transparent;
    }
    #stage {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
      background: #10151e;
      transform-origin: 0 0;
    }
    #safe-probe {
      position: fixed;
      inset: 0;
      z-index: -1;
      visibility: hidden;
      pointer-events: none;
    }
    #safe-probe span {
      position: absolute;
      display: block;
    }
    #safe-probe .t { top: 0; left: 0; width: 1px; height: env(safe-area-inset-top, 0px); }
    #safe-probe .r { top: 0; right: 0; width: env(safe-area-inset-right, 0px); height: 1px; }
    #safe-probe .b { bottom: 0; left: 0; width: 1px; height: env(safe-area-inset-bottom, 0px); }
    #safe-probe .l { top: 0; left: 0; width: env(safe-area-inset-left, 0px); height: 1px; }
  </style>
</head>
<body>
  <div id="safe-probe" aria-hidden="true"><span class="t"></span><span class="r"></span><span class="b"></span><span class="l"></span></div>
  <iframe id="stage" title="篮球杀" scrolling="no" src="play.html"></iframe>
  <script>
    const STAGE_W = ${STAGE_W};
    const STAGE_H = ${STAGE_H};
    const frame = document.getElementById("stage");
    const incoming = new URLSearchParams(location.search);
    // Default: 1:1 visual viewport (both orientations). Debug only: stage/transform.
    const fitMode = incoming.get("fit") === "stage" || incoming.get("fit") === "transform"
      ? incoming.get("fit") : "viewport";
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

    function safeArea() {
      const probe = document.getElementById("safe-probe");
      const box = (selector) => {
        const el = probe.querySelector(selector);
        const r = el ? el.getBoundingClientRect() : null;
        return r ? Math.max(0, Math.round((selector === ".r" || selector === ".l" ? r.width : r.height) * 100) / 100) : 0;
      };
      return { top: box(".t"), right: box(".r"), bottom: box(".b"), left: box(".l") };
    }

    function applySafeArea(insets) {
      const doc = frame.contentDocument;
      if (!doc) return;
      const root = doc.documentElement;
      root.style.setProperty("--safe-area-inset-top", (insets.top || 0) + "px");
      root.style.setProperty("--safe-area-inset-right", (insets.right || 0) + "px");
      root.style.setProperty("--safe-area-inset-bottom", (insets.bottom || 0) + "px");
      root.style.setProperty("--safe-area-inset-left", (insets.left || 0) + "px");
    }

    function fitViewport(vw, vh) {
      frame.style.width = vw + "px";
      frame.style.height = vh + "px";
      frame.style.zoom = "1";
      frame.style.transform = "none";
      frame.style.left = "0px";
      frame.style.top = "0px";
      // Notches live on the left/right in landscape; the probe reports the
      // real insets for both orientations, so pass them through unchanged.
      applySafeArea(safeArea());
    }

    function fitStage(vw, vh) {
      frame.style.width = STAGE_W + "px";
      frame.style.height = STAGE_H + "px";
      const scale = Math.min(vw / STAGE_W, vh / STAGE_H);
      const ox = (vw - STAGE_W * scale) / 2;
      const oy = (vh - STAGE_H * scale) / 2;
      if (fitMode === "transform") {
        frame.style.zoom = "1";
        frame.style.left = "0px";
        frame.style.top = "0px";
        frame.style.transform = "translate(" + ox + "px, " + oy + "px) scale(" + scale + ")";
      } else {
        // Chrome applies zoom to left/top as well as width/height. Divide the
        // offset so the visual letterbox stays centered.
        frame.style.transform = "none";
        frame.style.zoom = String(scale);
        frame.style.left = (ox / scale) + "px";
        frame.style.top = (oy / scale) + "px";
      }
      applySafeArea({ top: 0, right: 0, bottom: 0, left: 0 });
    }

    function fit() {
      const { vw, vh } = available();
      if (!vw || !vh) return;
      if (fitMode === "viewport") fitViewport(vw, vh);
      else fitStage(vw, vh);
    }

    frame.addEventListener("load", () => { fit(); applySafeArea(safeArea()); });
    addEventListener("resize", fit);
    addEventListener("orientationchange", fit);
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

// No extra stage-only stylesheet is appended: the short-landscape rules in
// styles.css now run against the real 1:1 viewport in both the APK shell and
// the plain website. The old desktop-stage min-heights would break 360-390px
// tall phones, so they are intentionally gone.
console.log(`Prepared ${www}: both orientations run play.html at a 1:1 visual viewport (?fit=stage keeps the old scaled stage for debugging). Pages still serves the repo index.html.`);

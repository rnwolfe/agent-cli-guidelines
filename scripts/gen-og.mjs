// Generate per-page OG/social cards in the terminal-noir style by rendering a branded HTML
// template and screenshotting it with headless Chrome. Run: node scripts/gen-og.mjs
// (regenerate when page titles change). Outputs:
//   public/og/<slug>.png   — per-page OG cards (1200x630), served + referenced in meta
//   public/social-card.png — GitHub repo social preview (1280x640), uploaded manually
// Two robustness measures for headless Chrome: (1) layout is TOP-ANCHORED (space-between let the
// footer drift); (2) this Chrome only paints ~half the requested window height, so we render at
// 2x height and crop the top w×h with sharp.
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync, globSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';

function fontB64(family) {
  const [file] = globSync(`node_modules/@fontsource-variable/${family}/files/*-latin-wght-normal.woff2`, { cwd: ROOT });
  if (!file) throw new Error(`font not found for ${family}`);
  return readFileSync(join(ROOT, file)).toString('base64');
}
const bric = fontB64('bricolage-grotesque');
const inter = fontB64('inter');
const mono = fontB64('jetbrains-mono');

const card = ({ kicker, title, w = 1200, h = 630 }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Bric';src:url(data:font/woff2;base64,${bric}) format('woff2');font-weight:200 800}
@font-face{font-family:'Int';src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:100 900}
@font-face{font-family:'Mono';src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:100 800}
*{margin:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px}
body{background:#08080c;color:#ebebf2;font-family:'Int',sans-serif;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:
  radial-gradient(900px 540px at 10% -12%, rgba(91,91,214,.45), transparent 60%),
  radial-gradient(780px 540px at 112% 118%, rgba(120,80,220,.30), transparent 55%),
  radial-gradient(700px 500px at 95% 8%, rgba(40,90,200,.18), transparent 60%)}
.frame{position:absolute;inset:22px;border:1px solid rgba(255,255,255,.10);border-radius:18px}
.kicker{position:absolute;top:58px;left:74px;right:74px;font-family:'Mono';font-size:23px;letter-spacing:.2em;color:#b8a6ff;text-transform:uppercase}
.title{position:absolute;left:74px;right:74px;top:50%;transform:translateY(-50%);font-family:'Bric';font-weight:700;font-size:72px;line-height:1.05;letter-spacing:-.03em;max-width:${w - 170}px;
  background:linear-gradient(100deg,#ffffff 0%,#cdcbff 50%,#8b8bf6 100%);-webkit-background-clip:text;color:transparent}
.row{position:absolute;left:74px;right:74px;top:${h - 78}px;display:flex;align-items:center;justify-content:space-between}
.brand{font-family:'Mono';font-weight:600;font-size:27px;display:flex;align-items:center;gap:15px}
.dot{width:16px;height:16px;border-radius:50%;background:#8b8bf6;box-shadow:0 0 24px 4px rgba(139,139,246,.85)}
.brand .dim{color:#6e6e88}
.url{font-family:'Mono';font-size:25px;color:#8b8bf6}
.tag{font-family:'Mono';font-size:20px;color:#59e2a0;border:1px solid rgba(89,226,160,.3);border-radius:999px;padding:6px 14px}
</style></head><body>
<div class="bg"></div><div class="frame"></div>
<div class="kicker">${kicker}</div>
<div class="title">${title}</div>
<div class="row">
  <div class="brand"><span class="dot"></span>agentcli&#8201;<span class="dim">guidelines</span></div>
  <div style="display:flex;gap:18px;align-items:center"><span class="tag">read-only by default</span><span class="url">aclig.dev</span></div>
</div></body></html>`;

const STD = 'Agent CLI Guidelines';
// Per-page OG cards (1200x630). Versioned kickers are fine — regenerated + re-served each release.
const pages = [
  { slug: 'home', kicker: 'The standard · v0.3', title: 'Build CLIs your agent can actually drive.' },
  { slug: 'default', kicker: 'The standard · v0.3', title: 'Agent CLI Guidelines' },
  { slug: 'philosophy', kicker: STD, title: 'Philosophy' },
  { slug: 'invariants', kicker: STD, title: 'Invariants — the core' },
  { slug: 'foundations', kicker: STD, title: 'Foundations: output, errors, exit codes' },
  { slug: 'safety', kicker: STD, title: 'Safety & mutation control' },
  { slug: 'self-description', kicker: STD, title: 'Self-description' },
  { slug: 'economy', kicker: STD, title: 'Token & context economy' },
  { slug: 'auth', kicker: STD, title: 'Auth & secrets' },
  { slug: 'antipatterns', kicker: STD, title: 'Antipatterns' },
  { slug: 'conformance', kicker: STD, title: 'Conformance' },
  { slug: 'badge', kicker: STD, title: 'Get the badge' },
  { slug: 'evolution', kicker: STD, title: 'Evolution & governance' },
  { slug: 'prior-art', kicker: STD, title: 'Prior art & credits' },
];

// GitHub repo social preview (1280x640). Version-free kicker so it doesn't need re-uploading
// every release (GitHub social previews are a manual upload).
const social = {
  out: 'public/social-card.png',
  kicker: 'The standard',
  title: 'Build CLIs your agent can actually drive.',
  w: 1280,
  h: 640,
};

mkdirSync(join(ROOT, 'public/og'), { recursive: true });
const jobs = [
  ...pages.map((p) => ({ ...p, out: `public/og/${p.slug}.png`, name: p.slug })),
  { ...social, name: 'social' },
];
for (const j of jobs) {
  const w = j.w || 1200;
  const h = j.h || 630;
  const html = join(tmpdir(), `og-${j.name}.html`);
  const raw = join(tmpdir(), `og-${j.name}-raw.png`);
  const out = join(ROOT, j.out);
  writeFileSync(html, card({ kicker: j.kicker, title: j.title, w, h }));
  execFileSync(CHROME, [
    '--headless=new', '--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${w},${h * 2}`, '--default-background-color=00000000',
    '--virtual-time-budget=1500', `--screenshot=${raw}`, `file://${html}`,
  ], { stdio: 'ignore' });
  await sharp(raw).extract({ left: 0, top: 0, width: w, height: h }).toFile(out);
  console.log('wrote', out);
}
console.log('done:', jobs.length, 'cards');

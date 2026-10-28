// Gera o banner e os cartões SVG do README (assets/*.svg). Sem dependências: node scripts/build-svgs.mjs
// Identidade v3 de dehor.dev: fundo noturno, teal como acento, âmbar pontual, Geist embutida (subset em scripts/fonts).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets");
mkdirSync(OUT, { recursive: true });

const C = {
  bg: "#0b0c0e", surf: "#111215", line: "#1f2126", edge: "#2a2d33", dot: "#1c1e23",
  w: "#ededef", s: "#8b8d94", m: "#5d6068", t: "#2dd4bf", a: "#f2b84b",
};

const font = (file) => readFileSync(join(ROOT, "scripts", "fonts", file)).toString("base64");
const SANS_FACE = `@font-face{font-family:Geist;font-weight:100 900;src:url(data:font/woff2;base64,${font("geist.woff2")}) format("woff2")}`;
const MONO_FACE = `@font-face{font-family:GeistMono;src:url(data:font/woff2;base64,${font("geist-mono.woff2")}) format("woff2")}`;
const BASE_CSS = `.sans{font-family:Geist,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.mono{font-family:GeistMono,ui-monospace,SFMono-Regular,Menlo,monospace}
.p{fill:none;stroke:${C.t};stroke-width:2;stroke-linecap:round;stroke-dasharray:6 200;stroke-dashoffset:8}
@keyframes breathe{50%{opacity:.35}}
.breathe{animation:breathe 2.8s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.p{opacity:0}}`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONO_EM = 0.6; // Geist Mono: avanço fixo de 600/1000
const monoW = (str, size) => str.length * size * MONO_EM;

function svg(w, h, label, css, body, { mono = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">` +
    `<style>${SANS_FACE}${mono ? MONO_FACE : ""}${BASE_CSS}${css}</style>${body}</svg>\n`;
}

/** Superfície do cartão: fundo próprio (funciona em tema claro e escuro), borda de 1px e grade pontilhada que esmaece. */
function surface(w, h, glow) {
  const [gx, gy, gr] = glow;
  return `<defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="${C.dot}"/></pattern>` +
    `<radialGradient id="fade" cx="${gx}" cy="${gy}" r="${gr}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="glow" cx="${gx}" cy="${gy}" r="${gr}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.t}" stop-opacity=".11"/><stop offset="1" stop-color="${C.t}" stop-opacity="0"/></radialGradient>` +
    `<mask id="m"><rect width="${w}" height="${h}" fill="url(#fade)"/></mask>` +
    `<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="12" fill="${C.bg}" stroke="${C.line}"/>` +
    `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="url(#dots)" mask="url(#m)"/>` +
    `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="url(#glow)"/>`;
}

/** Nó do grafo: pílula com rótulo mono. */
function pill(label, cx, cy, { size = 12, cls = "", stroke = C.edge, color = "#c9cbd1", delay } = {}) {
  const w = Math.round(monoW(label, size) + 22), h = size + 15;
  const st = delay === undefined ? "" : ` style="animation-delay:${delay.toFixed(2)}s"`;
  return `<g class="${cls}"><rect${st} x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="7" fill="${C.surf}" stroke="${stroke}"/>` +
    `<text class="mono" x="${cx}" y="${cy + size * 0.36}" font-size="${size}" fill="${color}" text-anchor="middle">${esc(label)}</text></g>`;
}
const pillHalf = (label, size = 12) => Math.round(monoW(label, size) + 22) / 2;

/** Curva suave da direita de um nó até a esquerda do outro. */
const curve = (x1, y1, x2, y2) => {
  const k = (x2 - x1) / 2;
  return `M${x1} ${y1}C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`;
};

/** Seta ↗ desenhada (a fonte subset não carrega o glifo). */
const arrow = (x, y, color) =>
  `<path d="M${x} ${y}l6 -6M${x + 1.5} ${y - 6}h4.5v4.5" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- banner ----------
function banner() {
  const W = 960, H = 330;
  const A = [604, 165], user = [530, 165];
  const servers = [["mcp-fiscal", 730, 108], ["mcp-juridico", 730, 232]];
  const tools = [["consultar_cnpj", 0, 860, 66], ["parse_nfe_xml", 0, 860, 146], ["buscar_processo", 1, 860, 232]];
  const aHalf = pillHalf("agent", 12);

  const edges = [];
  const toServer = servers.map(([n, x, y]) => curve(A[0] + aHalf, A[1], x - pillHalf(n), y));
  const toTool = tools.map(([n, si, x, y]) => curve(servers[si][1] + pillHalf(servers[si][0]), servers[si][2], x - pillHalf(n), y));
  const inEdge = curve(user[0] + 4, user[1], A[0] - aHalf, A[1]);
  edges.push(inEdge, ...toServer, ...toTool);

  const DUR = 4.8;
  const routes = tools.map((t, i) => ({ seg: [inEdge, toServer[t[1]], toTool[i]], delay: -(i * DUR) / 3 }));
  const pulses = routes.map(({ seg, delay }) => seg.map((d, k) =>
    `<path class="p s${k}" pathLength="100" style="animation-delay:${delay.toFixed(2)}s" d="${d}"/>`).join("")).join("");

  const css = `.s0,.s1,.s2{animation:${DUR}s linear infinite}
.s0{animation-name:s0}.s1{animation-name:s1}.s2{animation-name:s2}
@keyframes s0{0%{stroke-dashoffset:8}22%,100%{stroke-dashoffset:-102}}
@keyframes s1{0%,22%{stroke-dashoffset:8}50%,100%{stroke-dashoffset:-102}}
@keyframes s2{0%,50%{stroke-dashoffset:8}78%,100%{stroke-dashoffset:-102}}
.hit rect{animation:hit ${DUR}s linear infinite}
@keyframes hit{0%,76%,100%{stroke:${C.edge}}82%{stroke:${C.t}}}
.ring{transform-box:fill-box;transform-origin:center;animation:ring 2.8s ease-out infinite}
@keyframes ring{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.6);opacity:0}}`;

  const body = surface(W, H, [720, 165, 330]) +
    `<text class="mono" x="48" y="108" font-size="12" fill="${C.t}" letter-spacing=".04em">dehor.dev</text>` +
    `<text class="sans" x="46" y="164" font-size="50" font-weight="600" fill="${C.w}" letter-spacing="-.03em">Nikolas de Hor</text>` +
    `<text class="sans" x="48" y="200" font-size="18" fill="#a3a5ac" letter-spacing="-.005em">AI Engineer · agents &amp; MCP in production</text>` +
    `<rect x="48.5" y="234.5" width="232" height="27" rx="13.5" fill="${C.surf}" stroke="${C.line}"/>` +
    `<circle class="ring" cx="64" cy="248" r="3.5" fill="none" stroke="${C.t}"/><circle cx="64" cy="248" r="3" fill="${C.t}"/>` +
    `<text class="mono" x="76" y="252" font-size="11" fill="${C.s}">now building <tspan fill="${C.w}">LUME</tspan> at CAST</text>` +
    `<g fill="none" stroke="${C.edge}" stroke-width="1">${edges.map((d) => `<path d="${d}"/>`).join("")}</g>` +
    `<g filter="url(#blur)">${pulses}</g>` +
    `<circle cx="${user[0]}" cy="${user[1]}" r="4" fill="${C.a}"/><circle class="ring" style="stroke:${C.a}" cx="${user[0]}" cy="${user[1]}" r="4" fill="none" stroke="${C.a}"/>` +
    pill("agent", A[0], A[1], { size: 12, stroke: C.t, color: C.w }) +
    servers.map(([n, x, y]) => pill(n, x, y)).join("") +
    tools.map(([n, , x, y], i) => pill(n, x, y, { cls: "hit", color: C.s, delay: routes[i].delay })).join("");

  return svg(W, H, "Nikolas de Hor. AI Engineer, agents and MCP in production.", css, body);
}

// ---------- arte de cada cartão (região à direita, x 540 a 720) ----------
function matrixArt(cols, rows, x0, y0, gap) {
  const n = cols * rows, step = 3.6 / n;
  let out = "";
  for (let i = 0; i < n; i++) {
    const cx = x0 + (i % cols) * gap, cy = y0 + Math.floor(i / cols) * gap;
    out += `<circle cx="${cx}" cy="${cy}" r="2.4" style="animation-delay:${(i * step).toFixed(2)}s"/>`;
  }
  return `<g class="mx" fill="${C.edge}">${out}</g>`;
}
const MATRIX_CSS = `.mx circle{animation:lit 3.6s linear infinite}@keyframes lit{0%{fill:${C.t}}12%,100%{fill:${C.edge}}}`;

function waveArt(n, x0, cy, color, cls = "wv") {
  const hs = [0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.4, 0.8, 0.5, 0.95, 0.65, 0.3, 0.75, 0.55, 0.85, 0.45, 0.6];
  let out = "";
  for (let i = 0; i < n; i++) {
    const h = Math.round(hs[i % hs.length] * 56);
    out += `<rect x="${x0 + i * 9}" y="${cy - h / 2}" width="4" height="${h}" rx="2" style="animation-delay:-${((i * 0.37) % 1.6).toFixed(2)}s"/>`;
  }
  return `<g class="${cls}" fill="${color}">${out}</g>`;
}
const WAVE_CSS = `.wv rect{transform-box:fill-box;transform-origin:center;animation:wv 1.6s ease-in-out infinite}@keyframes wv{50%{transform:scaleY(.45)}}`;

function treeArt() {
  const root = [560, 90], mids = [[620, 46], [620, 76], [620, 106], [620, 136]];
  let edges = "", leaves = "";
  mids.forEach(([mx, my]) => {
    edges += `<path d="${curve(root[0], root[1], mx, my)}"/>`;
    for (let j = 0; j < 4; j++) {
      const ly = my - 10 + j * 6.5;
      edges += `<path d="${curve(mx, my, 690, ly)}"/>`;
      leaves += `<circle cx="690" cy="${ly}" r="1.6"/>`;
    }
  });
  const route = [curve(root[0], root[1], 620, 76), curve(620, 76, 690, 72.5)];
  return `<g fill="none" stroke="${C.edge}">${edges}</g><g fill="${C.m}">${leaves}</g>` +
    mids.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${C.bg}" stroke="${C.s}"/>`).join("") +
    `<circle cx="${root[0]}" cy="${root[1]}" r="5" fill="${C.t}"/>` +
    `<g filter="url(#blur)"><path class="p t0" pathLength="100" d="${route[0]}"/><path class="p t1" pathLength="100" d="${route[1]}"/></g>`;
}
const TREE_CSS = `.t0,.t1{animation:3.2s linear infinite}.t0{animation-name:t0}.t1{animation-name:t1}
@keyframes t0{0%{stroke-dashoffset:8}35%,100%{stroke-dashoffset:-102}}
@keyframes t1{0%,35%{stroke-dashoffset:8}70%,100%{stroke-dashoffset:-102}}`;

function transcribeArt() {
  const lines = [[64, C.t], [48, C.edge], [58, C.edge], [36, C.edge]].map(([w, c], i) =>
    `<rect class="tl" style="animation-delay:${(i * 0.5).toFixed(1)}s" x="618" y="${66 + i * 16}" width="${w}" height="5" rx="2.5" fill="${c}"/>`).join("");
  return waveArt(7, 540, 90, C.s) + `<path d="M${602} 85l5 5-5 5" fill="none" stroke="${C.m}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>` + lines;
}
const TRANSCRIBE_CSS = `${WAVE_CSS}.tl{transform-box:fill-box;transform-origin:left;animation:tl 3s ease-out infinite}@keyframes tl{0%{transform:scaleX(0)}40%,100%{transform:scaleX(1)}}`;

function miniGraphArt() {
  const a = [560, 90], ns = [[650, 50], [668, 92], [646, 134]];
  const ds = ns.map(([x, y]) => curve(a[0] + 6, a[1], x - 5, y));
  return `<g fill="none" stroke="${C.edge}">${ds.map((d) => `<path d="${d}"/>`).join("")}</g>` +
    `<g filter="url(#blur)">${ds.map((d, i) => `<path class="p mg" pathLength="100" style="animation-delay:-${i}s" d="${d}"/>`).join("")}</g>` +
    ns.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.bg}" stroke="${C.s}"/>`).join("") +
    `<circle cx="${a[0]}" cy="${a[1]}" r="6" fill="${C.t}"/>`;
}
const MINI_CSS = `.mg{animation:mg 3s linear infinite}@keyframes mg{0%{stroke-dashoffset:8}60%,100%{stroke-dashoffset:-102}}`;

function hubArt() {
  const cx = 616, cy = 90, r = 50;
  const spokes = [0, 1, 2, 3, 4, 5].map((i) => {
    const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  });
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line}" stroke-dasharray="2 5"/>` +
    `<g stroke="${C.edge}">${spokes.map(([x, y]) => `<path d="M${cx} ${cy}L${x.toFixed(1)} ${y.toFixed(1)}"/>`).join("")}</g>` +
    `<g class="orbit">${spokes.map(([x, y], i) => `<circle class="breathe" style="animation-delay:-${(i * 0.45).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${C.bg}" stroke="${C.t}"/>`).join("")}</g>` +
    `<circle cx="${cx}" cy="${cy}" r="9" fill="${C.a}"/>`;
}
const HUB_CSS = `.orbit{transform-origin:616px 90px;animation:orbit 40s linear infinite}@keyframes orbit{to{transform:rotate(360deg)}}`;

// ---------- cartão de projeto ----------
const CW = 840, CH = 180;
function card({ kicker, title, body, link, stat, statLabel, statSize = 60, art, css = "", label }) {
  const lines = Array.isArray(body) ? body : [body];
  const content =
    `<text class="mono" x="36" y="44" font-size="11" fill="${C.s}" letter-spacing=".08em">${esc(kicker)}</text>` +
    `<text class="sans" x="35" y="80" font-size="27" font-weight="600" fill="${C.w}" letter-spacing="-.02em">${esc(title)}</text>` +
    lines.map((l, i) => `<text class="sans" x="36" y="${111 + i * 21}" font-size="16" fill="${C.s}">${esc(l)}</text>`).join("") +
    `<text class="mono" x="36" y="152" font-size="12" fill="${C.t}">${esc(link)}</text>` + arrow(36 + monoW(link, 12) + 6, 151, C.t) +
    art +
    `<text class="sans" x="806" y="${statSize >= 50 ? 104 : 96}" font-size="${statSize}" font-weight="600" fill="${C.w}" text-anchor="end" letter-spacing="-.04em">${esc(stat)}</text>` +
    `<text class="mono" x="806" y="130" font-size="11" fill="${C.s}" text-anchor="end" letter-spacing=".08em">${esc(statLabel)}</text>`;
  return svg(CW, CH, label, css, surface(CW, CH, [640, 90, 220]) + content);
}

const files = {
  "banner.svg": banner(),
  "fiscal.svg": card({
    kicker: "MCP SERVER · OPEN SOURCE", title: "MCP Fiscal Brasil",
    body: "Brazil's tax system as MCP tools. Open source, on PyPI.",
    link: "github.com/DeHor-Labs/mcp-fiscal-brasil", stat: "44", statLabel: "TOOLS",
    art: matrixArt(11, 4, 552, 66, 13), css: MATRIX_CSS,
    label: "MCP Fiscal Brasil, 44 tools: Brazil's tax system as MCP tools. Open source, on PyPI.",
  }),
  "agrovoz.svg": card({
    kicker: "AI PRODUCT · WHATSAPP", title: "AgroVoz",
    body: "WhatsApp AI agent for farm management. Voice, text and photo.",
    link: "agrovoz.app", stat: "17", statLabel: "MODULES",
    art: waveArt(17, 552, 90, C.a), css: WAVE_CSS,
    label: "AgroVoz, 17 modules: WhatsApp AI agent for farm management. Voice, text and photo.",
  }),
  "juridico.svg": card({
    kicker: "MCP SERVER · OPEN SOURCE", title: "MCP Jurídico Brasil",
    body: "Court cases from CNJ DataJud as MCP tools. Open source.",
    link: "github.com/DeHor-Labs/mcp-juridico-brasil", stat: "91", statLabel: "COURTS",
    art: treeArt(), css: TREE_CSS,
    label: "MCP Jurídico Brasil, 91 courts: court cases from CNJ DataJud as MCP tools. Open source.",
  }),
  "transcreveai.svg": card({
    kicker: "MCP SERVER · MULTIMODAL", title: "TranscreveAI",
    body: "Video and audio into searchable dossiers, served over MCP.",
    link: "github.com/DeHor-Labs/transcreve-ai", stat: "A/V", statLabel: "TO DOSSIER",
    art: transcribeArt(), css: TRANSCRIBE_CSS,
    label: "TranscreveAI, multimodal: video and audio into searchable dossiers, served over MCP.",
  }),
  "site.svg": card({
    kicker: "PORTFOLIO", title: "dehor.dev",
    body: "Projects, writing and a live MCP agent you can talk to.",
    link: "dehor.dev", stat: "live", statLabel: "MCP AGENT",
    art: miniGraphArt(), css: MINI_CSS,
    label: "My site, dehor.dev: projects, writing and a live MCP agent you can talk to.",
  }),
  "now.svg": card({
    kicker: "NOW", title: "AI Engineer at CAST",
    body: "Lead architect of LUME, an enterprise AI agent hub.",
    link: "linkedin.com/in/nikolasdehor", stat: "LUME", statLabel: "AGENT HUB", statSize: 44,
    art: hubArt(), css: HUB_CSS,
    label: "Now: AI Engineer at CAST. Lead architect of LUME, an enterprise AI agent hub.",
  }),
};

// ---------- botões ----------
function button(label) {
  const size = 13, h = 40, w = Math.round(monoW(label, size) + 64);
  const body = `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="8" fill="${C.bg}" stroke="${C.edge}"/>` +
    `<circle cx="18" cy="20" r="3" fill="${C.t}"/>` +
    `<text class="mono" x="30" y="24.5" font-size="${size}" fill="${C.w}">${esc(label)}</text>` + arrow(w - 22, 23, C.s);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">` +
    `<style>${MONO_FACE}.mono{font-family:GeistMono,ui-monospace,SFMono-Regular,Menlo,monospace}</style>${body}</svg>\n`;
}
files["btn-site.svg"] = button("dehor.dev");
files["btn-linkedin.svg"] = button("LinkedIn");
files["btn-x.svg"] = button("X");
files["btn-email.svg"] = button("E-mail");
files["btn-news.svg"] = button("DeHor News");

const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);
const MAX_KB = 60;
for (const [name, out] of Object.entries(files)) {
  if (DASHES.test(out)) throw new Error(`${name}: travessão proibido`);
  const kb = Buffer.byteLength(out) / 1024;
  if (kb > MAX_KB) throw new Error(`${name}: ${kb.toFixed(1)} KB passa de ${MAX_KB} KB`);
  writeFileSync(join(OUT, name), out);
  console.log(name.padEnd(18), `${kb.toFixed(1)} KB`);
}

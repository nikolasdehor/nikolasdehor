// Gera os cartões SVG do README (assets/*.svg). Sem dependências: node scripts/build-svgs.mjs
// Texto desenhado com uma fonte bitmap própria (abaixo), sprites do mundo pixel de dehor.dev.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

const C = {
  bg: "#0b0f14", surf: "#10161d", dot: "#1a222c", line: "#1f2a36", D: "#151c25",
  w: "#e6edf3", s: "#93a1b0", g: "#2a3644", t: "#2dd4bf", T: "#0f766e",
  a: "#f2b84b", A: "#b7791f", b: "#7a4a2a", k: "#0b0f14", p: "#f4a6b4", c: "#d9774b", C: "#a8512f",
};

// ---------- fonte bitmap (cap 7 linhas, descendentes até a linha 8) ----------
const r7 = (s) => s.split(" ");
const FONT = {
  A: r7(".###. #...# #...# ##### #...# #...# #...#"), B: r7("####. #...# #...# ####. #...# #...# ####."),
  C: r7(".###. #...# #.... #.... #.... #...# .###."), D: r7("####. #...# #...# #...# #...# #...# ####."),
  E: r7("##### #.... #.... ####. #.... #.... #####"), F: r7("##### #.... #.... ####. #.... #.... #...."),
  G: r7(".###. #...# #.... #.### #...# #...# .####"), H: r7("#...# #...# #...# ##### #...# #...# #...#"),
  I: r7("### .#. .#. .#. .#. .#. ###"), J: r7("..### ...#. ...#. ...#. #..#. #..#. .##.."),
  K: r7("#...# #..#. #.#.. ##... #.#.. #..#. #...#"), L: r7("#.... #.... #.... #.... #.... #.... #####"),
  M: r7("#...# ##.## #.#.# #.#.# #...# #...# #...#"), N: r7("#...# ##..# #.#.# #..## #...# #...# #...#"),
  O: r7(".###. #...# #...# #...# #...# #...# .###."), P: r7("####. #...# #...# ####. #.... #.... #...."),
  Q: r7(".###. #...# #...# #...# #.#.# #..#. .##.#"), R: r7("####. #...# #...# ####. #.#.. #..#. #...#"),
  S: r7(".#### #.... #.... .###. ....# ....# ####."), T: r7("##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#.."),
  U: r7("#...# #...# #...# #...# #...# #...# .###."), V: r7("#...# #...# #...# #...# #...# .#.#. ..#.."),
  W: r7("#...# #...# #...# #.#.# #.#.# ##.## #...#"), X: r7("#...# #...# .#.#. ..#.. .#.#. #...# #...#"),
  Y: r7("#...# #...# .#.#. ..#.. ..#.. ..#.. ..#.."), Z: r7("##### ....# ...#. ..#.. .#... #.... #####"),
  0: r7(".###. #...# #..## #.#.# ##..# #...# .###."), 1: r7(".#. ##. .#. .#. .#. .#. ###"),
  2: r7(".###. #...# ....# ...#. ..#.. .#... #####"), 3: r7("####. ....# ....# .###. ....# ....# ####."),
  4: r7("...#. ..##. .#.#. #..#. ##### ...#. ...#."), 5: r7("##### #.... ####. ....# ....# #...# .###."),
  6: r7(".###. #.... #.... ####. #...# #...# .###."), 7: r7("##### ....# ...#. ..#.. .#... .#... .#..."),
  8: r7(".###. #...# #...# .###. #...# #...# .###."), 9: r7(".###. #...# #...# .#### ....# ....# .###."),
  a: r7("..... ..... .###. ....# .#### #...# .####"), b: r7("#.... #.... ####. #...# #...# #...# ####."),
  c: r7(".... .... .### #... #... #... .###"), d: r7("....# ....# .#### #...# #...# #...# .####"),
  e: r7("..... ..... .###. #...# ##### #.... .###."), f: r7("..## .#.. #### .#.. .#.. .#.. .#.."),
  g: r7("..... ..... .#### #...# #...# #...# .#### ....# .###."), h: r7("#.... #.... ####. #...# #...# #...# #...#"),
  i: r7("# . # # # # #"), j: r7("..# ... ..# ..# ..# ..# ..# #.# .#."),
  k: r7("#... #... #..# #.#. ##.. #.#. #..#"), l: r7("# # # # # # #"),
  m: r7("..... ..... ####. #.#.# #.#.# #.#.# #.#.#"), n: r7(".... .... ###. #..# #..# #..# #..#"),
  o: r7("..... ..... .###. #...# #...# #...# .###."), p: r7("..... ..... ####. #...# #...# #...# ####. #.... #...."),
  q: r7("..... ..... .#### #...# #...# #...# .#### ....# ....#"), r: r7(".... .... #.## ##.. #... #... #..."),
  s: r7(".... .... .### #... .##. ...# ###."), t: r7(".#.. .#.. #### .#.. .#.. .#.. ..##"),
  u: r7(".... .... #..# #..# #..# #..# .###"), v: r7("..... ..... #...# #...# #...# .#.#. ..#.."),
  w: r7("..... ..... #...# #...# #.#.# #.#.# .#.#."), x: r7("..... ..... #...# .#.#. ..#.. .#.#. #...#"),
  y: r7(".... .... #..# #..# #..# #..# .### ...# .##."), z: r7(".... .... #### ...# ..#. .#.. ####"),
  ".": r7(". . . . . . #"), ",": r7(". . . . . . # #"), "'": r7("# # . . . . ."),
  "&": r7(".##.. #..#. #.#.. .#... #.#.# #..#. .##.#"), "-": r7("... ... ... ### ... ... ..."),
  ":": r7(". . # . . # ."), "/": r7("....# ...#. ...#. ..#.. .#... .#... #...."),
  "!": r7("# # # # # . #"), ">": r7("#... .#.. ..#. ...# ..#. .#.. #..."),
  "Í": r7("..# .#. ### .#. .#. .#. .#. .#. ###"),
};
const TOP = { "Í": -2 }; // glifos que começam acima da linha de topo (acento)
const SPACE = 3;

const glyphW = (ch) => (ch === " " ? SPACE : FONT[ch]?.[0].length ?? SPACE);
const measure = (str) => [...str].reduce((sum, ch, i) => sum + glyphW(ch) + (i ? 1 : 0), 0);
const box = (x, y, w, h) => `M${x} ${y}h${w}v${h}h-${w}z`;

/** Texto como um único <path>: cada sequência horizontal de pixels vira um retângulo. */
function text(str, x, y, scale, fill) {
  let d = "";
  let cx = 0;
  for (const ch of str) {
    if (FONT[ch] === undefined && ch !== " ") throw new Error(`glifo ausente: ${ch}`);
    (FONT[ch] ?? []).forEach((row, ry) => {
      for (let i = 0; i < row.length; ) {
        if (row[i] !== "#") { i++; continue; }
        let j = i;
        while (row[j] === "#") j++;
        d += box(x + (cx + i) * scale, y + (ry + (TOP[ch] ?? 0)) * scale, (j - i) * scale, scale);
        i = j;
      }
    });
    cx += glyphW(ch) + 1;
  }
  return d ? `<path fill="${fill}" d="${d}"/>` : "";
}

/** Quebra por palavras para caber em maxW pixels na escala dada. */
function wrap(str, scale, maxW) {
  const lines = [];
  let cur = "";
  for (const word of str.split(" ")) {
    const next = cur ? `${cur} ${word}` : word;
    if (measure(next) * scale > maxW && cur) { lines.push(cur); cur = word; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- sprites (bitmaps do mundo de dehor.dev; "." transparente) ----------
function sprite(rows, x, y, s) {
  const byColor = {};
  rows.forEach((row, ry) => {
    for (let i = 0; i < row.length; ) {
      const c = row[i];
      if (c === "." || !C[c]) { i++; continue; }
      let j = i;
      while (row[j] === c) j++;
      byColor[c] = (byColor[c] ?? "") + box(x + i * s, y + ry * s, (j - i) * s, s);
      i = j;
    }
  });
  return Object.entries(byColor).map(([c, d]) => `<path fill="${C[c]}" d="${d}"/>`).join("");
}

const TIAO = ["....aaaaa....", "...aAAAAAa...", ".aaaaaaaaaaa.", "..ttttttttt..", "..twwtttwwt..", "..twktttwkt..", "..ttttttttt..", "..tttkkkttt..", "...ttttttt...", "....ccCcc....", ".tTtttttttTt.", ".t.ttttttt.t.", "...ttttttt..."];
const TIAO_LEGS_A = "...tt...tt...";
const TIAO_LEGS_B = "....tt.tt....";
const COW = [
  "...........a..a.", "...........wwwww", ".wwwwwwkkwwwwwkw", "kwkkwwwkkwwwwwpp", "kwkkwwwwwwwwwwpp",
  "kwwwwwwwkkw.www.", ".wwwwwwwkkw.....", "..w.w...w.w.....", "..k.k...k.k.....",
];
const UNIT = ["gkDDDDDkg", "gkDsDsDkg", "gkkkkkkkg"];
const RACK = ["ggggggggg", "gkkkkkkkg", ...UNIT, ...UNIT, ...UNIT, ...UNIT, "ggggggggg", "gg.....gg"];

// ---------- moldura comum ----------
const W = 840;
const STYLE = `.blink{animation:blink 1.2s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.pulse{animation:pulse 2.4s ease-in-out infinite}
@keyframes pulse{50%{opacity:.25}}
.f3{opacity:0;animation:f3 1.2s steps(1) infinite}
@keyframes f3{0%{opacity:1}33.4%{opacity:0}}
.la{animation:blink .5s steps(1) infinite}.lb{opacity:0;animation:lb .5s steps(1) infinite}
@keyframes lb{50%{opacity:1}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.d0,.la{opacity:1!important}}`;

const chamferPath = (w, h, i) =>
  `M${4 + i} ${i}H${w - 4 - i}V${2 + i}H${w - 2 - i}V${4 + i}H${w - i}V${h - 4 - i}H${w - 2 - i}V${h - 2 - i}H${w - 4 - i}V${h - i}H${4 + i}V${h - 2 - i}H${2 + i}V${h - 4 - i}H${i}V${4 + i}H${2 + i}V${2 + i}H${4 + i}Z`;

function frame(h, inner, label, extraStyle = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" shape-rendering="crispEdges" role="img" aria-label="${label}"><style>${STYLE}${extraStyle}</style>` +
    `<defs><pattern id="d" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="11" y="11" width="2" height="2" fill="${C.dot}"/></pattern></defs>` +
    `<path d="${chamferPath(W, h, 0)}" fill="${C.line}"/><path d="${chamferPath(W, h, 2)}" fill="${C.bg}"/>` +
    `<rect x="4" y="4" width="${W - 8}" height="${h - 8}" fill="url(#d)"/>${inner}</svg>\n`;
}

/** Selo teal ao lado do título; o halo pulsa devagar. */
function badge(label, x, y) {
  const w = measure(label) * 2 + 20;
  return `<rect class="pulse" x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${32}" fill="${C.T}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="26" fill="${C.t}"/>` + text(label, x + 10, y + 6, 2, C.k);
}

const H = 236;
/** Cartão de projeto: rótulo, título com selo, descrição em até 2 linhas, link e arte à direita. */
function card({ kicker, title, badge: b, body, link, art, label, bodyW = 590, extraStyle = "", h = H }) {
  let inner = text(kicker, 40, 30, 2, C.a) + text(title, 40, 58, 4, C.w) + badge(b, 40 + measure(title) * 4 + 20, 59);
  const lines = wrap(body, 3, bodyW);
  if (lines.length > 2) throw new Error(`${title}: descrição passou de 2 linhas`);
  lines.forEach((line, i) => { inner += text(line, 40, 110 + i * 34, 3, C.s); });
  inner += text(`> ${link}`, 40, 196, 2, C.t) + art;
  return frame(h, inner, label, extraStyle);
}

// ---------- arte de cada cartão ----------
function rackArt() {
  const x = 700, y = 42, s = 8;
  const leds = [0, 1, 2, 3].map((u) =>
    `<rect class="blink" style="animation-duration:${(0.9 + u * 0.35).toFixed(2)}s;animation-delay:-${(u * 0.37).toFixed(2)}s" x="${x + 6 * s}" y="${y + (3 + u * 3) * s}" width="${s}" height="${s}" fill="${C.t}"/>`).join("");
  return sprite(RACK, x, y, s) + leds;
}

function tiaoVoiceArt() {
  const x = 714, y = 66, s = 6;
  const frames = [[2, 5, 3, 6, 2], [4, 2, 6, 3, 5], [6, 4, 2, 5, 3]];
  const bars = frames.map((hs, f) =>
    `<path class="f3 d${f}" style="animation-delay:-${(f * 0.4).toFixed(1)}s" fill="${C.a}" d="${hs.map((h, i) => box(x - 64 + i * 10, y + 44 - h * 4, 6, h * 8)).join("")}"/>`).join("");
  return bars + sprite([...TIAO, TIAO_LEGS_A], x, y, s);
}

function scalesArt() {
  const x = 688, y = 46, s = 8;
  const post = sprite(["....a....", "...aAa...", "....a....", "....a....", "....a....", "....a....", "....a....", "....a....", "....a....", "..aaaaa..", ".AAAAAAA."], x + 2 * s, y, s);
  const tilt = (dl, dr) => sprite(["aaaaaaaaaaaaa"], x, y + 3 * s, s) +
    sprite(["a", "a"], x, y + (4 + dl) * s, s) + sprite(["a", "a"], x + 12 * s, y + (4 + dr) * s, s) +
    sprite(["aaaaa", ".AAA."], x - 2 * s, y + (6 + dl) * s, s) + sprite(["aaaaa", ".AAA."], x + 10 * s, y + (6 + dr) * s, s);
  return post + `<g class="la" style="animation-duration:2.4s">${tilt(0, 1)}</g><g class="lb" style="animation-duration:2.4s">${tilt(1, 0)}</g>`;
}

function transcribeArt() {
  const x = 676, y = 44, s = 7;
  const screen = ["gggggggggggggggg", "gkkkkkkkkkkkkkkg", "gkkkkkakkkkkkkkg", "gkkkkkaakkkkkkkg", "gkkkkkaaakkkkkkg", "gkkkkkaakkkkkkkg", "gkkkkkakkkkkkkkg", "gkkkkkkkkkkkkkkg", "gggggggggggggggg"];
  const lines = [112, 84, 98].map((w, i) =>
    `<rect class="blink" style="animation-duration:2.4s;animation-delay:-${(i * 0.4).toFixed(1)}s" x="${x}" y="${y + 80 + i * 14}" width="${w}" height="6" fill="${i === 0 ? C.t : C.g}"/>`).join("");
  return sprite(screen, x, y, s) + lines;
}

function hubArt() {
  const cx = 732, cy = 116;
  let out = "";
  [[-68, -58], [62, -62], [-72, 56], [64, 58]].forEach(([dx, dy], i) => {
    for (let k = 1; k < 6; k++) out += `<rect x="${Math.round(cx + (dx * k) / 6) - 2}" y="${Math.round(cy + (dy * k) / 6) - 2}" width="4" height="4" fill="${C.g}"/>`;
    out += `<rect class="pulse" style="animation-delay:-${(i * 0.6).toFixed(1)}s" x="${cx + dx - 10}" y="${cy + dy - 10}" width="20" height="20" fill="${C.T}"/>`;
    out += `<rect x="${cx + dx - 6}" y="${cy + dy - 6}" width="12" height="12" fill="${C.t}"/>`;
  });
  return out + `<rect x="${cx - 18}" y="${cy - 18}" width="36" height="36" fill="${C.a}"/><rect x="${cx - 10}" y="${cy - 10}" width="20" height="20" fill="${C.A}"/>`;
}

// Cartão do site: o Tião anda pela linha tracejada até a vaca, diz "200 OK" e volta.
const WALK = 360; // distância percorrida em px
const TS = 3; // escala do Tião
const TW = 13 * TS;
const SITE_STYLE = `
.walk{animation:walk 18s steps(80) infinite}
@keyframes walk{0%{transform:translate(0px,0px) scale(1,1)}42%{transform:translate(${WALK}px,0px) scale(1,1)}53.99%{transform:translate(${WALK}px,0px) scale(1,1)}54%{transform:translate(${WALK + TW}px,0px) scale(-1,1)}96%{transform:translate(${TW}px,0px) scale(-1,1)}99.99%{transform:translate(${TW}px,0px) scale(-1,1)}}
.bub{opacity:0;animation:bub 18s steps(1) infinite}
@keyframes bub{43%{opacity:1}53%{opacity:0}}`;
function siteArt() {
  const gx = 330, ground = 262;
  const tiao = sprite(TIAO, 0, 0, TS) +
    `<g class="la">${sprite([TIAO_LEGS_A], 0, 13 * TS, TS)}</g><g class="lb">${sprite([TIAO_LEGS_B], 0, 13 * TS, TS)}</g>`;
  let dash = "";
  for (let x = gx; x < 800; x += 12) dash += box(x, ground, 6, 2);
  const bw = measure("200 OK") * 2 + 16, bx = gx + WALK + TW / 2 - bw / 2, by = ground - 14 * TS - 44;
  const bubble = `<g class="bub"><rect x="${bx}" y="${by}" width="${bw}" height="26" fill="${C.w}"/>` +
    `<rect x="${bx + bw / 2 - 3}" y="${by + 26}" width="6" height="6" fill="${C.w}"/>${text("200 OK", bx + 8, by + 6, 2, C.k)}</g>`;
  return `<path fill="${C.g}" d="${dash}"/>` + sprite(COW, 748, ground - 9 * TS, TS) +
    `<g transform="translate(${gx} ${ground - 14 * TS})"><g class="walk">${tiao}</g></g>` + bubble;
}

// ---------- cartões ----------
const files = {
  "fiscal.svg": card({
    kicker: "MCP SERVER", title: "MCP FISCAL BRASIL", badge: "44 TOOLS",
    body: "Brazil's tax system as MCP tools. Open source, on PyPI.",
    link: "github.com/DeHor-Labs/mcp-fiscal-brasil", art: rackArt(),
    label: "MCP Fiscal Brasil, 44 tools: Brazil's tax system as MCP tools. Open source, on PyPI.",
  }),
  "agrovoz.svg": card({
    kicker: "AI PRODUCT", title: "AGROVOZ", badge: "17 MODULES",
    body: "WhatsApp AI agent for farm management. Voice, text and photo.",
    link: "agrovoz.app", art: tiaoVoiceArt(), bodyW: 570,
    label: "AgroVoz, 17 modules: WhatsApp AI agent for farm management. Voice, text and photo.",
  }),
  "juridico.svg": card({
    kicker: "MCP SERVER", title: "MCP JURÍDICO BRASIL", badge: "91 COURTS",
    body: "Court cases from CNJ DataJud as MCP tools. Open source.",
    link: "github.com/DeHor-Labs/mcp-juridico-brasil", art: scalesArt(),
    label: "MCP Jurídico Brasil, 91 courts: court cases from CNJ DataJud as MCP tools. Open source.",
  }),
  "transcreveai.svg": card({
    kicker: "MCP SERVER", title: "TRANSCREVEAI", badge: "MULTIMODAL",
    body: "Video and audio into searchable dossiers, served over MCP.",
    link: "github.com/DeHor-Labs/transcreve-ai", art: transcribeArt(),
    label: "TranscreveAI, multimodal: video and audio into searchable dossiers, served over MCP.",
  }),
  "site.svg": card({
    kicker: "DEHOR.DEV", title: "MY SITE", badge: "BUILT BY ROBOTS",
    body: "Every section assembled by tiny pixel agents. Try my live MCP agent.",
    link: "dehor.dev", art: siteArt(), extraStyle: SITE_STYLE, h: 290,
    label: "My site, dehor.dev, built by robots: every section assembled by tiny pixel agents. Try my live MCP agent.",
  }),
  "now.svg": card({
    kicker: "NOW", title: "CAST", badge: "AI ENGINEER",
    body: "AI Engineer at CAST. Lead architect of LUME, an enterprise AI agent hub.",
    link: "linkedin.com/in/nikolasdehor", art: hubArt(),
    label: "Now: AI Engineer at CAST. Lead architect of LUME, an enterprise AI agent hub.",
  }),
};

// ---------- botões ----------
function button(label) {
  const s = 3, h = 48, w = measure(`> ${label}`) * s + 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges" role="img" aria-label="${label}">` +
    `<path fill="${C.T}" d="${chamferPath(w, h, 0)}"/><path fill="${C.surf}" d="${chamferPath(w, h, 2)}"/>` +
    text(">", 20, 14, s, C.a) + text(label, 20 + measure("> ") * s, 14, s, C.w) + "</svg>\n";
}
files["btn-site.svg"] = button("SITE");
files["btn-linkedin.svg"] = button("LINKEDIN");
files["btn-email.svg"] = button("E-MAIL");
files["btn-news.svg"] = button("DEHOR NEWS");

const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);
for (const [name, svg] of Object.entries(files)) {
  if (DASHES.test(svg)) throw new Error(`${name}: travessão proibido`);
  writeFileSync(join(OUT, name), svg);
  console.log(name.padEnd(18), `${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}

// Generates icons/*.png (44x44) and select_{w,c,e}.png for the Ventoy-Liquid theme.
// Usage: npm i simple-icons @resvg/resvg-js   (in a scratch dir)
//        NODE_PATH=<scratch>/node_modules node generate_icons.cjs
// Brand glyph paths come from the CC0 Simple Icons set; Windows, tools, recovery and folder glyphs are drawn here.
const fs = require('fs');
const path = require('path');
const si = require('simple-icons');
const { Resvg } = require('@resvg/resvg-js');

const ICON = 44;
const ITEM_H = 52;
const out = __dirname;
fs.mkdirSync(path.join(out, 'icons'), { recursive: true });

const glyph = (slug) => si[`si${slug[0].toUpperCase()}${slug.slice(1)}`].path;
const brand = (slug) => `<path d="${glyph(slug)}"/>`;

const windows = [
  [2.6, 2.6], [13.0, 2.6], [2.6, 13.0], [13.0, 13.0],
].map(([x, y]) => `<rect x="${x}" y="${y}" width="8.4" height="8.4" rx="1.2"/>`).join('');
const disc = '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="12" cy="12" r="2.6"/>';
const folder = '<path d="M2 7.2A2.2 2.2 0 0 1 4.2 5h4.9l2.2 2.6h8.5A2.2 2.2 0 0 1 22 9.8v8A2.2 2.2 0 0 1 19.8 20H4.2A2.2 2.2 0 0 1 2 17.8z"/>';
const back = '<path d="M19.5 12H5M11.5 5.2 4.6 12l6.9 6.8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>';
const lifebuoy = (tint) => `<circle cx="12" cy="12" r="7.3" fill="none" stroke="#fff" stroke-width="5"/>` +
  [45, 135, 225, 315].map((a) => `<line x1="12" y1="12" x2="12" y2="2" stroke="${tint}" stroke-width="4.6" transform="rotate(${a} 12 12) translate(0 0)" stroke-dasharray="0 4.6 4.8 100"/>`).join('');
const gear = '<circle cx="12" cy="12" r="6.1" fill="none" stroke="#fff" stroke-width="3.4"/>' +
  Array.from({ length: 8 }, (_, i) => `<rect x="10.2" y="1.6" width="3.6" height="4.4" rx="0.8" transform="rotate(${i * 45} 12 12)"/>`).join('');

// name -> [top colour, bottom colour, glyph svg, glyph scale]
const icons = {
  windows: ['#4cc2ff', '#0a64d6', windows],
  winpe: ['#5eead4', '#0e7f8f', windows],
  macos: ['#8e96a3', '#2a2f3a', brand('apple')],
  ubuntu: ['#ff8a5c', '#d13f10', brand('ubuntu')],
  zorin: ['#4cc4ff', '#0b72c9', brand('zorin')],
  linux: ['#6b7280', '#1f2530', brand('linux')],
  debian: ['#ff4d88', '#a80a3c', brand('debian')],
  fedora: ['#6fb7ff', '#294172', brand('fedora')],
  archlinux: ['#4cc0ff', '#0f6fa8', brand('archlinux')],
  linuxmint: ['#a5dc6a', '#4f8a1d', brand('linuxmint')],
  kali: ['#7fa2c0', '#2a3f52', brand('kalilinux')],
  recovery: ['#ffb066', '#e0561f', lifebuoy('#f1752f')],
  tools: ['#a3a9b5', '#454c5a', gear],
  vtoyiso: ['#9b8cff', '#4636c7', disc],
  vtoyimg: ['#7ad0ff', '#1a6fb0', disc],
  vtoywim: ['#7ad0ff', '#1a6fb0', disc],
  vtoyvhd: ['#7ad0ff', '#1a6fb0', disc],
  vtoyefi: ['#a3a9b5', '#454c5a', disc],
  vtoyvtoy: ['#a3a9b5', '#454c5a', disc],
  vtoydir: ['#ffd27a', '#e08a1a', folder],
  vtoyret: ['#8e96a3', '#3a404c', back],
};

function iconSvg([top, bottom, body]) {
  const s = 1.08;
  const t = (ICON - 24 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON}" height="${ICON}" viewBox="0 0 ${ICON} ${ICON}">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.50"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#fff" stop-opacity="0.55"/></linearGradient>
    <clipPath id="c"><rect x="1" y="1" width="${ICON - 2}" height="${ICON - 2}" rx="10.5"/></clipPath>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0.8" stdDeviation="0.9" flood-color="#000" flood-opacity="0.35"/></filter>
  </defs>
  <rect x="1" y="1" width="${ICON - 2}" height="${ICON - 2}" rx="10.5" fill="url(#tile)"/>
  <g clip-path="url(#c)"><ellipse cx="${ICON / 2}" cy="0" rx="${ICON * 0.72}" ry="${ICON * 0.52}" fill="url(#gloss)"/></g>
  <rect x="1.5" y="1.5" width="${ICON - 3}" height="${ICON - 3}" rx="10" fill="none" stroke="url(#rim)" stroke-width="1"/>
  <g transform="translate(${t} ${t}) scale(${s})" fill="#fff" filter="url(#sh)">${body}</g>
</svg>`;
}

function render(svg, width) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

for (const [name, spec] of Object.entries(icons)) {
  fs.writeFileSync(path.join(out, 'icons', `${name}.png`), render(iconSvg(spec), ICON));
}

// Selection pill: left cap, stretchable centre, right cap (GRUB 9-slice without n/s pieces).
const CAP = ITEM_H / 2;
const PILL_W = CAP * 2 + 16;
const pill = (x, w) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${ITEM_H}" viewBox="${x} 0 ${w} ${ITEM_H}">
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.34"/><stop offset="1" stop-color="#fff" stop-opacity="0.14"/></linearGradient>
    <linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.80"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0.40"/></linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${PILL_W - 1}" height="${ITEM_H - 1}" rx="${CAP - 0.5}" fill="url(#f)" stroke="url(#r)" stroke-width="1"/>
</svg>`;
fs.writeFileSync(path.join(out, 'select_w.png'), render(pill(0, CAP), CAP));
fs.writeFileSync(path.join(out, 'select_c.png'), render(pill(CAP, 16), 16));
fs.writeFileSync(path.join(out, 'select_e.png'), render(pill(PILL_W - CAP, CAP), CAP));

// Terminal box (GRUB console / messages): dark glass 9-slice, sliced from one 64x64 rounded square.
const T = 64, TC = 24, TM = T - 2 * TC;
const termSvg = (x, y, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a2e" stop-opacity="0.90"/><stop offset="1" stop-color="#141416" stop-opacity="0.94"/></linearGradient>
    <linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.70"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.20"/><stop offset="1" stop-color="#fff" stop-opacity="0.35"/></linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${T - 1}" height="${T - 1}" rx="${TC - 0.5}" fill="url(#f)" stroke="url(#r)" stroke-width="1"/>
</svg>`;
const slices = {
  nw: [0, 0, TC, TC], n: [TC, 0, TM, TC], ne: [T - TC, 0, TC, TC],
  w: [0, TC, TC, TM], c: [TC, TC, TM, TM], e: [T - TC, TC, TC, TM],
  sw: [0, T - TC, TC, TC], s: [TC, T - TC, TM, TC], se: [T - TC, T - TC, TC, TC],
};
for (const [name, [x, y, w, h]] of Object.entries(slices)) {
  fs.writeFileSync(path.join(out, `terminal_box_${name}.png`), render(termSvg(x, y, w, h), w));
}
console.log(`${Object.keys(icons).length} icons + selection pieces`);

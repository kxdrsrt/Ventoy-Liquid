// Generates icons/*.png (52x52), select_{w,c,e}.png and ../icons-preview.png for the Ventoy-Liquid theme.
// Usage: npm i simple-icons @resvg/resvg-js   (in a scratch dir)
//        NODE_PATH=<scratch>/node_modules node generate_icons.cjs
// Brand glyph paths come from the CC0 Simple Icons set; Windows, tools, recovery and folder glyphs are drawn here.
const fs = require('fs');
const path = require('path');
const si = require('simple-icons');
const { Resvg } = require('@resvg/resvg-js');

const ICON = 52;
const ITEM_H = 60;
const GLYPH = 26; // glyph box in px; an even margin keeps edges on the pixel grid
const out = __dirname;
fs.mkdirSync(path.join(out, 'icons'), { recursive: true });

const glyph = (slug) => si[`si${slug[0].toUpperCase()}${slug.slice(1)}`].path;
const brand = (slug) => `<path d="${glyph(slug)}"/>`;

// Pixel-snapped panes (this glyph is drawn in the 26px box, not the 24 unit box).
const windows = [[1, 1], [14, 1], [1, 14], [14, 14]]
  .map(([x, y]) => `<rect x="${x}" y="${y}" width="11" height="11" rx="1.6"/>`).join('');
const disc = '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="12" cy="12" r="2.6"/>';
const chip = '<rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="#fff" stroke-width="2.2"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx="0.8"/>' +
  [9, 12, 15].map((p) => `<path d="M${p} 2.4V5M${p} 19v2.6M2.4 ${p}H5M19 ${p}h2.6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`).join('');
const pie = '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M12 12V4.6A7.4 7.4 0 0 1 18 16.3z"/>';
const clone = '<rect x="3" y="3" width="12" height="12" rx="2.6" fill="none" stroke="#fff" stroke-width="2.2"/><rect x="9" y="9" width="12" height="12" rx="2.6"/>';
const easeusGlyph = '<path d="M17 5H8.5A1.5 1.5 0 0 0 7 6.5v11A1.5 1.5 0 0 0 8.5 19H17M7 12h8.5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>';
const reflectGlyph = '<path d="M12 3v18" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 2.2" stroke-linecap="round"/><path d="M10 7.2 3.2 18H10z" stroke="#fff" stroke-width="1" stroke-linejoin="round"/><path d="M14 7.2 20.8 18H14z" fill-opacity="0.5" stroke="#fff" stroke-opacity="0.5" stroke-width="1" stroke-linejoin="round"/>';
const shieldGlyph = '<path d="M12 2.8 4.8 5.6v5.7c0 4.4 3 8 7.2 9.9 4.2-1.9 7.2-5.5 7.2-9.9V5.6z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><path d="m8.6 12.2 2.4 2.4 4.6-4.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
const back = '<path d="M19.5 12H5M11.5 5.2 4.6 12l6.9 6.8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>';
const lifebuoy = (tint) => `<circle cx="12" cy="12" r="7.3" fill="none" stroke="#fff" stroke-width="5"/>` +
  [45, 135, 225, 315].map((a) => `<line x1="12" y1="12" x2="12" y2="2" stroke="${tint}" stroke-width="4.6" transform="rotate(${a} 12 12) translate(0 0)" stroke-dasharray="0 4.6 4.8 100"/>`).join('');
const gear = '<circle cx="12" cy="12" r="6.1" fill="none" stroke="#fff" stroke-width="3.4"/>' +
  Array.from({ length: 8 }, (_, i) => `<rect x="10.2" y="1.6" width="3.6" height="4.4" rx="0.8" transform="rotate(${i * 45} 12 12)"/>`).join('');

// macOS-style folder: stands alone (no tile) like the Finder default.
const folderIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON}" height="${ICON}" viewBox="0 0 52 52">
  <defs>
    <linearGradient id="back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa6f4"/><stop offset="1" stop-color="#1a74da"/></linearGradient>
    <linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86d6ff"/><stop offset="0.55" stop-color="#42a8f6"/><stop offset="1" stop-color="#2386ec"/></linearGradient>
    <linearGradient id="hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.10"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#06306b" flood-opacity="0.45"/></filter>
  </defs>
  <g filter="url(#sh)">
    <path d="M4 12a4 4 0 0 1 4-4h10.5c1.8 0 2.8.8 3.9 2l1.7 1.9H44a4 4 0 0 1 4 4V40a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="url(#back)"/>
    <rect x="4" y="17" width="44" height="27" rx="4" fill="url(#front)"/>
  </g>
  <rect x="4.5" y="17.5" width="43" height="26" rx="3.5" fill="none" stroke="url(#hi)" stroke-width="1"/>
</svg>`;

const mix = (hex, to, t) => {
  const a = hex.match(/\w\w/g).map((h) => parseInt(h, 16));
  const b = to.match(/\w\w/g).map((h) => parseInt(h, 16));
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const tone = (hex) => [mix(hex, 'ffffff', 0.30), mix(hex, '000000', 0.32)];
const b = (slug, colour) => [...tone(colour.slice(1)), brand(slug)];

// name -> [top colour, bottom colour, glyph svg] or a function returning a full svg
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
  vtoydir: folderIcon,
  vtoyret: ['#8e96a3', '#3a404c', back],

  // more operating systems
  opensuse: b('opensuse', '#73ba25'),
  manjaro: b('manjaro', '#35bf5c'),
  popos: b('popos', '#48b9c7'),
  elementary: b('elementary', '#64baff'),
  endeavouros: b('endeavouros', '#7f52c8'),
  nixos: b('nixos', '#5277c3'),
  gentoo: b('gentoo', '#54487a'),
  slackware: b('slackware', '#4a5f8f'),
  centos: b('centos', '#932279'),
  rocky: b('rockylinux', '#10b981'),
  almalinux: b('almalinux', '#2a7ab0'),
  redhat: b('redhat', '#ee0000'),
  alpine: b('alpinelinux', '#0d597f'),
  void: b('voidlinux', '#478061'),
  freebsd: b('freebsd', '#ab2b28'),
  openbsd: b('openbsd', '#d9a400'),
  netbsd: b('netbsd', '#ff6600'),
  truenas: b('truenas', '#0095d5'),
  proxmox: b('proxmox', '#e57000'),
  tails: b('tails', '#56347c'),
  parrot: b('parrotsecurity', '#0aa5b5'),
  qubes: b('qubesos', '#3874d8'),
  kdeneon: b('kdeneon', '#1d99f3'),
  deepin: b('deepin', '#007cff'),
  mxlinux: b('mxlinux', '#6b7280'),
  solus: b('solus', '#5294e2'),
  android: b('android', '#3ddc84'),
  raspberrypi: b('raspberrypi', '#a22846'),
  garuda: b('garudalinux', '#8b5cf6'),
  artix: b('artixlinux', '#10a0cc'),
  openwrt: b('openwrt', '#00b5e2'),
  pfsense: b('pfsense', '#1f4a9e'),
  opnsense: b('opnsense', '#d94f00'),
  unraid: b('unraid', '#f15a2c'),
  nobara: b('nobaralinux', '#a40000'),
  cachyos: b('cachyos', '#00a8a8'),
  devuan: b('devuan', '#6c4bb4'),
  steamos: b('steam', '#3d6e99'),
  reactos: b('reactos', '#3b6ea5'),
  esxi: b('vmware', '#5f7a8a'),
  kubuntu: b('kubuntu', '#0079c1'),
  lubuntu: b('lubuntu', '#0068c8'),
  xubuntu: b('xubuntu', '#2284f2'),

  // rescue and disk tools
  memtest: [...tone('2fbf8a'), chip],
  gparted: [...tone('3aa59a'), pie],
  clonezilla: [...tone('f0a020'), clone],

  // backup and recovery suites; neutral glyphs in tile colours of my own choosing, not the vendors' logos
  easeus: [...tone('12b5cb'), easeusGlyph],
  macrium: [...tone('e0457b'), reflectGlyph],
  acronis: [...tone('3b5bdb'), shieldGlyph],
};

function iconSvg(spec) {
  if (typeof spec === 'function') return spec();
  const [top, bottom, body] = spec;
  // The Windows glyph is drawn 1:1 in pixels; everything else is a 24 unit icon scaled into the glyph box.
  const s = body === windows ? 1 : GLYPH / 24;
  const t = (ICON - GLYPH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON}" height="${ICON}" viewBox="0 0 ${ICON} ${ICON}">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.50"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#fff" stop-opacity="0.55"/></linearGradient>
    <clipPath id="c"><rect x="1" y="1" width="${ICON - 2}" height="${ICON - 2}" rx="12"/></clipPath>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="0.7" flood-color="#000" flood-opacity="0.30"/></filter>
  </defs>
  <rect x="1" y="1" width="${ICON - 2}" height="${ICON - 2}" rx="12" fill="url(#tile)"/>
  <g clip-path="url(#c)"><ellipse cx="${ICON / 2}" cy="0" rx="${ICON * 0.72}" ry="${ICON * 0.52}" fill="url(#gloss)"/></g>
  <rect x="1.5" y="1.5" width="${ICON - 3}" height="${ICON - 3}" rx="11.5" fill="none" stroke="url(#rim)" stroke-width="1"/>
  <g transform="translate(${t} ${t}) scale(${s})" fill="#fff" filter="url(#sh)">${body}</g>
</svg>`;
}

function render(svg, width) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

for (const [name, spec] of Object.entries(icons)) {
  fs.writeFileSync(path.join(out, 'icons', `${name}.png`), render(iconSvg(spec), ICON));
}

// README preview: rendered from the vectors at 2.5x so it stays sharp on GitHub (not an upscaled 52px icon).
const skip = new Set(['vtoyimg', 'vtoywim', 'vtoyvhd', 'vtoyefi', 'vtoyvtoy']);
const shown = Object.entries(icons).filter(([n]) => !skip.has(n));
const COLS = 10, CELL = 160, PX = 130;
const rows = Math.ceil(shown.length / COLS);
const tiles = shown.map(([, spec], i) => {
  const png = render(iconSvg(spec), PX).toString('base64');
  const row = Math.floor(i / COLS);
  const inRow = Math.min(COLS, shown.length - row * COLS);
  // Centre each row, including a shorter last one.
  const x = (COLS - inRow) * CELL / 2 + (i % COLS) * CELL + (CELL - PX) / 2, y = row * CELL + (CELL - PX) / 2;
  return `<image x="${x}" y="${y}" width="${PX}" height="${PX}" href="data:image/png;base64,${png}"/>`;
}).join('');
fs.writeFileSync(path.join(out, '..', 'icons-preview.png'), new Resvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * CELL}" height="${rows * CELL}"><rect width="100%" height="100%" fill="#141c33"/>${tiles}</svg>`,
).render().asPng());

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

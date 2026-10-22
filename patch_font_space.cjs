// Sets the space glyph width of a GRUB .pf2 font so Ventoy's single-spaced hotkey line (L:Language F1:Help ...) has air between options.
// Usage: node patch_font_space.cjs <font.pf2> <space-width-px>
const fs = require('fs');

const [file, widthArg] = process.argv.slice(2);
const width = Number(widthArg);
if (!file || !Number.isFinite(width)) throw new Error('usage: node patch_font_space.cjs <font.pf2> <space-width-px>');

const buf = fs.readFileSync(file);
if (buf.toString('latin1', 0, 4) !== 'FILE') throw new Error('not a pf2 file');

let pos = 0, chix = null;
while (pos + 8 <= buf.length) {
  const name = buf.toString('latin1', pos, pos + 4);
  const len = buf.readUInt32BE(pos + 4);
  if (name === 'CHIX') chix = { start: pos + 8, len };
  if (name === 'DATA') break;
  pos += 8 + len;
}
if (!chix) throw new Error('CHIX section not found');

let patched = false;
for (let i = chix.start; i < chix.start + chix.len; i += 9) {
  if (buf.readUInt32BE(i) !== 0x20) continue;
  const glyph = buf.readUInt32BE(i + 5);
  const deviceWidthAt = glyph + 8; // width, height, x_ofs, y_ofs are 2 bytes each
  const before = buf.readInt16BE(deviceWidthAt);
  buf.writeInt16BE(width, deviceWidthAt);
  console.log(`${file}: space device width ${before} -> ${width}`);
  patched = true;
}
if (!patched) throw new Error('space glyph not found');
fs.writeFileSync(file, buf);

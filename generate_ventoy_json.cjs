// Usage: node generate_ventoy_json.cjs   (writes ventoy.example.json next to this file)
const fs = require('fs');
const path = require('path');
// Ventoy matches `key` as a case-sensitive substring of the ISO file name, first rule wins.
// [class, ...keys]; case variants are added automatically. Most specific rules first.
const rules = [
  ['easeus', 'EaseUS', 'Easeus'],
  ['macrium', 'Macrium'],
  ['acronis', 'Acronis'],
  ['winpe', 'Strelec', 'WinPE', 'WinRE', 'Hiren'],
  ['recovery', 'SystemRescue', 'Rescuezilla'],
  ['clonezilla', 'Clonezilla'],
  ['gparted', 'GParted'],
  ['memtest', 'Memtest', 'MemTest'],
  ['windows', 'Windows', 'Win10', 'Win11', 'Win_', 'Tiny10', 'Tiny11'],
  ['kubuntu', 'Kubuntu'],
  ['lubuntu', 'Lubuntu'],
  ['xubuntu', 'Xubuntu'],
  ['ubuntu', 'Ubuntu'],
  ['zorin', 'Zorin'],
  ['linuxmint', 'LinuxMint', 'Linux Mint', 'Mint-'],
  ['popos', 'Pop_OS', 'Pop!_OS', 'Pop-OS', 'pop-os'],
  ['elementary', 'elementary'],
  ['kdeneon', 'KDE neon', 'neon-'],
  ['deepin', 'deepin'],
  ['debian', 'Debian'],
  ['devuan', 'Devuan'],
  ['mxlinux', 'MX-', 'MX_'],
  ['kali', 'Kali'],
  ['parrot', 'Parrot'],
  ['tails', 'Tails', 'tails-'],
  ['qubes', 'Qubes'],
  ['fedora', 'Fedora'],
  ['nobara', 'Nobara'],
  ['centos', 'CentOS'],
  ['rocky', 'Rocky'],
  ['almalinux', 'AlmaLinux', 'Alma-'],
  ['redhat', 'RHEL', 'rhel', 'Red Hat'],
  ['opensuse', 'openSUSE', 'SUSE', 'Tumbleweed'],
  ['endeavouros', 'EndeavourOS'],
  ['manjaro', 'Manjaro'],
  ['garuda', 'Garuda'],
  ['artix', 'Artix'],
  ['cachyos', 'CachyOS'],
  ['archlinux', 'ArchLinux', 'Arch Linux', 'Arch-Linux'],
  ['nixos', 'NixOS'],
  ['gentoo', 'Gentoo'],
  ['slackware', 'Slackware'],
  ['alpine', 'Alpine'],
  ['void', 'Void Linux', 'Void-', 'void-live'],
  ['solus', 'Solus'],
  ['steamos', 'SteamOS'],
  ['android', 'Android', 'PrimeOS'],
  ['raspberrypi', 'Raspberry', 'RaspiOS', 'raspios'],
  ['freebsd', 'FreeBSD'],
  ['openbsd', 'OpenBSD', 'install7', 'miniroot'],
  ['netbsd', 'NetBSD'],
  ['truenas', 'TrueNAS'],
  ['proxmox', 'Proxmox', 'proxmox-ve'],
  ['unraid', 'Unraid'],
  ['pfsense', 'pfSense'],
  ['opnsense', 'OPNsense'],
  ['openwrt', 'OpenWrt'],
  ['esxi', 'ESXi', 'VMware-VMvisor'],
  ['reactos', 'ReactOS'],
  ['macos', 'macOS', 'MacOS', 'Mac OS', 'OS X', 'Sonoma', 'Sequoia', 'Tahoe'],
  ['linux', 'Linux'],
];

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const menu = [];
const seen = new Set();
for (const [cls, ...keys] of rules) {
  for (const k of keys) {
    for (const v of [k, k.toLowerCase(), cap(k.toLowerCase())]) {
      if (seen.has(v)) continue;
      seen.add(v);
      menu.push({ key: v, class: cls });
    }
  }
}

const cfg = {
  theme: {
    file: '/ventoy/themes/Ventoy-Liquid/theme.txt',
    gfxmode: 'max',
    ventoy_left: '3%',
    ventoy_top: '95%',
    ventoy_color: '#cfe0e6',
    fonts: [
      '/ventoy/themes/Ventoy-Liquid/fonts/Inter-Regular-22.pf2',
      '/ventoy/themes/Ventoy-Liquid/fonts/Inter-Medium-22.pf2',
      '/ventoy/themes/Ventoy-Liquid/fonts/Inter-Regular-16.pf2',
    ],
  },
  menu_class: menu,
};
// One rule per line keeps the file scannable and diff-friendly.
const lines = menu.map((m) => `        { "key": ${JSON.stringify(m.key)}, "class": ${JSON.stringify(m.class)} }`).join(',\n');
const head = JSON.stringify(cfg.theme, null, 4).split('\n').map((l, i) => (i ? '    ' + l : l)).join('\n');
fs.writeFileSync(process.argv[2] || path.join(__dirname, 'ventoy.example.json'), `{\n    "theme": ${head},\n    "menu_class": [\n${lines}\n    ]\n}\n`);
console.log(menu.length, 'rules');

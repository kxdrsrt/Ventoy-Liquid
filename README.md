# Ventoy-Liquid

A dark, frosted "liquid glass" theme for the [Ventoy](https://www.ventoy.net) boot menu, inspired by recent macOS.

![Preview](preview.jpg)

_The preview is a mock-up rendered on a Mac; real GRUB rendering may differ slightly._

![Icons](icons-preview.png)

## Features

- 1920x1080 neutral graphite glass wallpaper with a frosted menu panel
- Glass-tile icons for Windows, WinPE, macOS, Ubuntu, Zorin, Debian, Fedora, Arch, Mint, Kali, generic Linux, recovery tools and Ventoy's own folder/back/disc entries
- Rounded pill selection, styled GRUB terminal box, timeout countdown and mode labels
- Inter font (`.pf2`) for crisp menu text

## Install

1. Copy the `Ventoy-Liquid` folder to `ventoy/themes/` on your Ventoy USB drive.
2. Add this to `ventoy/ventoy.json` (create the file if it does not exist):

```json
{
    "theme": {
        "file": "/ventoy/themes/Ventoy-Liquid/theme.txt",
        "gfxmode": "max",
        "ventoy_color": "#cfe0e6",
        "fonts": [
            "/ventoy/themes/Ventoy-Liquid/fonts/Inter-Regular-22.pf2",
            "/ventoy/themes/Ventoy-Liquid/fonts/Inter-Medium-22.pf2",
            "/ventoy/themes/Ventoy-Liquid/fonts/Inter-Regular-16.pf2"
        ]
    },
    "menu_class": [
        { "key": "Windows", "class": "windows" },
        { "key": "WinPE", "class": "winpe" },
        { "key": "Ubuntu", "class": "ubuntu" },
        { "key": "Zorin", "class": "zorin" },
        { "key": "Debian", "class": "debian" },
        { "key": "Fedora", "class": "fedora" },
        { "key": "Arch", "class": "archlinux" },
        { "key": "Mint", "class": "linuxmint" },
        { "key": "Kali", "class": "kali" },
        { "key": "macOS", "class": "macos" }
    ]
}
```

`menu_class` matches part of an ISO file name to an icon; see Ventoy's [Menu Class plugin](https://www.ventoy.net/en/plugin_menuclass.html) for directory-based rules. The `fonts` list is required, Ventoy only loads fonts that are registered there.

## Rebuild the assets

- `generate_background.swift` (macOS): composites `source/wallpaper.jpg`, the glass panel and the title into `background.png`.
- `generate_icons.cjs` (Node): renders the icons, selection pill and terminal box. Needs `npm i simple-icons @resvg/resvg-js`.
- The `.pf2` fonts were made with `grub-mkfont` from the Inter static TTFs.

## Credits and licences

- Theme code and original artwork: MIT, see [LICENSE](LICENSE). The wallpaper was generated with AI.
- [Inter](https://rsms.me/inter/) font: SIL Open Font License 1.1, see `Ventoy-Liquid/fonts/Inter-LICENSE.txt`.
- Brand glyph paths: [Simple Icons](https://simpleicons.org) (CC0). The Windows glyph is hand-drawn.
- The Ventoy logo in the title is from the [Ventoy](https://github.com/ventoy/Ventoy) project (GPL-3.0).
- Operating system and company logos are trademarks of their respective owners and are used only to identify the matching boot entries. This project is not affiliated with or endorsed by any of them.

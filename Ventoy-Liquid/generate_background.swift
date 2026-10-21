// Usage: swiftc -O generate_background.swift -o /tmp/genbg && /tmp/genbg <theme-dir>
// Composites source/wallpaper.jpg with a frosted liquid-glass panel and title into background.png (1920x1080).
import AppKit
import CoreImage

let theme = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let W = 1920, H = 1080

guard let wallpaper = NSImage(contentsOf: theme.appendingPathComponent("source/wallpaper.jpg")),
      let wallCG = wallpaper.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fatalError("source/wallpaper.jpg missing")
}

let space = CGColorSpace(name: CGColorSpace.sRGB)!
guard let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: 0, space: space,
                          bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { fatalError("context") }

// Rect in top-left pixel coordinates.
func R(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat) -> CGRect {
    CGRect(x: x, y: CGFloat(H) - y - h, width: w, height: h)
}
func white(_ a: CGFloat) -> CGColor { CGColor(srgbRed: 1, green: 1, blue: 1, alpha: a) }
func black(_ a: CGFloat) -> CGColor { CGColor(srgbRed: 0, green: 0, blue: 0, alpha: a) }
func gradient(_ colors: [CGColor]) -> CGGradient {
    CGGradient(colorsSpace: space, colors: colors as CFArray, locations: nil)!
}

let full = CGRect(x: 0, y: 0, width: W, height: H)
ctx.draw(wallCG, in: full)

// Frosted copy of the wallpaper for the glass panel.
let ci = CIImage(cgImage: wallCG)
let blurred = ci.clampedToExtent()
    .applyingGaussianBlur(sigma: 46)
    .applyingFilter("CIColorControls", parameters: [kCIInputSaturationKey: 1.0, kCIInputBrightnessKey: 0.02, kCIInputContrastKey: 1.0])
    .cropped(to: ci.extent)
guard let frost = CIContext().createCGImage(blurred, from: ci.extent) else { fatalError("blur") }

// Panel is slightly larger than the boot_menu area in theme.txt (15%/25%/70%/58%).
let panel = R(248, 236, 1424, 700)
let radius: CGFloat = 46
func panelPath(_ rect: CGRect, _ r: CGFloat) -> CGPath {
    CGPath(roundedRect: rect, cornerWidth: r, cornerHeight: r, transform: nil)
}

// Soft drop shadow.
ctx.saveGState()
ctx.setShadow(offset: CGSize(width: 0, height: -18), blur: 60, color: black(0.45))
ctx.addPath(panelPath(panel, radius))
ctx.setFillColor(black(0.30))
ctx.fillPath()
ctx.restoreGState()

// Frosted body.
ctx.saveGState()
ctx.addPath(panelPath(panel, radius))
ctx.clip()
ctx.draw(frost, in: full)
// Dark tint keeps the small boot font legible on any wallpaper.
ctx.setFillColor(black(0.22))
ctx.fill(panel)
ctx.drawLinearGradient(gradient([black(0.0), black(0.18)]),
                       start: CGPoint(x: 0, y: panel.midY), end: CGPoint(x: 0, y: panel.minY), options: [])
// Vertical sheen: brighter at the top, fading downward.
ctx.drawLinearGradient(gradient([white(0.20), white(0.05), white(0.02)]),
                       start: CGPoint(x: 0, y: panel.maxY), end: CGPoint(x: 0, y: panel.minY), options: [])
// Specular glow in the upper left corner.
ctx.drawRadialGradient(gradient([white(0.22), white(0)]),
                       startCenter: CGPoint(x: panel.minX + 120, y: panel.maxY - 40), startRadius: 0,
                       endCenter: CGPoint(x: panel.minX + 120, y: panel.maxY - 40), endRadius: 520, options: [])
ctx.restoreGState()

// Rim light: bright at the top edge, faint at the bottom.
ctx.saveGState()
ctx.addPath(panelPath(panel.insetBy(dx: 0.75, dy: 0.75), radius))
ctx.setLineWidth(1.5)
ctx.replacePathWithStrokedPath()
ctx.clip()
ctx.drawLinearGradient(gradient([white(0.75), white(0.22), white(0.10), white(0.30)]),
                       start: CGPoint(x: 0, y: panel.maxY), end: CGPoint(x: 0, y: panel.minY), options: [])
ctx.restoreGState()

// Inner glow just inside the rim.
ctx.saveGState()
ctx.addPath(panelPath(panel.insetBy(dx: 3, dy: 3), radius - 3))
ctx.setLineWidth(1)
ctx.replacePathWithStrokedPath()
ctx.clip()
ctx.drawLinearGradient(gradient([white(0.28), white(0.0)]),
                       start: CGPoint(x: 0, y: panel.maxY), end: CGPoint(x: 0, y: panel.maxY - 160), options: [])
ctx.restoreGState()

// Darken the bottom edge slightly for the hotkey line.
ctx.drawLinearGradient(gradient([black(0.0), black(0.38)]),
                       start: CGPoint(x: 0, y: 150), end: CGPoint(x: 0, y: 0), options: [])

// Title and subtitle.
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
func drawCentered(_ text: String, size: CGFloat, weight: NSFont.Weight, kern: CGFloat, alpha: CGFloat, baselineTop: CGFloat) {
    let shadow = NSShadow()
    shadow.shadowColor = NSColor(white: 0, alpha: 0.45)
    shadow.shadowBlurRadius = 14
    shadow.shadowOffset = NSSize(width: 0, height: -3)
    let str = NSAttributedString(string: text, attributes: [
        .font: NSFont.systemFont(ofSize: size, weight: weight),
        .foregroundColor: NSColor(white: 1, alpha: alpha),
        .kern: kern,
        .shadow: shadow,
    ])
    let s = str.size()
    str.draw(at: CGPoint(x: (CGFloat(W) - s.width) / 2, y: CGFloat(H) - baselineTop - s.height))
}
drawCentered("BOOT MENU", size: 13, weight: .medium, kern: 5, alpha: 0.70, baselineTop: 152)

// Wordmark with the official Ventoy logo standing in for the "o".
let titleFont = NSFont.systemFont(ofSize: 66, weight: .semibold)
let titleShadow = NSShadow()
titleShadow.shadowColor = NSColor(white: 0, alpha: 0.45)
titleShadow.shadowBlurRadius = 14
titleShadow.shadowOffset = NSSize(width: 0, height: -3)
func word(_ t: String) -> NSAttributedString {
    NSAttributedString(string: t, attributes: [.font: titleFont, .foregroundColor: NSColor(white: 1, alpha: 0.98),
                                               .kern: 1.5, .shadow: titleShadow])
}
if let logo = NSImage(contentsOf: theme.appendingPathComponent("source/ventoy-logo.png")) {
    let leftWord = word("Vent"), rightWord = word("y")
    // The trimmed logo is the circle plus a glow below it; size by the circle (its width) and centre it on the x-height.
    let box = titleFont.xHeight * 1.22
    let logoHeight = box * logo.size.height / logo.size.width
    let gap: CGFloat = 1
    let total = leftWord.size().width + gap + box + gap + rightWord.size().width
    let startX = (CGFloat(W) - total) / 2
    let baseline = CGFloat(H) - 128
    leftWord.draw(at: CGPoint(x: startX, y: baseline + titleFont.descender))
    let logoX = startX + leftWord.size().width + gap
    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -3), blur: 12, color: black(0.45))
    logo.draw(in: CGRect(x: logoX, y: baseline + titleFont.xHeight / 2 - (logoHeight - box / 2), width: box, height: logoHeight))
    ctx.restoreGState()
    rightWord.draw(at: CGPoint(x: logoX + box + gap, y: baseline + titleFont.descender))
}
NSGraphicsContext.restoreGraphicsState()

let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
try rep.representation(using: .png, properties: [:])!.write(to: theme.appendingPathComponent("background.png"))
print("background.png \(W)x\(H)")

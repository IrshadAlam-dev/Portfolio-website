import AppKit

let width = 1200
let height = 630
let output = CommandLine.arguments.dropFirst().first ?? "images/social-preview.png"

guard let bitmap = NSBitmapImageRep(
    bitmapDataPlanes: nil,
    pixelsWide: width,
    pixelsHigh: height,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .deviceRGB,
    bytesPerRow: 0,
    bitsPerPixel: 0
), let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
    fatalError("Could not create preview canvas")
}

NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context
context.imageInterpolation = .high

let background = NSRect(x: 0, y: 0, width: width, height: height)
NSColor(calibratedRed: 12/255, green: 16/255, blue: 23/255, alpha: 1).setFill()
background.fill()

let glow = NSBezierPath(ovalIn: NSRect(x: 780, y: 185, width: 640, height: 640))
NSColor(calibratedRed: 229/255, green: 55/255, blue: 112/255, alpha: 0.11).setFill()
glow.fill()

let frame = NSBezierPath(roundedRect: NSRect(x: 48, y: 48, width: 1104, height: 534), xRadius: 24, yRadius: 24)
NSColor(calibratedRed: 53/255, green: 64/255, blue: 79/255, alpha: 1).setStroke()
frame.lineWidth = 2
frame.stroke()

func draw(_ text: String, at point: NSPoint, size: CGFloat, weight: NSFont.Weight, color: NSColor, spacing: CGFloat = 0) {
    let font = NSFont.systemFont(ofSize: size, weight: weight)
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: color,
        .kern: spacing
    ]
    (text as NSString).draw(at: point, withAttributes: attributes)
}

let white = NSColor(calibratedRed: 245/255, green: 246/255, blue: 250/255, alpha: 1)
let muted = NSColor(calibratedRed: 185/255, green: 193/255, blue: 207/255, alpha: 1)
let accent = NSColor(calibratedRed: 255/255, green: 95/255, blue: 143/255, alpha: 1)

draw("IA", at: NSPoint(x: 91, y: 490), size: 42, weight: .heavy, color: white, spacing: -2)
draw(".", at: NSPoint(x: 139, y: 490), size: 42, weight: .heavy, color: accent)
draw("Irshad Alam", at: NSPoint(x: 91, y: 316), size: 86, weight: .bold, color: white, spacing: -3)
draw("FULL-STACK DEVELOPER", at: NSPoint(x: 96, y: 263), size: 26, weight: .bold, color: accent, spacing: 4)
draw("Web applications  ·  AI tools  ·  practical software", at: NSPoint(x: 96, y: 181), size: 29, weight: .medium, color: muted)

let divider = NSRect(x: 96, y: 141, width: 1008, height: 2)
NSColor(calibratedRed: 53/255, green: 64/255, blue: 79/255, alpha: 1).setFill()
divider.fill()
draw("irshadalam-dev.github.io/Portfolio-website", at: NSPoint(x: 96, y: 93), size: 21, weight: .medium, color: muted)

context.flushGraphics()
NSGraphicsContext.restoreGraphicsState()

guard let png = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("Could not encode preview PNG")
}
try png.write(to: URL(fileURLWithPath: output))

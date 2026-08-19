from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader
from PIL import Image


ROOT = Path(r"D:\Andrew Portfolio Assets\Portfolio")
ASSETS = ROOT / "assets"
OUT = ROOT / "output" / "pdf" / "Andrew-Wolverton-Website-Brand-Kit.pdf"
FONTS = ROOT / "tmp" / "pdfs" / "fonts"

W, H = 792, 612  # US Letter landscape

DEEP = HexColor("#0D2F28")
DEEP_2 = HexColor("#153F35")
DEEP_3 = HexColor("#071B17")
INK = HexColor("#173F35")
PAPER = HexColor("#F5EFE4")
PAPER_2 = HexColor("#EBE3D5")
WHITE = HexColor("#FFFDF8")
AQUA = HexColor("#63DDD1")
TEAL = HexColor("#1F766D")
PURPLE = HexColor("#8B5AB1")
PINK = HexColor("#FFC8F7")
BRASS = HexColor("#C69B48")
ORANGE = HexColor("#EF7C5A")
MUTED = HexColor("#61736D")


def register_fonts():
    pdfmetrics.registerFont(TTFont("Barlow-Bold", str(FONTS / "BarlowCondensed-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Barlow-Semi", str(FONTS / "BarlowCondensed-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Plex", str(FONTS / "IBMPlexSans-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Plex-Semi", str(FONTS / "IBMPlexSans-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("DMSerif", str(FONTS / "DMSerifDisplay-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", r"C:\Windows\Fonts\georgiab.ttf"))


def lines_for(text, font, size, width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = word if not current else current + " " + word
        if pdfmetrics.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(c, text, x, y_top, width, font="Plex", size=10, leading=15,
              color=INK, max_lines=None):
    c.setFont(font, size)
    c.setFillColor(color)
    y = y_top
    lines = []
    for raw in text.split("\n"):
        if raw == "":
            lines.append("")
        else:
            lines.extend(lines_for(raw, font, size, width))
    if max_lines:
        lines = lines[:max_lines]
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def label(c, text, x, y, color=TEAL):
    c.setFillColor(color)
    c.setFont("Barlow-Bold", 10)
    c.drawString(x, y, text.upper())


def title(c, text, x, y, width, size=46, color=INK, font="Barlow-Bold", leading=None):
    leading = leading or size * 0.92
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines_for(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def round_clip(c, x, y, w, h, radius):
    path = c.beginPath()
    path.roundRect(x, y, w, h, radius)
    c.clipPath(path, stroke=0, fill=0)


def image_cover(c, path, x, y, w, h, radius=0, anchor_x=0.5, anchor_y=0.5):
    path = Path(path)
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x - (dw - w) * anchor_x
    dy = y - (dh - h) * anchor_y
    c.saveState()
    if radius:
        round_clip(c, x, y, w, h, radius)
    c.drawImage(ImageReader(str(path)), dx, dy, dw, dh, mask="auto")
    c.restoreState()


def image_contain(c, path, x, y, w, h):
    path = Path(path)
    with Image.open(path) as im:
        iw, ih = im.size
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(ImageReader(str(path)), x + (w - dw) / 2, y + (h - dh) / 2,
                dw, dh, mask="auto")


def draw_aw_mark(c, x, y, size):
    """Vector reconstruction of assets/favicon.svg for crisp print use."""
    scale = size / 64.0
    c.saveState()
    c.setFillColor(HexColor("#10251F"))
    c.setStrokeColor(HexColor("#CAA95D"))
    c.setLineWidth(2 * scale)
    c.roundRect(x + 2 * scale, y + 2 * scale, 60 * scale, 60 * scale,
                13 * scale, stroke=1, fill=1)
    c.setFillColor(HexColor("#F5EDDF"))
    c.setFont("Georgia-Bold", 23 * scale)
    c.drawCentredString(x + 32 * scale, y + 25 * scale, "AW")
    c.setFillColor(HexColor("#CAA95D"))
    c.roundRect(x + 17 * scale, y + 15.5 * scale, 30 * scale, 2.5 * scale,
                1.25 * scale, stroke=0, fill=1)
    c.setFillColor(HexColor("#B32118"))
    c.circle(x + 52 * scale, y + 50 * scale, 3.5 * scale, stroke=0, fill=1)
    c.restoreState()


def footer(c, number, dark=False):
    color = Color(1, 1, 1, 0.55) if dark else Color(0.09, 0.25, 0.21, 0.52)
    c.setFillColor(color)
    c.setFont("Plex-Semi", 7.5)
    c.drawString(42, 24, "ANDREW WOLVERTON / WEBSITE BRAND KIT")
    c.drawRightString(W - 42, 24, f"{number:02d}")


def pill(c, text, x, y, bg, fg=DEEP_3, pad=10):
    size = 8.5
    tw = pdfmetrics.stringWidth(text, "Plex-Semi", size)
    w = tw + 2 * pad
    c.setFillColor(bg)
    c.roundRect(x, y, w, 24, 12, stroke=0, fill=1)
    c.setFillColor(fg)
    c.setFont("Plex-Semi", size)
    c.drawString(x + pad, y + 8, text)
    return w


def bullet(c, text, x, y, width, color=INK):
    c.setFillColor(AQUA)
    c.circle(x + 3, y + 3, 3, stroke=0, fill=1)
    return paragraph(c, text, x + 14, y + 8, width - 14, "Plex", 9.5, 14, color)


def page_cover(c):
    c.setFillColor(DEEP)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(DEEP_2)
    c.circle(700, 520, 190, stroke=0, fill=1)
    c.setFillColor(Color(0.39, 0.87, 0.82, 0.10))
    c.circle(635, 120, 120, stroke=0, fill=1)

    c.setFillColor(PAPER)
    c.roundRect(45, H - 109, 70, 70, 16, stroke=0, fill=1)
    draw_aw_mark(c, 48, H - 106, 64)
    label(c, "Brand system / 2026", 48, H - 132, AQUA)
    y = title(c, "Andrew Wolverton", 48, H - 186, 390, 55, WHITE)
    y = title(c, "Website Brand Kit", 48, y - 4, 390, 55, AQUA)
    paragraph(c, "A practical identity for creative rescue, fieldwork, media, music, and the complicated thing without a job title.",
              50, y - 26, 340, "Plex", 12, 18, WHITE)
    c.setStrokeColor(BRASS)
    c.setLineWidth(3)
    c.line(50, 104, 102, 104)
    paragraph(c, "awolverton.com", 50, 86, 230, "Plex-Semi", 10, 14, AQUA)

    image_contain(c, ASSETS / "andrew-home-still-transparent.png", 455, 62, 260, 495)
    image_contain(c, ASSETS / "doon-idle.gif", 650, 54, 92, 92)
    footer(c, 1, dark=True)
    c.showPage()


def page_point_of_view(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "01 / Brand core", 46, H - 54)
    title(c, "A creative problem-solver with a working studio.", 46, H - 94, 520, 47)

    c.setFillColor(DEEP)
    c.roundRect(46, 278, 700, 145, 24, stroke=0, fill=1)
    c.setFillColor(AQUA)
    c.setFont("DMSerif", 27)
    c.drawString(72, 370, "Bring me the thing that isn't working.")
    paragraph(c, "Andrew diagnoses what a messy project actually needs, then uses the right mix of strategy, making, leadership, and fieldwork to build the fix.",
              74, 333, 610, "Plex", 11, 17, WHITE)

    columns = [
        ("RESOURCEFUL", "Comfortable entering ambiguity and finding the usable next move."),
        ("THEATRICAL", "Rhythm, personality, and audience awareness are part of the work."),
        ("PRACTICAL", "Ideas become systems, assets, decisions, and something people can use."),
    ]
    x = 46
    for head, body in columns:
        c.setFillColor(WHITE)
        c.roundRect(x, 98, 220, 145, 18, stroke=0, fill=1)
        label(c, head, x + 18, 212)
        paragraph(c, body, x + 18, 182, 180, "Plex", 10, 15, INK)
        x += 240

    pill(c, "Creative Rescue", 46, 57, AQUA)
    pill(c, "Build With Andrew", 164, 57, PAPER_2, INK)
    pill(c, "NYC Field Unit", 304, 57, PAPER_2, INK)
    footer(c, 2)
    c.showPage()


def page_logo(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "02 / Identity", 46, H - 54)
    title(c, "The monogram is the anchor.", 46, H - 92, 480, 45)
    paragraph(c, "Use the AW mark as a confident signature, not as decoration repeated everywhere.",
              48, H - 150, 460, "Plex", 10.5, 16, INK)

    # Light-ground logo tile
    c.setFillColor(PAPER)
    c.roundRect(46, 220, 315, 220, 24, stroke=0, fill=1)
    draw_aw_mark(c, 128, 270, 150)
    label(c, "Primary mark / warm paper", 68, 244)

    # Dark-ground logo tile
    c.setFillColor(DEEP)
    c.roundRect(383, 220, 363, 220, 24, stroke=0, fill=1)
    draw_aw_mark(c, 490, 270, 150)
    label(c, "Primary mark / deep green", 406, 244, AQUA)

    c.setFillColor(PAPER)
    c.roundRect(46, 58, 700, 138, 20, stroke=0, fill=1)
    label(c, "Usage rules", 66, 166)
    bullet(c, "Keep clear space around the mark equal to the height of the gold underline.", 66, 134, 310)
    bullet(c, "Minimum digital size: 40 px. Minimum print size: 0.5 in.", 66, 96, 310)
    bullet(c, "Do not recolor, stretch, rotate, add effects, or place it over busy imagery.", 408, 134, 300)
    bullet(c, "Pair it with the name only when identification is not already clear.", 408, 96, 300)
    footer(c, 3)
    c.showPage()


def swatch(c, x, y, w, h, color, name, value, light_text=False):
    c.setFillColor(color)
    c.roundRect(x, y, w, h, 16, stroke=0, fill=1)
    fg = WHITE if light_text else DEEP_3
    c.setFillColor(fg)
    c.setFont("Barlow-Bold", 14)
    c.drawString(x + 14, y + 31, name)
    c.setFont("Plex-Semi", 8)
    c.drawString(x + 14, y + 15, value)


def page_color(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "03 / Color", 46, H - 54)
    title(c, "Warm paper. Deep green. Electric clarity.", 46, H - 92, 660, 44)
    paragraph(c, "The core palette feels grounded and editorial. Aqua supplies energy and direction. Supporting colors belong in small moments.",
              48, H - 148, 660, "Plex", 10.5, 16, INK)

    swatch(c, 46, 310, 133, 130, DEEP, "Deep green", "#0D2F28", True)
    swatch(c, 188, 310, 133, 130, INK, "Ink", "#173F35", True)
    swatch(c, 330, 310, 133, 130, PAPER, "Paper", "#F5EFE4")
    c.setStrokeColor(Color(0.09, 0.25, 0.21, 0.16))
    c.roundRect(330, 310, 133, 130, 16, stroke=1, fill=0)
    swatch(c, 472, 310, 133, 130, WHITE, "Warm white", "#FFFDF8")
    c.setStrokeColor(Color(0.09, 0.25, 0.21, 0.16))
    c.roundRect(472, 310, 133, 130, 16, stroke=1, fill=0)
    swatch(c, 614, 310, 132, 130, AQUA, "Aqua", "#63DDD1")

    label(c, "Readable teal", 46, 272)
    c.setFillColor(TEAL)
    c.roundRect(46, 184, 274, 72, 16, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Barlow-Bold", 18)
    c.drawString(64, 218, "SECTION LABELS / #1F766D")
    c.setFont("Plex", 8.5)
    c.drawString(64, 200, "Use on paper when aqua is too light for small text.")

    label(c, "Supporting accents", 352, 272)
    accents = [(PURPLE, "Purple"), (PINK, "Pink"), (BRASS, "Brass"), (ORANGE, "Orange")]
    ax = 352
    for color, name in accents:
        c.setFillColor(color)
        c.roundRect(ax, 205, 86, 51, 12, stroke=0, fill=1)
        c.setFillColor(DEEP_3)
        c.setFont("Plex-Semi", 7.5)
        c.drawCentredString(ax + 43, 188, name)
        ax += 98

    c.setFillColor(WHITE)
    c.roundRect(46, 66, 700, 86, 16, stroke=0, fill=1)
    label(c, "Contrast rule", 64, 126)
    paragraph(c, "Use deep green or ink for body copy on light backgrounds. Use warm white on deep green. Reserve aqua for buttons, focus states, short labels, and directional emphasis.",
              64, 104, 644, "Plex", 9.5, 14, INK)
    footer(c, 4)
    c.showPage()


def page_type(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "04 / Typography", 46, H - 54)
    title(c, "A voice with range.", 46, H - 92, 500, 46)

    c.setFillColor(DEEP)
    c.roundRect(46, 306, 700, 169, 24, stroke=0, fill=1)
    label(c, "Barlow Condensed / Bold", 68, 446, AQUA)
    c.setFillColor(WHITE)
    c.setFont("Barlow-Bold", 42)
    c.drawString(68, 390, "MAKE THE PROBLEM CLEAR.")
    paragraph(c, "Headlines, navigation, buttons, section numbers, and compact moments with personality.",
              70, 352, 580, "Plex", 9.5, 14, WHITE)

    c.setFillColor(PAPER)
    c.roundRect(46, 120, 339, 160, 20, stroke=0, fill=1)
    label(c, "IBM Plex Sans", 66, 250)
    paragraph(c, "Clear enough for systems. Human enough for stories.", 66, 217, 280, "Plex-Semi", 16, 21, INK)
    paragraph(c, "Use for body copy, explanations, labels, forms, captions, and interface text. Default body size: 16 px on the web and 10-11 pt in print.",
              66, 169, 280, "Plex", 9.5, 14, INK)

    c.setFillColor(PAPER_2)
    c.roundRect(407, 120, 339, 160, 20, stroke=0, fill=1)
    label(c, "DM Serif Display", 427, 250)
    c.setFillColor(INK)
    c.setFont("DMSerif", 24)
    c.drawString(427, 210, "An editorial pause.")
    paragraph(c, "Use sparingly for quotations, reflective statements, and crafted story moments. It should feel intentional, not ornamental.",
              427, 169, 280, "Plex", 9.5, 14, INK)

    paragraph(c, "Hierarchy: 16 px minimum for small section labels. Keep body copy comfortable. Let headlines be large, compact, and short enough to breathe.",
              48, 88, 680, "Plex-Semi", 9.5, 14, TEAL)
    footer(c, 5)
    c.showPage()


def page_layout(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "05 / Layout and interface", 46, H - 54)
    title(c, "Editorial structure, studio energy.", 46, H - 92, 600, 44)
    paragraph(c, "Space should create rhythm and focus. It should never make the page feel unfinished or separate supporting copy from the idea it explains.",
              48, H - 148, 650, "Plex", 10.5, 16, INK)

    # Desktop section diagram
    c.setFillColor(WHITE)
    c.roundRect(46, 242, 450, 204, 20, stroke=0, fill=1)
    label(c, "Desktop section rhythm", 66, 418)
    c.setFillColor(TEAL)
    c.rect(66, 388, 100, 6, stroke=0, fill=1)
    c.setFillColor(INK)
    c.roundRect(66, 310, 180, 62, 8, stroke=0, fill=1)
    c.setFillColor(PAPER_2)
    c.roundRect(270, 310, 196, 62, 8, stroke=0, fill=1)
    c.setStrokeColor(Color(0.09, 0.25, 0.21, 0.18))
    for i in range(3):
        c.roundRect(66 + i * 134, 268, 116, 24, 12, stroke=1, fill=0)
    paragraph(c, "Headline on the left. Explanation and proof on the right. Content controls begin below both.",
              66, 246, 400, "Plex", 8.5, 12, MUTED)

    # Adaptive navigation diagram
    c.setFillColor(DEEP)
    c.roundRect(518, 242, 228, 204, 20, stroke=0, fill=1)
    label(c, "Adaptive navigation", 538, 418, AQUA)
    c.setFillColor(WHITE)
    for i in range(3):
        c.roundRect(538, 366 - i * 34, 188, 25, 8, stroke=0, fill=1)
        c.setFillColor(AQUA if i == 1 else DEEP_2)
        c.rect(538, 366 - i * 34, 5, 25, stroke=0, fill=1)
        c.setFillColor(WHITE)
    paragraph(c, "Vertical chapter guide on wide screens. A compact disclosure and previous/next links when space is tight.",
              538, 270, 184, "Plex", 8.5, 12, WHITE)

    image_cover(c, ASSETS / "desk-scene.jpg", 46, 54, 700, 160, 20, anchor_y=0.56)
    c.setFillColor(Color(0.03, 0.11, 0.09, 0.68))
    c.roundRect(64, 72, 300, 66, 16, stroke=0, fill=1)
    label(c, "The desk principle", 82, 116, AQUA)
    paragraph(c, "Playful and specific, but every object has a job.", 82, 94, 250, "Plex", 9.5, 14, WHITE)
    footer(c, 6)
    c.showPage()


def page_image_world(c):
    c.setFillColor(DEEP)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "06 / Image world", 46, H - 54, AQUA)
    title(c, "Real rooms, expressive proof, one strange little friend.", 46, H - 92, 670, 43, WHITE)
    paragraph(c, "Use imagery that feels lived-in and active. Andrew should appear approachable and capable. Doon adds warmth, surprise, and continuity.",
              48, H - 146, 660, "Plex", 10.5, 16, WHITE)

    image_cover(c, ASSETS / "Headshot Option 2.jpg", 46, 190, 214, 260, 20, anchor_y=0.35)
    c.setFillColor(WHITE)
    c.roundRect(289, 190, 214, 260, 20, stroke=0, fill=1)
    image_contain(c, ASSETS / "Andrew-doon.PNG", 301, 200, 190, 240)
    image_cover(c, ASSETS / "about me gallery" / "Performance Blurry.jpg", 532, 190, 214, 260, 20, anchor_y=0.45)

    label(c, "Portrait", 46, 164, AQUA)
    paragraph(c, "Warm, direct, uncluttered.", 46, 146, 200, "Plex", 8.5, 12, WHITE)
    label(c, "Character system", 289, 164, AQUA)
    paragraph(c, "Personality without replacing credibility.", 289, 146, 210, "Plex", 8.5, 12, WHITE)
    label(c, "Performance", 532, 164, AQUA)
    paragraph(c, "Movement, audience, and evidence of practice.", 532, 146, 214, "Plex", 8.5, 12, WHITE)

    c.setStrokeColor(AQUA)
    c.setLineWidth(1)
    c.line(46, 105, 746, 105)
    paragraph(c, "Avoid generic stock-office imagery, stiff corporate portraits, decorative technology, and playful assets that cover essential information.",
              48, 86, 680, "Plex-Semi", 9.5, 14, AQUA)
    footer(c, 7, dark=True)
    c.showPage()


def page_applications(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    label(c, "07 / Application", 46, H - 54)
    title(c, "The system holds different kinds of work.", 46, H - 92, 620, 43)
    paragraph(c, "Project identities may have their own colors and voices. Andrew's brand supplies the framing: diagnosis, clarity, proof, and a recognizable way through.",
              48, H - 146, 660, "Plex", 10.5, 16, INK)

    cards = [
        (ASSETS / "Porch Stomp Screenshot.png", "DIGITAL FIXES", "Web strategy and visitor paths"),
        (ASSETS / "DSG Social Share.jpg", "ORGANIZATION BUILDING", "Mission, programs, systems, and audience"),
        (ASSETS / "Studio Keys Screenshot.png", "PLAYFUL PROOF", "Music, interaction, and technical making"),
    ]
    x = 46
    for path, head, body in cards:
        c.setFillColor(PAPER)
        c.roundRect(x, 176, 220, 260, 18, stroke=0, fill=1)
        image_cover(c, path, x + 10, 282, 200, 144, 12)
        label(c, head, x + 16, 252)
        paragraph(c, body, x + 16, 226, 186, "Plex", 9, 13, INK)
        x += 240

    c.setFillColor(DEEP)
    c.roundRect(46, 62, 700, 96, 18, stroke=0, fill=1)
    label(c, "Before anything goes out", 66, 130, AQUA)
    checks = ["Problem first", "Readable at a glance", "Proof is specific", "Play never blocks use"]
    x = 66
    for check in checks:
        c.setStrokeColor(AQUA)
        c.setLineWidth(1.4)
        c.circle(x + 6, 92, 6, stroke=1, fill=0)
        c.setFillColor(WHITE)
        c.setFont("Plex-Semi", 8.5)
        c.drawString(x + 20, 89, check)
        x += 165
    footer(c, 8)
    c.showPage()


def build():
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Andrew Wolverton Website Brand Kit")
    c.setAuthor("Andrew Wolverton")
    c.setSubject("Website identity, color, typography, layout, imagery, and usage guidelines")
    page_cover(c)
    page_point_of_view(c)
    page_logo(c)
    page_color(c)
    page_type(c)
    page_layout(c)
    page_image_world(c)
    page_applications(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()

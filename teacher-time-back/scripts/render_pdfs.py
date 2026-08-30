from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image, ImageOps, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
PDF_DIR = ROOT / "teacher-time-back" / "output" / "pdf"
OUT_DIR = ROOT / "teacher-time-back" / "tmp" / "pdf-renders"
OUT_DIR.mkdir(parents=True, exist_ok=True)

for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
    target = OUT_DIR / pdf_path.stem
    target.mkdir(parents=True, exist_ok=True)
    for stale in target.glob("page-*.png"):
        stale.unlink()
    document = pdfium.PdfDocument(str(pdf_path))
    for index in range(len(document)):
        bitmap = document[index].render(scale=1.7)
        image = bitmap.to_pil()
        image.save(target / f"page-{index + 1:02d}.png")
    thumbs = []
    for image_path in sorted(target.glob("page-*.png")):
        source = Image.open(image_path).convert("RGB")
        source.thumbnail((510, 660))
        tile = Image.new("RGB", (530, 700), "#d8ddd9")
        tile.paste(source, ((530 - source.width) // 2, 20))
        draw = ImageDraw.Draw(tile)
        draw.text((20, 674), image_path.stem, fill="#123f37")
        thumbs.append(tile)
    columns = 2
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 530, rows * 700), "#aeb9b4")
    for i, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((i % columns) * 530, (i // columns) * 700))
    sheet.save(OUT_DIR / f"{pdf_path.stem}-contact-sheet.jpg", quality=88)
    print(f"{pdf_path.name}: {len(document)} pages")

from __future__ import annotations

import sys
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw


def main() -> None:
    pdf_path = Path(sys.argv[1]).resolve()
    output_dir = Path(sys.argv[2]).resolve()
    pages_dir = output_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    for stale in pages_dir.glob("page-*.png"):
        stale.unlink()
    for stale in output_dir.glob("contact-sheet-*.jpg"):
        stale.unlink()

    document = pdfium.PdfDocument(str(pdf_path))
    rendered: list[Path] = []
    for index in range(len(document)):
        image = document[index].render(scale=1.8).to_pil().convert("RGB")
        page_path = pages_dir / f"page-{index + 1:02d}.png"
        image.save(page_path)
        rendered.append(page_path)

    pages_per_sheet = 4
    for sheet_index in range(0, len(rendered), pages_per_sheet):
        sheet_pages = rendered[sheet_index : sheet_index + pages_per_sheet]
        tiles: list[Image.Image] = []
        for page_path in sheet_pages:
            source = Image.open(page_path).convert("RGB")
            source.thumbnail((900, 1165))
            tile = Image.new("RGB", (940, 1225), "#d8ddd9")
            tile.paste(source, ((940 - source.width) // 2, 20))
            draw = ImageDraw.Draw(tile)
            draw.text((20, 1190), page_path.stem, fill="#123f37")
            tiles.append(tile)

        sheet = Image.new("RGB", (1880, 2450), "#aeb9b4")
        for index, tile in enumerate(tiles):
            sheet.paste(tile, ((index % 2) * 940, (index // 2) * 1225))
        number = sheet_index // pages_per_sheet + 1
        sheet.save(output_dir / f"contact-sheet-{number:02d}.jpg", quality=92)

    print(f"Rendered {len(document)} pages to {output_dir}")


if __name__ == "__main__":
    main()

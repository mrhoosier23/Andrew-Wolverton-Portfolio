from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from zipfile import BadZipFile, ZipFile


REPO = Path(__file__).resolve().parents[2]
ROOT = REPO / "teacher-time-back"
HTML_FILES = [REPO / "ai-schools.html"]
EXPECTED_PDFS = {
    "Leadership-Readiness-Guide.pdf": 2,
    "Platform-Setup-Record.pdf": 2,
    "Safety-and-Review-Card.pdf": 1,
    "Teacher-Preparation-Sheet.pdf": 1,
    "Teacher-Time-Back-Lab-Facilitator-Playbook.pdf": 10,
    "Teacher-Time-Back-Lab-Pilot-Overview.pdf": 1,
    "Teacher-Workbook.pdf": 7,
    "Weekly-Lesson-Setup-Practice-Pack.pdf": 4,
}
EXPECTED_DOCX = {
    "Leadership-Readiness-Guide.docx",
    "Platform-Setup-Record.docx",
    "Teacher-Time-Back-Lab-Facilitator-Playbook.docx",
    "Teacher-Workbook.docx",
}
OBSOLETE_PUBLIC_FILES = {
    "resource-hub.html", "resources.css", "setup-kit.html", "SETUP-KIT.md",
    "time-back-finder.html", "time-back-finder.js",
}


class AuditParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.links: list[str] = []
        self.sources: list[str] = []
        self.images: list[dict[str, str | None]] = []
        self.buttons: list[dict[str, str | None]] = []
        self.headings: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if data.get("id"):
            self.ids.append(str(data["id"]))
        if tag == "a" and data.get("href"):
            self.links.append(str(data["href"]))
        if tag in {"img", "script", "link", "source", "video"}:
            for key in ("src", "href", "poster"):
                if data.get(key):
                    self.sources.append(str(data[key]))
        if tag == "img":
            self.images.append(data)
        if tag == "button":
            self.buttons.append(data)
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.headings.append(tag)


def local_target(html_path: Path, value: str) -> Path | None:
    if value.startswith(("http://", "https://", "mailto:", "tel:", "data:", "#", "javascript:")):
        return None
    clean = value.split("#", 1)[0].split("?", 1)[0]
    return (html_path.parent / clean).resolve() if clean else None


errors: list[str] = []

for obsolete in OBSOLETE_PUBLIC_FILES:
    if (ROOT / obsolete).exists():
        errors.append(f"Obsolete public prototype remains: {obsolete}")

for html_path in HTML_FILES:
    text = html_path.read_text(encoding="utf-8")
    parser = AuditParser()
    parser.feed(text)
    duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    if duplicates:
        errors.append(f"{html_path.name}: duplicate IDs {duplicates}")
    if parser.headings.count("h1") != 1:
        errors.append(f"{html_path.name}: expected one h1, found {parser.headings.count('h1')}")
    for value in parser.links + parser.sources:
        target = local_target(html_path, value)
        if target is not None and not target.exists():
            errors.append(f"{html_path.name}: missing local target {value}")
    for image in parser.images:
        if "alt" not in image:
            errors.append(f"{html_path.name}: image without alt at {image.get('src')}")
    for button in parser.buttons:
        if button.get("type") is None:
            errors.append(f"{html_path.name}: button without explicit type")
    if "—" in text:
        errors.append(f"{html_path.name}: em dash found in public copy")
    for old_phrase in ("Reuse Planner", "Harbor City", "teacher-owned", "student-neutral", "approved environment"):
        if old_phrase.lower() in text.lower():
            errors.append(f"{html_path.name}: rejected wording remains: {old_phrase}")

css = (REPO / "ai-schools.css").read_text(encoding="utf-8")
js = (REPO / "ai-schools-page.js").read_text(encoding="utf-8")
for marker in ("[hidden]", ".mobile-menu:not([hidden])", "prefers-reduced-motion"):
    if marker not in css:
        errors.append(f"ai-schools.css: missing required behavior marker {marker}")
for marker in ("artifactData", "labData", "quizQuestions", "burstNotes"):
    if marker not in js:
        errors.append(f"ai-schools-page.js: missing interaction {marker}")

try:
    from pypdf import PdfReader
except ImportError as exc:
    errors.append(f"pypdf is required for PDF checks: {exc}")
else:
    pdf_dir = ROOT / "output" / "pdf"
    actual = {path.name for path in pdf_dir.glob("*.pdf")}
    if actual != set(EXPECTED_PDFS):
        errors.append(f"PDF set mismatch. Expected {sorted(EXPECTED_PDFS)}, found {sorted(actual)}")
    for filename, expected_pages in EXPECTED_PDFS.items():
        path = pdf_dir / filename
        if not path.exists():
            continue
        reader = PdfReader(str(path))
        if len(reader.pages) != expected_pages:
            errors.append(f"{filename}: expected {expected_pages} pages, found {len(reader.pages)}")
        for index, page in enumerate(reader.pages, 1):
            extracted = (page.extract_text() or "").strip()
            if len(extracted) < 40:
                errors.append(f"{filename}: page {index} appears empty")
            if re.search(r"teacher-owned|student-neutral|approved environment|reuse planner|harbor city", extracted, re.I):
                errors.append(f"{filename}: rejected wording found on page {index}")

docx_dir = ROOT / "output" / "docx"
for filename in EXPECTED_DOCX:
    path = docx_dir / filename
    if not path.exists() or path.stat().st_size == 0:
        errors.append(f"Missing editable document: {filename}")
        continue
    try:
        with ZipFile(path) as archive:
            if "word/document.xml" not in archive.namelist():
                errors.append(f"Invalid DOCX structure: {filename}")
    except BadZipFile:
        errors.append(f"Corrupt DOCX: {filename}")

for required in (ROOT / "teacher-time-back-skill.zip", ROOT / "teacher-time-back-agent.zip", ROOT / "teacher-time-back-complete-toolkit.zip"):
    if not required.exists() or required.stat().st_size == 0:
        errors.append(f"Missing package: {required.name}")

complete_zip = ROOT / "teacher-time-back-complete-toolkit.zip"
if complete_zip.exists():
    with ZipFile(complete_zip) as archive:
        archived = set(archive.namelist())
    expected = {
        "Teacher-Time-Back-Lab/ai-schools.html",
        "Teacher-Time-Back-Lab/ai-schools.css",
        "Teacher-Time-Back-Lab/ai-schools-page.js",
        "Teacher-Time-Back-Lab/teacher-time-back/flagship-demo/assets/05-before-after.webp",
        "Teacher-Time-Back-Lab/teacher-time-back/output/pdf/Teacher-Time-Back-Lab-Pilot-Overview.pdf",
        "Teacher-Time-Back-Lab/teacher-time-back/output/docx/Teacher-Time-Back-Lab-Facilitator-Playbook.docx",
        "Teacher-Time-Back-Lab/teacher-time-back/public-agent/AGENT.md",
        "Teacher-Time-Back-Lab/teacher-time-back/public-skill/teacher-time-back/SKILL.md",
        "Teacher-Time-Back-Lab/teacher-time-back/USABILITY-TEST-KIT.md",
    }
    missing = sorted(expected - archived)
    if missing:
        errors.append(f"Complete toolkit ZIP is missing {missing}")
    obsolete_in_zip = [name for name in archived if Path(name).name in OBSOLETE_PUBLIC_FILES]
    if obsolete_in_zip:
        errors.append(f"Complete toolkit ZIP contains obsolete prototypes: {obsolete_in_zip}")
    if any("/work/" in name or "/tmp/" in name for name in archived):
        errors.append("Complete toolkit ZIP contains QA work files")

if errors:
    print("QA FAILED")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print("QA PASSED")
print(f"Audited {len(HTML_FILES)} public page, {len(EXPECTED_PDFS)} PDFs, {len(EXPECTED_DOCX)} editable documents, and 3 ZIP packages.")

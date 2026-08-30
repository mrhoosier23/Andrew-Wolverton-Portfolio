from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from zipfile import ZipFile


REPO = Path(__file__).resolve().parents[2]
HTML_FILES = [
    REPO / "ai-schools.html",
    REPO / "teacher-time-back" / "resource-hub.html",
    REPO / "teacher-time-back" / "time-back-finder.html",
    REPO / "teacher-time-back" / "setup-kit.html",
]
EXPECTED_PDFS = {
    "Facilitator-Guide.pdf": 5,
    "Fictional-Practice-Pack.pdf": 6,
    "Leadership-Setup-Guide.pdf": 4,
    "Reuse-Planner-Completed-Example.pdf": 5,
    "Safe-Input-and-Review-Cards.pdf": 1,
    "Teacher-Time-Back-Lab-Pilot-Overview.pdf": 1,
    "Teacher-Workbook.pdf": 10,
}


class AuditParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.links: list[str] = []
        self.sources: list[str] = []
        self.images: list[dict[str, str | None]] = []
        self.buttons: list[dict[str, str | None]] = []
        self.tabs: list[dict[str, str | None]] = []
        self.elements_by_id: dict[str, dict[str, str | None]] = {}
        self.headings: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if data.get("id"):
            self.ids.append(str(data["id"]))
            self.elements_by_id[str(data["id"])] = {"tag": tag, **data}
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
        if data.get("role") == "tab":
            self.tabs.append(data)
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.headings.append(tag)


def is_remote(value: str) -> bool:
    return value.startswith(("http://", "https://", "mailto:", "tel:", "data:", "#", "javascript:"))


def local_target(html_path: Path, value: str) -> Path | None:
    clean = value.split("#", 1)[0].split("?", 1)[0]
    if not clean or is_remote(value):
        return None
    return (html_path.parent / clean).resolve()


errors: list[str] = []
for html_path in HTML_FILES:
    text = html_path.read_text(encoding="utf-8")
    parser = AuditParser()
    parser.feed(text)
    duplicate_ids = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    if duplicate_ids:
        errors.append(f"{html_path.name}: duplicate IDs {duplicate_ids}")
    if parser.headings.count("h1") != 1:
        errors.append(f"{html_path.name}: expected one h1, found {parser.headings.count('h1')}")
    for asset in parser.links + parser.sources:
        target = local_target(html_path, asset)
        if target is not None and not target.exists():
            errors.append(f"{html_path.name}: missing local target {asset}")
    for image in parser.images:
        if "alt" not in image:
            errors.append(f"{html_path.name}: image without alt at {image.get('src')}")
    for button in parser.buttons:
        if button.get("type") is None:
            errors.append(f"{html_path.name}: button without explicit type")
    for tab in parser.tabs:
        control = tab.get("aria-controls")
        tab_id = tab.get("id")
        if not tab_id or not control:
            errors.append(f"{html_path.name}: tab missing id or aria-controls")
            continue
        target = parser.elements_by_id.get(control)
        if target is None:
            errors.append(f"{html_path.name}: tab {tab_id} controls missing target {control}")
        elif target.get("role") != "tabpanel":
            errors.append(f"{html_path.name}: target {control} is not a tabpanel")
        if tab.get("aria-selected") not in {"true", "false"}:
            errors.append(f"{html_path.name}: tab {tab_id} lacks aria-selected")

all_copy = "\n".join(path.read_text(encoding="utf-8") for path in HTML_FILES)
if "He is not a New York State licensed teacher" in all_copy:
    errors.append("Removed license sentence has returned")
if "—" in all_copy:
    errors.append("Em dash found in public HTML copy")

pdf_dir = REPO / "teacher-time-back" / "output" / "pdf"
try:
    from pypdf import PdfReader
except ImportError as exc:
    errors.append(f"pypdf is required for PDF page checks: {exc}")
else:
    for filename, expected_pages in EXPECTED_PDFS.items():
        path = pdf_dir / filename
        if not path.exists():
            errors.append(f"Missing PDF: {filename}")
            continue
        actual_pages = len(PdfReader(str(path)).pages)
        if actual_pages != expected_pages:
            errors.append(f"{filename}: expected {expected_pages} pages, found {actual_pages}")

for required in (
    REPO / "teacher-time-back" / "teacher-time-back-skill.zip",
    REPO / "teacher-time-back" / "teacher-time-back-agent.zip",
    REPO / "teacher-time-back" / "teacher-time-back-complete-toolkit.zip",
):
    if not required.exists() or required.stat().st_size == 0:
        errors.append(f"Missing package: {required.name}")

complete_zip = REPO / "teacher-time-back" / "teacher-time-back-complete-toolkit.zip"
if complete_zip.exists():
    with ZipFile(complete_zip) as archive:
        archived = set(archive.namelist())
    expected_archive_paths = {
        "Teacher-Time-Back-Lab/ai-schools.html",
        "Teacher-Time-Back-Lab/ai-schools.css",
        "Teacher-Time-Back-Lab/ai-schools-page.js",
        "Teacher-Time-Back-Lab/assets/andrew-avatar-lightbulb-loop.webm",
        "Teacher-Time-Back-Lab/teacher-time-back/resource-hub.html",
        "Teacher-Time-Back-Lab/teacher-time-back/time-back-finder.html",
        "Teacher-Time-Back-Lab/teacher-time-back/output/pdf/Teacher-Time-Back-Lab-Pilot-Overview.pdf",
        "Teacher-Time-Back-Lab/teacher-time-back/public-agent/AGENT.md",
        "Teacher-Time-Back-Lab/teacher-time-back/public-skill/teacher-time-back/SKILL.md",
        "Teacher-Time-Back-Lab/teacher-time-back/outreach/PILOT-OUTREACH.md",
    }
    missing_archive_paths = sorted(expected_archive_paths - archived)
    if missing_archive_paths:
        errors.append(f"Complete toolkit ZIP is missing {missing_archive_paths}")

if errors:
    print("QA FAILED")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print("QA PASSED")
print(f"Audited {len(HTML_FILES)} public HTML pages, {len(EXPECTED_PDFS)} PDFs, and 3 ZIP packages.")

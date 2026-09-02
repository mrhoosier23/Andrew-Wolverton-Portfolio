from __future__ import annotations

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]


def add_tree(archive: ZipFile, source: Path, prefix: str) -> None:
    for path in sorted(source.rglob("*")):
        if path.is_file() and "__pycache__" not in path.parts:
            archive.write(path, Path(prefix) / path.relative_to(source))


def add_selected_tree(archive: ZipFile, source: Path, prefix: str, names: list[str]) -> None:
    for name in names:
        path = source / name
        if path.is_dir():
            add_tree(archive, path, str(Path(prefix) / name))
        elif path.is_file():
            archive.write(path, Path(prefix) / name)


def build_zip(path: Path, entries: list[tuple[Path, str]]) -> None:
    path.unlink(missing_ok=True)
    with ZipFile(path, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for source, destination in entries:
            if source.is_dir():
                add_tree(archive, source, destination)
            else:
                archive.write(source, destination)


build_zip(
    ROOT / "teacher-time-back-skill.zip",
    [(ROOT / "public-skill" / "teacher-time-back", "teacher-time-back")],
)

build_zip(
    ROOT / "teacher-time-back-agent.zip",
    [(ROOT / "public-agent", "teacher-time-back-agent")],
)

complete_entries = [
    (ROOT.parent / "ai-schools.html", "Teacher-Time-Back-Lab/ai-schools.html"),
    (ROOT.parent / "ai-schools.css", "Teacher-Time-Back-Lab/ai-schools.css"),
    (ROOT.parent / "ai-schools-page.js", "Teacher-Time-Back-Lab/ai-schools-page.js"),
    (ROOT.parent / "script.js", "Teacher-Time-Back-Lab/script.js"),
    (ROOT.parent / "assets" / "Home Logo.png", "Teacher-Time-Back-Lab/assets/Home Logo.png"),
    (ROOT.parent / "assets" / "favicon.svg", "Teacher-Time-Back-Lab/assets/favicon.svg"),
    (ROOT.parent / "assets" / "apple-touch-icon.png", "Teacher-Time-Back-Lab/assets/apple-touch-icon.png"),
    (ROOT.parent / "assets" / "Headshot Option 2.jpg", "Teacher-Time-Back-Lab/assets/Headshot Option 2.jpg"),
    (ROOT.parent / "assets" / "andrew-ai-idea.webp", "Teacher-Time-Back-Lab/assets/andrew-ai-idea.webp"),
    (ROOT.parent / "assets" / "andrew-avatar-lightbulb-loop.webm", "Teacher-Time-Back-Lab/assets/andrew-avatar-lightbulb-loop.webm"),
    (ROOT.parent / "assets" / "andrew-avatar-lightbulb-loop.mp4", "Teacher-Time-Back-Lab/assets/andrew-avatar-lightbulb-loop.mp4"),
    (ROOT.parent / "assets" / "andrew-projects-work.webp", "Teacher-Time-Back-Lab/assets/andrew-projects-work.webp"),
    (ROOT / "OFFER-CONTRACT.md", "Teacher-Time-Back-Lab/teacher-time-back/OFFER-CONTRACT.md"),
    (ROOT / "PACKAGE-MANIFEST.md", "Teacher-Time-Back-Lab/teacher-time-back/PACKAGE-MANIFEST.md"),
    (ROOT / "PRESENTATION-SCRIPT-OUTLINE.md", "Teacher-Time-Back-Lab/teacher-time-back/PRESENTATION-SCRIPT-OUTLINE.md"),
    (ROOT / "PDF-DISTRIBUTION-GUIDE.md", "Teacher-Time-Back-Lab/teacher-time-back/PDF-DISTRIBUTION-GUIDE.md"),
    (ROOT / "AGENT-AND-SKILL-PORTABILITY.md", "Teacher-Time-Back-Lab/teacher-time-back/AGENT-AND-SKILL-PORTABILITY.md"),
    (ROOT / "SOURCES.md", "Teacher-Time-Back-Lab/teacher-time-back/SOURCES.md"),
    (ROOT / "LAUNCH-CHECKLIST.md", "Teacher-Time-Back-Lab/teacher-time-back/LAUNCH-CHECKLIST.md"),
    (ROOT / "PERSUASION-AND-UX-RATIONALE.md", "Teacher-Time-Back-Lab/teacher-time-back/PERSUASION-AND-UX-RATIONALE.md"),
    (ROOT / "MEASUREMENT-PLAN.md", "Teacher-Time-Back-Lab/teacher-time-back/MEASUREMENT-PLAN.md"),
    (ROOT / "RELEASE-NOTES.md", "Teacher-Time-Back-Lab/teacher-time-back/RELEASE-NOTES.md"),
    (ROOT / "USABILITY-TEST-KIT.md", "Teacher-Time-Back-Lab/teacher-time-back/USABILITY-TEST-KIT.md"),
    (ROOT / "FACILITATOR-REHEARSAL-CHECKLIST.md", "Teacher-Time-Back-Lab/teacher-time-back/FACILITATOR-REHEARSAL-CHECKLIST.md"),
    (ROOT / "GOOGLE-DOCS-DELIVERY.md", "Teacher-Time-Back-Lab/teacher-time-back/GOOGLE-DOCS-DELIVERY.md"),
    (ROOT / "materials", "Teacher-Time-Back-Lab/teacher-time-back/materials"),
    (ROOT / "output" / "pdf", "Teacher-Time-Back-Lab/teacher-time-back/output/pdf"),
    (ROOT / "output" / "docx", "Teacher-Time-Back-Lab/teacher-time-back/output/docx"),
    (ROOT / "outreach", "Teacher-Time-Back-Lab/teacher-time-back/outreach"),
    (ROOT / "public-agent", "Teacher-Time-Back-Lab/teacher-time-back/public-agent"),
    (ROOT / "public-skill" / "teacher-time-back", "Teacher-Time-Back-Lab/teacher-time-back/public-skill/teacher-time-back"),
    (ROOT / "teacher-time-back-agent.zip", "Teacher-Time-Back-Lab/teacher-time-back/teacher-time-back-agent.zip"),
    (ROOT / "teacher-time-back-skill.zip", "Teacher-Time-Back-Lab/teacher-time-back/teacher-time-back-skill.zip"),
    (ROOT / "scripts" / "build_facilitator_playbook.py", "Teacher-Time-Back-Lab/teacher-time-back/scripts/build_facilitator_playbook.py"),
    (ROOT / "scripts" / "build_product_suite.py", "Teacher-Time-Back-Lab/teacher-time-back/scripts/build_product_suite.py"),
    (ROOT / "scripts" / "build_packages.py", "Teacher-Time-Back-Lab/teacher-time-back/scripts/build_packages.py"),
    (ROOT / "scripts" / "qa_site.py", "Teacher-Time-Back-Lab/teacher-time-back/scripts/qa_site.py"),
    (ROOT / "scripts" / "test_agent_contract.py", "Teacher-Time-Back-Lab/teacher-time-back/scripts/test_agent_contract.py"),
    (ROOT / "scripts" / "render_facilitator_playbook_qa.py", "Teacher-Time-Back-Lab/teacher-time-back/scripts/render_facilitator_playbook_qa.py"),
]
complete_path = ROOT / "teacher-time-back-complete-toolkit.zip"
build_zip(complete_path, complete_entries)
with ZipFile(complete_path, "a", compression=ZIP_DEFLATED, compresslevel=9) as archive:
    add_selected_tree(
        archive,
        ROOT / "flagship-demo",
        "Teacher-Time-Back-Lab/teacher-time-back/flagship-demo",
        ["README.md", "assets", "source", "output"],
    )

print("Built skill, agent, and complete toolkit ZIP archives.")

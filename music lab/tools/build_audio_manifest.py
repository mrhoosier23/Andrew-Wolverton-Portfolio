from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


def find_project_root() -> Path:
    """Find the portfolio root whether this tool is in /tools or /studio-keys/tools."""
    tool_file = Path(__file__).resolve()
    candidates = [tool_file.parents[1], tool_file.parents[2]]
    for candidate in candidates:
        if (candidate / "audio" / "packs").exists():
            return candidate
    return tool_file.parents[1]


PROJECT_ROOT = find_project_root()
PACKS_ROOT = PROJECT_ROOT / "audio" / "packs"
MANIFEST_PATH = PROJECT_ROOT / "audio" / "manifest.json"

PACK_CONFIGS = [
    {"id": "02-110-A", "folder": "02-110-A", "sourceFolder": "02 110 A", "title": "Medium Drive", "key": "A", "bpm": 110, "timeSignature": "4/4"},
    {"id": "05-099-Bb", "folder": "05-099-Bb", "sourceFolder": "05 099 Bb", "title": "Slow Pocket", "key": "Bb", "bpm": 99, "timeSignature": "4/4"},
    {"id": "14-115-E", "folder": "14-115-E", "sourceFolder": "14 115 E", "title": "Bright Run", "key": "E", "bpm": 115, "timeSignature": "4/4"},
]

EXTENSION_PRIORITY = {".wav": 0, ".aif": 1, ".aiff": 1, ".flac": 2, ".ogg": 3, ".mp3": 4, ".m4a": 5, ".aac": 6}
SECTION_ORDER = ["intro", "intro-fill", "verse-1", "verse-2", "verse-3", "chorus", "chorus-1", "bridge", "outro"]
SECTION_PATTERNS = [
    (re.compile(r"(?:intro[\s_-]*fill|introfill)$", re.I), "intro-fill"),
    (re.compile(r"chorus[\s_-]*1$", re.I), "chorus-1"),
    (re.compile(r"verse[\s_-]*1$", re.I), "verse-1"),
    (re.compile(r"verse[\s_-]*2$", re.I), "verse-2"),
    (re.compile(r"verse[\s_-]*3$", re.I), "verse-3"),
    (re.compile(r"chorus$", re.I), "chorus"),
    (re.compile(r"bridge$", re.I), "bridge"),
    (re.compile(r"intro$", re.I), "intro"),
    (re.compile(r"outro$", re.I), "outro"),
]


def compact_text(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def clean_instrument_name(value: str) -> str:
    value = re.sub(r"[\s_-]+", " ", value).strip()
    replacements = {
        "acoustic guitar": "Acoustic Guitar", "banjo": "Banjo", "bass": "Bass",
        "djembe btm": "Djembe Bottom", "djembe bottom": "Djembe Bottom",
        "djembe top": "Djembe Top", "mando": "Mandolin", "mandolin": "Mandolin",
        "shaker": "Shaker",
    }
    lowered = value.lower()
    if lowered in replacements:
        return replacements[lowered]
    fiddle_match = re.fullmatch(r"fiddle\s*(\d*)", lowered)
    if fiddle_match:
        number = fiddle_match.group(1)
        return f"Fiddle{number}" if number else "Fiddle"
    return value.title()


def classify_instrument(name: str) -> str | None:
    lowered = name.lower()
    if lowered.startswith(("acoustic guitar", "guitar")): return "guitar"
    if lowered.startswith("banjo"): return "banjo"
    if lowered.startswith("bass"): return "bass"
    if lowered.startswith("djembe"): return "djembe"
    if lowered.startswith("fiddle"): return "fiddle"
    if lowered.startswith(("mando", "mandolin")): return "mandolin"
    if lowered.startswith("shaker"): return "shaker"
    return None


def is_full_mix(path: Path, config: dict[str, Any]) -> bool:
    name = compact_text(path.stem)
    valid = {compact_text(config["sourceFolder"]), compact_text(config["id"]), compact_text(config["folder"])}
    return name in valid


def remove_pack_number(stem: str, config: dict[str, Any]) -> str:
    number = config["id"].split("-")[0]
    return re.sub(rf"^{re.escape(number)}[\s_-]*", "", stem, count=1, flags=re.I).strip()


def parse_section(track_name: str) -> tuple[str, str] | None:
    for pattern, section_id in SECTION_PATTERNS:
        match = pattern.search(track_name)
        if match:
            instrument = track_name[:match.start()].strip(" _-")
            return (instrument, section_id) if instrument else None
    return None


def parse_track(path: Path, config: dict[str, Any]) -> dict[str, Any] | None:
    extension = path.suffix.lower()
    if extension not in EXTENSION_PRIORITY or is_full_mix(path, config):
        return None
    parsed = parse_section(remove_pack_number(path.stem, config))
    if not parsed:
        return None
    instrument_raw, section = parsed
    family = classify_instrument(instrument_raw)
    if not family:
        return None
    return {
        "family": family,
        "instrument": clean_instrument_name(instrument_raw),
        "section": section,
        "file": path,
        "priority": EXTENSION_PRIORITY[extension],
    }


def build_pack(config: dict[str, Any]) -> dict[str, Any] | None:
    folder = PACKS_ROOT / config["folder"]
    if not folder.is_dir():
        print(f"Missing folder: {folder}")
        return None

    selected: dict[tuple[str, str], dict[str, Any]] = {}
    preview_mix: Path | None = None
    skipped: list[str] = []

    for path in sorted(folder.iterdir()):
        if not path.is_file() or path.suffix.lower() not in EXTENSION_PRIORITY:
            continue
        if is_full_mix(path, config):
            if preview_mix is None or EXTENSION_PRIORITY[path.suffix.lower()] < EXTENSION_PRIORITY[preview_mix.suffix.lower()]:
                preview_mix = path
            continue
        parsed = parse_track(path, config)
        if not parsed:
            skipped.append(path.name)
            continue
        duplicate_key = (parsed["section"], compact_text(parsed["instrument"]))
        existing = selected.get(duplicate_key)
        if existing is None or parsed["priority"] < existing["priority"]:
            selected[duplicate_key] = parsed

    tracks_by_section: dict[str, list[dict[str, str]]] = {}
    for track in selected.values():
        relative = track["file"].relative_to(PROJECT_ROOT).as_posix()
        tracks_by_section.setdefault(track["section"], []).append({
            "family": track["family"], "instrument": track["instrument"], "path": relative
        })

    for tracks in tracks_by_section.values():
        tracks.sort(key=lambda item: (item["family"], item["instrument"], item["path"]))

    sections = [section for section in SECTION_ORDER if section in tracks_by_section]
    sections.extend(sorted(section for section in tracks_by_section if section not in sections))
    preview_path = preview_mix.relative_to(PROJECT_ROOT).as_posix() if preview_mix else None
    count = sum(len(tracks) for tracks in tracks_by_section.values())
    print(f"{config['id']}: {len(sections)} sections, {count} selected tracks")
    if skipped:
        print(f"  Skipped {len(skipped)} unrecognized audio files")

    return {
        "id": config["id"], "sourceFolder": config["sourceFolder"], "title": config["title"],
        "key": config["key"], "bpm": config["bpm"], "timeSignature": config["timeSignature"],
        "sections": sections, "previewMix": preview_path,
        "tracks": {section: tracks_by_section[section] for section in sections},
    }


def main() -> None:
    print("Andrew's Studio Keys manifest builder")
    print(f"Scanning: {PACKS_ROOT}\n")
    if not PACKS_ROOT.exists():
        raise SystemExit(f"The audio/packs folder does not exist:\n{PACKS_ROOT}")

    packs = [pack for config in PACK_CONFIGS if (pack := build_pack(config))]
    if not packs:
        raise SystemExit("No usable audio packs were found.")

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps({"version": 1, "generated": True, "packs": packs}, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nManifest created successfully:\n{MANIFEST_PATH}")


if __name__ == "__main__":
    main()

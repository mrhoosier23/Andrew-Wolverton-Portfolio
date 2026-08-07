#!/usr/bin/env python3
"""Validate Andrew's Studio Keys integration.

Run from anywhere:
    python studio-keys/tools/validate_studio_keys.py

Optional flags:
    --skip-audio   Skip checking every audio file referenced by the manifest.
    --root PATH    Validate a different portfolio root.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path


class StrictishHTMLParser(HTMLParser):
    """HTMLParser that records parser errors without trying to render anything."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.start_tags = 0
        self.end_tags = 0

    def handle_starttag(self, tag: str, attrs) -> None:  # type: ignore[override]
        self.start_tags += 1

    def handle_endtag(self, tag: str) -> None:  # type: ignore[override]
        self.end_tags += 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate the Studio Keys portfolio integration.")
    parser.add_argument("--root", type=Path, help="Portfolio root containing index.html and studio-keys/")
    parser.add_argument("--skip-audio", action="store_true", help="Skip checking manifest audio paths")
    return parser.parse_args()


def ok(message: str) -> None:
    print(f"PASS  {message}")


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)
    print(f"FAIL  {message}")


def check_file(path: Path, label: str, failures: list[str]) -> None:
    if path.is_file():
        ok(label)
    else:
        fail(f"{label}: missing {path}", failures)


def check_html(path: Path, failures: list[str]) -> None:
    try:
        parser = StrictishHTMLParser()
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()
        if parser.start_tags:
            ok(f"HTML parses: {path.name}")
        else:
            fail(f"HTML contains no start tags: {path}", failures)
    except Exception as exc:
        fail(f"HTML parse failed for {path}: {exc}", failures)


def check_css(path: Path, failures: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    # This is intentionally a structural smoke test, not a full CSS parser.
    if text.count("{") != text.count("}"):
        fail(f"CSS brace count does not match: {path}", failures)
    else:
        ok(f"CSS brace balance: {path.name}")


def check_js(path: Path, failures: list[str]) -> None:
    node = shutil.which("node")
    if not node:
        print(f"SKIP  Node.js is not installed, so JS syntax was not checked: {path.name}")
        return
    result = subprocess.run([node, "--check", str(path)], capture_output=True, text=True)
    if result.returncode == 0:
        ok(f"JavaScript syntax: {path.name}")
    else:
        fail(f"JavaScript syntax failed for {path.name}: {result.stderr.strip()}", failures)


def iter_manifest_audio(manifest: dict) -> list[str]:
    paths: list[str] = []
    for pack in manifest.get("packs", []):
        preview = pack.get("previewMix")
        if preview:
            paths.append(preview)
        for tracks in pack.get("tracks", {}).values():
            for track in tracks:
                path = track.get("path")
                if path:
                    paths.append(path)
    return sorted(set(paths))


def main() -> int:
    args = parse_args()
    script_path = Path(__file__).resolve()
    default_root = script_path.parents[2]
    root = (args.root or default_root).resolve()
    failures: list[str] = []

    print(f"Validating portfolio root: {root}")

    required = {
        "Portfolio homepage": root / "index.html",
        "Portfolio stylesheet": root / "styles.css",
        "Portfolio JavaScript": root / "script.js",
        "Studio Keys page": root / "studio-keys" / "studio-keys.html",
        "Studio Keys stylesheet": root / "studio-keys" / "studio.css",
        "Studio Keys JavaScript": root / "studio-keys" / "studio.js",
        "Audio manifest": root / "audio" / "manifest.json",
    }
    for label, path in required.items():
        check_file(path, label, failures)

    if failures:
        print("\nRequired files are missing, so deeper validation cannot continue safely.")
        return 1

    check_html(required["Portfolio homepage"], failures)
    check_html(required["Studio Keys page"], failures)
    check_css(required["Portfolio stylesheet"], failures)
    check_css(required["Studio Keys stylesheet"], failures)
    check_js(required["Portfolio JavaScript"], failures)
    check_js(required["Studio Keys JavaScript"], failures)

    studio_js = required["Studio Keys JavaScript"].read_text(encoding="utf-8")
    required_map_fragments = [
        '["q", 60]', '["i", 72]', '["[", 77]',
        'const PAD_HOTKEYS = ["z", "x", "c", "v", "b", "n", "m", ","]',
    ]
    for fragment in required_map_fragments:
        if fragment in studio_js:
            ok(f"Keyboard mapping contains {fragment}")
        else:
            fail(f"Keyboard mapping is missing {fragment}", failures)

    manifest_path = required["Audio manifest"]
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        packs = manifest.get("packs", [])
        if len(packs) == 3:
            ok("Manifest contains all three musical packs")
        else:
            fail(f"Manifest contains {len(packs)} packs instead of 3", failures)
    except Exception as exc:
        fail(f"Manifest JSON failed to parse: {exc}", failures)
        manifest = {}

    if not args.skip_audio and manifest:
        audio_paths = iter_manifest_audio(manifest)
        missing_audio = [rel for rel in audio_paths if not (root / Path(rel)).is_file()]
        if missing_audio:
            preview = "\n       ".join(missing_audio[:12])
            extra = len(missing_audio) - min(len(missing_audio), 12)
            suffix = f"\n       ...and {extra} more" if extra else ""
            fail(f"{len(missing_audio)} manifest audio files are missing:\n       {preview}{suffix}", failures)
        else:
            ok(f"All {len(audio_paths)} manifest audio paths exist")
    elif args.skip_audio:
        print("SKIP  Manifest audio path checks were disabled with --skip-audio")

    character_root = root / "assets" / "characters"
    character_files = [
        "flannel-idle.webp", "flannel-listening.webp", "flannel-count.webp", "flannel-celebrate.webp",
        "doon-idle.gif", "doon-bounce.gif", "doon-jump.gif",
    ]
    missing_characters = [name for name in character_files if not (character_root / name).is_file()]
    if missing_characters:
        print("WARN  Character assets not found at expected paths: " + ", ".join(missing_characters))
        print("      Studio Keys should use its built-in fallback behavior instead of broken images.")
    else:
        ok("All Studio Keys character assets exist")

    print("\n" + ("VALIDATION FAILED" if failures else "VALIDATION PASSED"))
    if failures:
        print(f"{len(failures)} issue(s) need attention before publishing.")
        return 1
    print("The code structure, keyboard map, manifest, and local paths passed validation.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AGENT = (ROOT / "public-agent" / "AGENT.md").read_text(encoding="utf-8")
SKILL = (ROOT / "public-skill" / "teacher-time-back" / "SKILL.md").read_text(encoding="utf-8")
EVALS = json.loads((ROOT / "public-agent" / "evals.json").read_text(encoding="utf-8"))

required = [
    "Help me with",
    "Use only",
    "Return",
    "Stop and ask if",
    "I will review",
    "NEEDS TEACHER INPUT",
    "The assistant prepares. The teacher decides.",
    "key ID",
    "small groups",
    "workaround account",
    "keep, revise, or stop",
]

for phrase in required:
    assert phrase.lower() in (AGENT + SKILL).lower(), f"Missing contract phrase: {phrase}"

forbidden = ["teacher-owned", "approved environment", "student-neutral", "fictional material", "reuse planner", "blueprint"]
for phrase in forbidden:
    assert phrase.lower() not in (AGENT + SKILL).lower(), f"Rejected vocabulary remains: {phrase}"

ids = [case["id"] for case in EVALS]
assert len(ids) == len(set(ids)), "Duplicate evaluation ids"
assert len(EVALS) >= 8, "Insufficient evaluation coverage"

coverage = " ".join(case["input"] for case in EVALS).lower()
for concept in ["key id", "reading group", "school has not", "definitely save", "iep"]:
    assert concept in coverage, f"Missing evaluation concept: {concept}"

print(f"Agent contract passed: {len(required)} requirements, {len(forbidden)} rejected terms, {len(EVALS)} evaluation cases.")

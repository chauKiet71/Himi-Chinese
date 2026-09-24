"""Generate and upload clean HSK 2-4 textbook scene audio with Eleven v3.

OCR-contaminated tracks are skipped for editorial review. Re-running resumes from
Cloudinary URLs in the media catalog or cached MP3s under .codex-tmp/hsk-elevenlabs.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re

import requests


ROOT = Path(__file__).resolve().parents[1]
VOICE_ID = "9lHjugDhwqoxA5MhX0az"
MODEL_ID = "eleven_v3"
ELEVEN_KEY_PATH = Path("C:/Users/DELL/Documents/api_key_elevanlabs.txt")
CLOUDINARY_KEY_PATH = Path("C:/Users/DELL/Documents/cloudinary_key_theanh.txt")
CACHE = ROOT / ".codex-tmp/hsk-elevenlabs"


def credentials() -> tuple[str, str, str]:
    values = {}
    for line in CLOUDINARY_KEY_PATH.read_text(encoding="utf-8-sig").splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            values[key.strip().lower()] = value.strip()
    return values["cloud name"], values["api key"], values["api secret key"]


def save_json(path: Path, data: object) -> None:
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temp, path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("level", type=int, choices=(2, 3, 4))
    parser.add_argument("--volume", choices=("upper", "lower"))
    parser.add_argument("--limit", type=int, default=1000)
    args = parser.parse_args()

    if args.level == 4 and not args.volume:
        parser.error("HSK 4 requires --volume upper or lower")
    bundle_name = f"hsk{args.level}{'-' + args.volume if args.level == 4 else ''}-textbook-json"
    shared = ROOT / "content" / bundle_name / "shared"
    scenes_path = shared / ("texts.json" if args.level == 4 else "text-scenes.json")
    media_path = shared / "media-assets.json"
    scenes = json.loads(scenes_path.read_text(encoding="utf-8"))
    media = json.loads(media_path.read_text(encoding="utf-8"))
    by_scene = {scene["id"]: scene for scene in scenes["texts" if args.level == 4 else "scenes"]}
    upper_content = {}
    if args.level == 4 and args.volume == "upper":
        upper_content = json.loads((shared / "learning-enrichment.json").read_text(encoding="utf-8"))["textContent"]
    key = ELEVEN_KEY_PATH.read_text(encoding="utf-8-sig").strip()
    cloud_name, cloud_key, cloud_secret = credentials()
    CACHE.mkdir(parents=True, exist_ok=True)

    completed = 0
    skipped = []
    for asset in media["assets"]:
        scene = by_scene.get(asset["requiredBy"])
        if scene is None:
            raise ValueError(f"Missing scene: {asset['requiredBy']}")
        if asset.get("uri"):
            scene["audioUrl"] = asset["uri"]
            continue
        if completed >= args.limit:
            continue
        if upper_content:
            lines = [line["hanzi"].strip() for line in upper_content.get(scene["id"], [])]
        else:
            lines = [line["textZh"].strip() for line in scene["lines"]]
        if (not lines
            or any(re.search(r"[A-Za-z]|生词|\d+\.[\u3400-\u9fff]", line) for line in lines)
            or not re.search(r"[。！？!?][”’」』]?\s*$", lines[-1])):
            skipped.append(scene["id"])
            continue
        text = "\n".join(lines)
        mp3_path = CACHE / f"{asset['id']}.mp3"
        if not mp3_path.exists():
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
                params={"output_format": "mp3_44100_128"},
                headers={"xi-api-key": key, "Content-Type": "application/json"},
                json={"text": text, "model_id": MODEL_ID},
                timeout=120,
            )
            if not response.ok:
                raise RuntimeError(f"ElevenLabs {response.status_code}: {response.text[:500]}")
            mp3_path.write_bytes(response.content)
        with mp3_path.open("rb") as audio:
            uploaded = requests.post(
                f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload",
                auth=(cloud_key, cloud_secret),
                data={"public_id": f"hanziwork/hsk{args.level}/{args.volume or 'textbook'}-scenes/{asset['id']}", "overwrite": "true"},
                files={"file": (mp3_path.name, audio, "audio/mpeg")},
                timeout=120,
            )
        if not uploaded.ok:
            raise RuntimeError(f"Cloudinary {uploaded.status_code}: {uploaded.text[:500]}")
        url = uploaded.json()["secure_url"]
        asset["uri"] = url
        asset["availability"] = "generated"
        asset["reviewStatus"] = "pending-audio-review"
        asset["generation"] = {"provider": "elevenlabs", "modelId": MODEL_ID, "voiceId": VOICE_ID}
        scene["audioUrl"] = url
        save_json(media_path, media)
        save_json(scenes_path, scenes)
        completed += 1
        print(f"{completed}: {asset['id']} ({len(text)} chars)", flush=True)

    save_json(scenes_path, scenes)
    print(f"{bundle_name}: generated {completed}; skipped OCR-contaminated {len(skipped)} {skipped}", flush=True)


if __name__ == "__main__":
    main()

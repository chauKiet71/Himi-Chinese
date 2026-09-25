"""Generate clean HSK 5 volume 2 article tracks with Eleven v3.

The source is OCR, so tracks containing source-page markers or Latin artifacts
are skipped. Workbook and vocabulary tracks need separate source transcripts.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re

import requests


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "content/hsk5-lower-textbook-json"
CACHE = ROOT / ".codex-tmp/hsk5-elevenlabs"
VOICE_ID = "9lHjugDhwqoxA5MhX0az"
MODEL_ID = "eleven_v3"
SOURCE_NOISE = re.compile(r"HSK\s*标准教程|标准教程5|www\.|GiaoTrinh|Giao\.Trinh", re.I)
OCR_ARTIFACT = re.compile(r"[A-Za-z]|生词|\d+\.[\u3400-\u9fff]")


def save_json(path: Path, data: object) -> None:
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temp, path)


def cloudinary_credentials() -> tuple[str, str, str]:
    values = {}
    for line in Path("C:/Users/DELL/Documents/cloudinary_key_theanh.txt").read_text(encoding="utf-8-sig").splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            values[key.strip().lower()] = value.strip()
    return values["cloud name"], values["api key"], values["api secret key"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=18)
    args = parser.parse_args()
    texts_path = BUNDLE / "texts.json"
    media_path = BUNDLE / "media-assets.json"
    texts = json.loads(texts_path.read_text(encoding="utf-8"))
    media = json.loads(media_path.read_text(encoding="utf-8"))
    by_track = {asset["trackLabel"]: asset for asset in media["mediaAssets"]}
    eleven_key = Path("C:/Users/DELL/Documents/api_key_elevanlabs.txt").read_text(encoding="utf-8-sig").strip()
    cloud_name, cloud_key, cloud_secret = cloudinary_credentials()
    CACHE.mkdir(parents=True, exist_ok=True)

    completed = 0
    skipped = []
    for article in texts["texts"]:
        asset = by_track[article["audioTrack"]]
        if asset.get("uri"):
            article["audioUrl"] = asset["uri"]
            continue
        if completed >= args.limit:
            continue
        lines = [line.strip() for line in article["bodyZhOcrLines"] if not SOURCE_NOISE.search(line)]
        source_text = "".join(lines)
        text = source_text.split("改编自", 1)[0]
        if ("改编自" not in source_text or not text
            or OCR_ARTIFACT.search(text)
            or not re.search(r"[。！？!?][”’」』]?\s*$", text)):
            skipped.append(article["audioTrack"])
            continue
        mp3_path = CACHE / f"{asset['id']}.mp3"
        if not mp3_path.exists():
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
                params={"output_format": "mp3_44100_128"},
                headers={"xi-api-key": eleven_key, "Content-Type": "application/json"},
                json={"text": text, "model_id": MODEL_ID},
                timeout=180,
            )
            if not response.ok:
                raise RuntimeError(f"ElevenLabs {response.status_code}: {response.text[:500]}")
            mp3_path.write_bytes(response.content)
        with mp3_path.open("rb") as audio:
            uploaded = requests.post(
                f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload",
                auth=(cloud_key, cloud_secret),
                data={"public_id": f"hanziwork/hsk5/volume2-articles/{asset['id']}", "overwrite": "true"},
                files={"file": (mp3_path.name, audio, "audio/mpeg")},
                timeout=180,
            )
        if not uploaded.ok:
            raise RuntimeError(f"Cloudinary {uploaded.status_code}: {uploaded.text[:500]}")
        url = uploaded.json()["secure_url"]
        asset["uri"] = url
        asset["availability"] = "generated"
        asset["reviewStatus"] = "pending-audio-review"
        asset["generation"] = {"provider": "elevenlabs", "modelId": MODEL_ID, "voiceId": VOICE_ID}
        article["audioUrl"] = url
        save_json(media_path, media)
        save_json(texts_path, texts)
        completed += 1
        print(f"{completed}: {asset['id']} ({len(text)} chars)", flush=True)

    save_json(texts_path, texts)
    print(f"HSK 5 volume 2: generated {completed}; skipped OCR-contaminated {skipped}", flush=True)


if __name__ == "__main__":
    main()

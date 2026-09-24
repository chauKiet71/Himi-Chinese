"""Generate reviewed-length HSK 6 volume 2 article audio with Eleven v3.

Only complete Chinese OCR articles without annotation artifacts are eligible.
The command resumes from URLs already stored in the media and article JSON.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re

import requests


ROOT = Path(__file__).resolve().parents[1]
SHARED = ROOT / "content/hsk6-volume2-textbook-json/shared"
CACHE = ROOT / ".codex-tmp/hsk6-v2-elevenlabs"
VOICE_ID = "9lHjugDhwqoxA5MhX0az"
MODEL_ID = "eleven_v3"


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
    parser.add_argument("--limit", type=int, default=20)
    args = parser.parse_args()
    articles_path = SHARED / "articles.json"
    media_path = SHARED / "media-assets.json"
    articles = json.loads(articles_path.read_text(encoding="utf-8"))
    media = json.loads(media_path.read_text(encoding="utf-8"))
    by_lesson = {asset["lessonRef"]: asset for asset in media if asset["kind"] == "article-audio"}
    eleven_key = Path("C:/Users/DELL/Documents/api_key_elevanlabs.txt").read_text(encoding="utf-8-sig").strip()
    cloud_name, cloud_key, cloud_secret = cloudinary_credentials()
    CACHE.mkdir(parents=True, exist_ok=True)

    completed = 0
    skipped = []
    for article in articles:
        asset = by_lesson[article["lessonRef"]]
        if asset.get("uri"):
            article["audioUrl"] = asset["uri"]
            continue
        if completed >= args.limit:
            continue
        text = article["textZh"].strip()
        if (re.search(r"[A-Za-z]|生词|\d+\.[\u3400-\u9fff]", text)
            or not re.search(r"[。！？!?][”’」』]?\s*$", text)):
            skipped.append(article["lessonRef"])
            continue
        mp3_path = CACHE / f"{asset['id']}.mp3"
        if not mp3_path.exists():
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
                params={"output_format": "mp3_44100_128"},
                headers={"xi-api-key": eleven_key, "Content-Type": "application/json"},
                json={"text": text, "model_id": MODEL_ID},
                timeout=240,
            )
            if not response.ok:
                raise RuntimeError(f"ElevenLabs {response.status_code}: {response.text[:500]}")
            mp3_path.write_bytes(response.content)
        with mp3_path.open("rb") as audio:
            uploaded = requests.post(
                f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload",
                auth=(cloud_key, cloud_secret),
                data={"public_id": f"hanziwork/hsk6/volume2-articles/{asset['id']}", "overwrite": "true"},
                files={"file": (mp3_path.name, audio, "audio/mpeg")},
                timeout=240,
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
        save_json(articles_path, articles)
        completed += 1
        print(f"{completed}: {asset['id']} ({len(text)} chars)", flush=True)

    save_json(articles_path, articles)
    print(f"HSK 6 volume 2: generated {completed}; skipped OCR-contaminated {skipped}", flush=True)


if __name__ == "__main__":
    main()

"""Generate HSK 1 dialogue tracks and attach Cloudinary URLs.

Credentials are read from the two user-provided files and never written to the repo.
The script is resumable: a track with a Cloudinary URI is skipped, and generated
MP3 files are cached under .codex-tmp/hsk1-elevenlabs for retrying failed uploads.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "content/hsk1-textbook-json/shared"
VOICE_ID = "9lHjugDhwqoxA5MhX0az"
MODEL_ID = "eleven_v3"
ELEVEN_KEY_PATH = Path("C:/Users/DELL/Documents/api_key_elevanlabs.txt")
CLOUDINARY_KEY_PATH = Path("C:/Users/DELL/Documents/cloudinary_key_theanh.txt")
CACHE = ROOT / ".codex-tmp/hsk1-elevenlabs"


def read_cloudinary_credentials() -> tuple[str, str, str]:
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
    parser.add_argument("--limit", type=int, default=45)
    args = parser.parse_args()

    dialogues_path = BUNDLE / "dialogues.json"
    media_path = BUNDLE / "media-assets.json"
    dialogues = json.loads(dialogues_path.read_text(encoding="utf-8"))
    media = json.loads(media_path.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in media["items"]}
    eleven_key = ELEVEN_KEY_PATH.read_text(encoding="utf-8-sig").strip()
    cloud_name, cloud_key, cloud_secret = read_cloudinary_credentials()
    CACHE.mkdir(parents=True, exist_ok=True)

    completed = 0
    for dialogue in dialogues["items"]:
        asset_id = dialogue["fullAudioRef"].removeprefix("media:")
        asset = by_id[asset_id]
        if asset.get("uri"):
            dialogue["audioUrl"] = asset["uri"]
            continue
        if completed >= args.limit:
            continue
        text = "".join(turn["hanzi"] for turn in dialogue["turns"])
        if not text.strip():
            raise ValueError(f"No Chinese dialogue for {asset_id}")
        mp3_path = CACHE / f"{asset_id}.mp3"
        if not mp3_path.exists():
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
                params={"output_format": "mp3_44100_128"},
                headers={"xi-api-key": eleven_key, "Content-Type": "application/json"},
                json={"text": text, "model_id": MODEL_ID},
                timeout=120,
            )
            if not response.ok:
                raise RuntimeError(f"ElevenLabs {response.status_code}: {response.text[:500]}")
            mp3_path.write_bytes(response.content)
        public_id = f"hanziwork/hsk1/textbook-dialogues/{asset_id}"
        with mp3_path.open("rb") as audio:
            uploaded = requests.post(
                f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload",
                auth=(cloud_key, cloud_secret),
                data={"public_id": public_id, "overwrite": "true"},
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
        dialogue["audioUrl"] = url
        save_json(media_path, media)
        save_json(dialogues_path, dialogues)
        completed += 1
        print(f"{completed}: {asset_id} ({len(text)} chars, {len(mp3_path.read_bytes())} bytes)", flush=True)

    save_json(dialogues_path, dialogues)
    print(f"Generated and uploaded {completed} tracks", flush=True)


if __name__ == "__main__":
    main()

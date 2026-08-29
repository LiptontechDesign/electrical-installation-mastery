import argparse
import json
import re
import tempfile
from pathlib import Path

from faster_whisper import WhisperModel
from yt_dlp import YoutubeDL


def safe_file_name(value: str) -> str:
    value = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '-', value)
    value = re.sub(r'\s+', ' ', value).strip()
    return value[:120].strip()


def timestamp(seconds: float) -> str:
    total = max(0, int(seconds))
    hours, remainder = divmod(total, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f'{hours:02d}:{minutes:02d}:{seconds:02d}' if hours else f'{minutes:02d}:{seconds:02d}'


parser = argparse.ArgumentParser()
parser.add_argument('--root', required=True)
parser.add_argument('--sequence', required=True, type=int)
args = parser.parse_args()

root = Path(args.root).resolve()
manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8-sig'))
video = next(item for item in manifest['videos'] if int(item['sequence']) == args.sequence)

with tempfile.TemporaryDirectory(prefix='electrical-transcript-') as temporary:
    audio_template = str(Path(temporary) / 'audio.%(ext)s')
    options = {
        'format': 'bestaudio/best',
        'outtmpl': audio_template,
        'quiet': True,
        'no_warnings': True,
        'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '128'}],
    }
    with YoutubeDL(options) as downloader:
        downloader.download([video['url']])

    audio_path = Path(temporary) / 'audio.mp3'
    model = WhisperModel('base.en', device='cpu', compute_type='int8')
    segments, info = model.transcribe(str(audio_path), beam_size=5, vad_filter=True)
    transcript_lines = [f'[{timestamp(segment.start)}] {segment.text.strip()}' for segment in segments if segment.text.strip()]

if not transcript_lines:
    transcript_lines = [
        '[00:00] No intelligible spoken narration was detected. This lesson is a visual-only conduit-bending demonstration. '
        'Both online caption extraction and local speech recognition produced no spoken transcript, so no wording has been invented.'
    ]

module_directory = root / video['moduleId']
module_directory.mkdir(parents=True, exist_ok=True)
output_path = module_directory / (
    f"{int(video['sequence']):03d} - {video['lessonId']} - {safe_file_name(video['lessonTitle'])}.txt"
)
header = [
    f"Lesson: {video['lessonTitle']}",
    f"Module: {video['moduleTitle']}",
    f"Lesson ID: {video['lessonId']}",
    f"Video: {video['url']}",
    'Transcript source: Local speech recognition (faster-whisper base.en)',
    f"Language: {info.language}",
    '',
]
output_path.write_text('\n'.join(header + transcript_lines + ['']), encoding='utf-8')
print(json.dumps({'path': str(output_path), 'lines': len(transcript_lines), 'language': info.language}))

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Mechanical source indexing only. Learning content is authored separately.
const root = 'course-transcripts/supplied-2026-09';
const base = JSON.parse(readFileSync('app/course-data.json', 'utf8'));
const old = new Map(base.modules.flatMap(m => m.lessons.map(l => [l.videoId, l])));
const rows = [];
for (const group of ['ac-theory', 'resistance', 'lighting']) {
  const directory = join(root, group, readdirSync(join(root, group))[0]);
  const manifest = JSON.parse(readFileSync(join(directory, 'manifest.json'), 'utf8'));
  for (const video of manifest.videos) {
    if (video.video_id === 'mZBwsm6B280') continue; // Unrelated probability video.
    const path = join(directory, video.output_file).replaceAll('\\', '/');
    const transcript = readFileSync(path, 'utf8');
    const times = [...transcript.matchAll(/^\[(\d+):(\d{2})(?::(\d{2}))?\]/gm)].map(m => m[3] ? +m[1] * 3600 + +m[2] * 60 + +m[3] : +m[1] * 60 + +m[2]);
    if (!times.length) throw new Error(`No caption timing: ${path}`);
    rows.push({ id: old.get(video.video_id)?.id ?? `supp-${group}-${String(video.channel_index).padStart(2, '0')}`, videoId: video.video_id, title: video.title, instructor: old.get(video.video_id)?.instructor ?? 'Joe Robinson Training', durationSeconds: old.get(video.video_id)?.durationSeconds ?? Math.max(...times), durationSource: old.has(video.video_id) ? 'Existing video metadata' : 'Last supplied caption timestamp; approximate video duration', group, index: video.channel_index, existing: old.has(video.video_id), transcript: path, sha256: video.sha256 });
  }
}
writeFileSync('app/supplied-video-index.json', JSON.stringify(rows, null, 2) + '\n');
const archive = JSON.parse(readFileSync('course-transcripts/manifest.json', 'utf8'));
for (const row of rows.filter(row => !row.existing)) {
  const directory = join(root, row.group, readdirSync(join(root, row.group))[0]);
  const manifest = JSON.parse(readFileSync(join(directory, 'manifest.json'), 'utf8'));
  const video = manifest.videos.find(video => video.video_id === row.videoId);
  const entry = { ...video, output_file: row.transcript.replace(/^course-transcripts\//, '') };
  const existing = archive.videos.findIndex(video => video.video_id === row.videoId);
  if (existing < 0) archive.videos.push(entry);
  else archive.videos[existing] = entry;
}
archive.videos.forEach((video, index) => { video.channel_index = index + 1; });
archive.job.selection = { selected_videos: archive.videos.length, source_videos: archive.videos.length };
archive.job.source_title = 'Electrical course — merged supplied transcript archives';
writeFileSync('course-transcripts/manifest.json', JSON.stringify(archive, null, 2) + '\n');
const columns = ['channel_index','video_id','title','published_at','status','language','caption_kind','track','strategy','output_file','sha256','error_class','error'];
const csv = value => '"' + String(value ?? '').replaceAll('"','""') + '"';
writeFileSync('course-transcripts/manifest.csv', columns.join(',') + '\n' + archive.videos.map(video => columns.map(key => csv(video[key])).join(',')).join('\n') + '\n');
console.log(`${rows.length} relevant sources; ${rows.filter(r => !r.existing).length} missing videos.`);

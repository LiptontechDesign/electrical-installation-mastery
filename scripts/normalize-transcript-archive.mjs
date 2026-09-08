import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const transcriptRoot = resolve(projectRoot, 'course-transcripts');
const manifestPath = resolve(transcriptRoot, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

function pathInside(root, path) {
  const child = relative(root, path);
  return child && !child.startsWith('..') && !isAbsolute(child);
}

let renamed = 0;
for (const video of manifest.videos) {
  if (!video.output_file) continue;

  const compactName = `${String(video.channel_index).padStart(3, '0')}-${video.video_id}.txt`;
  const compactRelativePath = `transcripts/${compactName}`;
  const currentPath = resolve(transcriptRoot, video.output_file);
  const compactPath = resolve(transcriptRoot, compactRelativePath);

  if (!pathInside(transcriptRoot, currentPath) || !pathInside(transcriptRoot, compactPath)) {
    throw new Error(`Transcript path escapes the archive: ${video.video_id}`);
  }
  if (!existsSync(currentPath) && !existsSync(compactPath)) {
    throw new Error(`Transcript file is missing: ${video.video_id}`);
  }
  if (currentPath !== compactPath && existsSync(currentPath)) {
    if (existsSync(compactPath)) throw new Error(`Compact transcript path already exists: ${compactRelativePath}`);
    renameSync(currentPath, compactPath);
    renamed += 1;
  }

  video.output_file = compactRelativePath;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ videos: manifest.videos.length, renamed }, null, 2));

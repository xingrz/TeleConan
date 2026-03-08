import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, basename } from 'path';
import { load, JSON_SCHEMA } from 'js-yaml';

const DATA_DIR = resolve(import.meta.dirname, '..', 'data');
const OUT_DIR = resolve(import.meta.dirname, '..', 'public', 'data');

interface SliceConfig {
  name: string;
  data: { num: number }[];
  tiers: number[];
}

interface DataSlice<T> {
  data: T[];
  next?: string;
}

function sha1(content: string): string {
  return createHash('sha1').update(content).digest('hex').slice(0, 8);
}

function sliceDataset(config: SliceConfig): void {
  const { name, data, tiers } = config;

  // Data is sorted from old to new (by num ascending)
  const sorted = [...data].sort((a, b) => a.num - b.num);

  // Split into chunks: tiers define chunk sizes from old to new
  // e.g. tiers [500, 200, 20] means first chunks are 500 each, then 200, then 20, remainder is latest
  const chunks: { num: number }[][] = [];
  let remaining = sorted;

  for (const tier of tiers) {
    while (remaining.length > tier) {
      chunks.push(remaining.slice(0, tier));
      remaining = remaining.slice(tier);
    }
  }

  // Whatever's left is the latest chunk
  chunks.push(remaining);

  // Build slice chain from latest (entry) back to oldest
  // Latest -> second-to-last -> ... -> oldest
  // Each slice's `next` points to the previous (older) slice's filename key

  // First, generate filenames for non-latest chunks
  const sliceFiles: { key: string; data: { num: number }[] }[] = [];

  for (let i = 0; i < chunks.length - 1; i++) {
    const chunk = chunks[i];
    const content = JSON.stringify({ data: chunk });
    const firstNum = chunk[0].num;
    const key = `${name}-${firstNum}-${sha1(content)}`;
    sliceFiles.push({ key, data: chunk });
  }

  // Write non-latest slices with chain links
  // sliceFiles[0] is oldest, sliceFiles[last] is second-to-latest
  // Chain: latest.next -> sliceFiles[last].key -> sliceFiles[last-1].key -> ... -> sliceFiles[0] (no next)
  for (let i = 0; i < sliceFiles.length; i++) {
    const slice: DataSlice<{ num: number }> = {
      data: sliceFiles[i].data,
    };
    if (i > 0) {
      slice.next = sliceFiles[i - 1].key;
    }
    writeFileSync(
      resolve(OUT_DIR, `s.${sliceFiles[i].key}.json`),
      JSON.stringify(slice),
    );
  }

  // Write latest (entry point)
  const latestChunk = chunks[chunks.length - 1];
  const latest: DataSlice<{ num: number }> = {
    data: latestChunk,
  };
  if (sliceFiles.length > 0) {
    latest.next = sliceFiles[sliceFiles.length - 1].key;
  }
  writeFileSync(
    resolve(OUT_DIR, `e.${name}-latest.json`),
    JSON.stringify(latest),
  );

  const totalSlices = sliceFiles.length + 1;
  console.log(`  ${name}: ${data.length} records -> ${totalSlices} slices`);
}

// Clean output directory
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

// Process episodes
console.log('Slicing data...');

const episodes = load(readFileSync(resolve(DATA_DIR, 'episodes.yaml'), 'utf-8'), { schema: JSON_SCHEMA }) as { num: number }[];
sliceDataset({
  name: 'episode',
  data: episodes,
  tiers: [500, 200, 20],
});

// Process streaming files
const streamingFiles = readdirSync(DATA_DIR).filter(f => f.startsWith('streaming_') && f.endsWith('.yaml'));
for (const file of streamingFiles) {
  const platform = basename(file, '.yaml').replace('streaming_', '');
  const data = load(readFileSync(resolve(DATA_DIR, file), 'utf-8'), { schema: JSON_SCHEMA }) as { num: number }[];
  sliceDataset({
    name: platform,
    data: data,
    tiers: [500, 200, 100, 50, 20, 10],
  });
}

// Copy stats.json if present
const statsFile = resolve(DATA_DIR, 'stats.json');
if (existsSync(statsFile)) {
  copyFileSync(statsFile, resolve(OUT_DIR, 'stats.json'));
  console.log('  stats.json copied');
}

console.log('Done.');

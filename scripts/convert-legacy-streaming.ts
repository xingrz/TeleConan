import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dump, load, JSON_SCHEMA } from 'js-yaml';

interface LegacyLink {
  num: number | null;
  num_type: 'jp' | 'cn';
  href: string;
  title: string;
}

interface LegacySlice {
  data: LegacyLink[];
  next?: string;
}

interface Streaming {
  num: number;
  title: string;
  href: string;
  maps_to: {
    episode_num: number;
    segment?: number;
  };
}

interface CliArgs {
  platform: string;
  legacyRef: string;
  legacyDir: string;
  mappingFile: string;
  outFile: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    platform: 'qq',
    legacyRef: 'origin/gh-pages',
    legacyDir: 'data',
    mappingFile: resolve(import.meta.dirname, '..', 'data', 'streaming_bilibili.yaml'),
    outFile: resolve(import.meta.dirname, '..', 'data', 'streaming_qq.yaml'),
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = argv[i + 1];
    if (!value) continue;

    switch (arg) {
      case '--platform':
        args.platform = value;
        i++;
        break;
      case '--legacy-ref':
        args.legacyRef = value;
        i++;
        break;
      case '--legacy-dir':
        args.legacyDir = value;
        i++;
        break;
      case '--mapping-file':
        args.mappingFile = resolve(value);
        i++;
        break;
      case '--out-file':
        args.outFile = resolve(value);
        i++;
        break;
    }
  }

  return args;
}

function gitShow(ref: string, path: string): string {
  return execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8' });
}

function loadLegacyChain(ref: string, dir: string, platform: string): LegacyLink[] {
  const all: LegacyLink[] = [];
  const seen = new Set<string>();
  let nextPath = `${dir}/e.${platform}-latest.json`;

  while (nextPath) {
    if (seen.has(nextPath)) {
      throw new Error(`Detected slice cycle at ${nextPath}`);
    }
    seen.add(nextPath);

    const slice = JSON.parse(gitShow(ref, nextPath)) as LegacySlice;
    all.unshift(...slice.data);
    nextPath = slice.next ? `${dir}/s.${slice.next}.json` : '';
  }

  return all;
}

function buildMapping(mappingFile: string): Map<number, Streaming['maps_to'] & { title: string }> {
  const data = load(readFileSync(mappingFile, 'utf8'), { schema: JSON_SCHEMA }) as Streaming[];
  return new Map(data.map(item => [item.num, { ...item.maps_to, title: item.title }]));
}

function isPlaceholderTitle(title: string, num: number): boolean {
  const trimmed = title.trim();
  return trimmed === String(num) || trimmed === `第${num}话` || trimmed === 'SP';
}

function convertLegacyLinks(legacy: LegacyLink[], mapping: Map<number, Streaming['maps_to'] & { title: string }>) {
  const converted: Streaming[] = [];
  const skipped: LegacyLink[] = [];

  for (const item of legacy) {
    if (item.num_type !== 'cn' || item.num == null) {
      skipped.push(item);
      continue;
    }

    const mapped = mapping.get(item.num);
    if (!mapped) {
      skipped.push(item);
      continue;
    }

    converted.push({
      num: item.num,
      title: isPlaceholderTitle(item.title, item.num) ? mapped.title : item.title.replace(/^第\d+话\s*/, ''),
      href: item.href,
      maps_to: mapped.segment == null
        ? { episode_num: mapped.episode_num }
        : { episode_num: mapped.episode_num, segment: mapped.segment },
    });
  }

  return { converted, skipped };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const legacy = loadLegacyChain(args.legacyRef, args.legacyDir, args.platform);
  const mapping = buildMapping(args.mappingFile);
  const { converted, skipped } = convertLegacyLinks(legacy, mapping);

  writeFileSync(args.outFile, dump(converted, { lineWidth: 0, noRefs: true }));

  console.log(`Converted ${converted.length} ${args.platform} records from ${args.legacyRef}:${args.legacyDir}`);
  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} records without stable episode mapping:`);
    for (const item of skipped) {
      console.log(`  num=${String(item.num)} title=${item.title} href=${item.href}`);
    }
  }
}

main();

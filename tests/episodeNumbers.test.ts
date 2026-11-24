import assert from 'node:assert/strict';
import test from 'node:test';

import { getEpisodeNumbers } from '../src/composables/episodeNumbers.ts';
import type { Episode } from '../src/types/episode.ts';
import type { Streaming } from '../src/types/streaming.ts';

const episode: Episode = {
  num: 1187, duration: 60, title_jp: '', title_cn: '',
  aired_at: '2099-01-01', sources: [],
};

function link(num: number, segment?: number): Streaming {
  return { num, title: '', href: 'https://example.com/', maps_to: { episode_num: 1187, segment } };
}

test('unbroadcast episodes expose their known split numbers independently of playback', () => {
  assert.deepEqual(getEpisodeNumbers([episode], {}, [
    { 1187: [link(1245, 0), link(1246, 1)] },
  ]), { 1187: [1245, 1246] });
});

test('platform mappings are combined, deduplicated and sorted', () => {
  assert.deepEqual(getEpisodeNumbers([episode], {}, [
    { 1187: [link(1246, 1)] },
    { 1187: [link(1245, 0), link(1246, 1)] },
  ]), { 1187: [1245, 1246] });
});

test('dedicated mappings preserve numbers before a platform publishes playback links', () => {
  const splits = { 1187: [{ num: 1245, maps_to: { episode_num: 1187, segment: 0 } }, { num: 1246, maps_to: { episode_num: 1187, segment: 1 } }] };
  assert.deepEqual(getEpisodeNumbers([episode], splits, [{}, {}]), { 1187: [1245, 1246] });
});

test('incomplete data never fabricates absolute numbers from duration', () => {
  assert.deepEqual(getEpisodeNumbers([episode], {}, [{}]), { 1187: [] });
});

test('the source split scheme takes precedence over platform-specific numbering', () => {
  assert.deepEqual(getEpisodeNumbers([episode], { 1187: [link(1245), link(1246)] }, [{ 1187: [link(9999)] }]), { 1187: [1245, 1246] });
});

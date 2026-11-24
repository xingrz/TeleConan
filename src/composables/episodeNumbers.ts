import type { Episode } from '../types/episode';
import type { EpisodeSplit } from '../types/episodeSplit';

export function getEpisodeNumbers(
  episodes: readonly Episode[],
  splits: Readonly<Record<number, EpisodeSplit[]>>,
  platforms: readonly Record<number, EpisodeSplit[]>[] = [],
): Record<number, number[]> {
  return Object.fromEntries(episodes.map(episode => {
    const exact = splits[episode.num];
    const numbers = exact?.length ? exact.map(split => split.num)
      : platforms.flatMap(mapping => mapping[episode.num]?.map(split => split.num) ?? []);
    return [episode.num, [...new Set(numbers)].sort((a, b) => a - b)];
  }));
}

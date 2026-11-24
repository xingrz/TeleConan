export interface EpisodeSplit {
  num: number;
  maps_to: {
    episode_num: number;
    segment?: number;
  };
}

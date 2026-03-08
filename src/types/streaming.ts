export interface Streaming {
  num: number;
  title: string;
  href: string;
  maps_to: {
    episode_num: number;
    segment?: number;
  };
};

export interface Episode {
  num: number;
  title_jp: string;
  title_cn: string;
  aired_at: string; // yyyy-MM-dd
  duration: 30 | 60 | 90 | 120 | 150;
  sources: ({
    kind: 'original';
  } | {
    kind: 'manga' | string;
    ref: string;
  })[];
}

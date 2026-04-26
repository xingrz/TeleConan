<template>
  <article class="group relative grid gap-3 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-accent-subtle sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:px-5"
    :class="{ 'opacity-75': !aired }">
    <div class="flex items-center justify-between gap-3 sm:block">
      <div class="flex items-baseline gap-1">
        <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-text-tertiary">TV</span>
        <span class="text-xl font-semibold leading-none tabular-nums" :class="String(episode.num) == keyword ? 'text-accent' : 'text-text-primary'">
          {{ episode.num }}
        </span>
      </div>
      <time class="text-xs leading-5 text-text-tertiary tabular-nums sm:mt-2 sm:block" :datetime="episode.aired_at">{{ episode.aired_at }}</time>
    </div>

    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-1.5">
        <sp-tag v-if="episode.duration > 30" :episode="episode" />
        <source-tag :episode="episode" />
        <span v-if="!aired" class="inline-flex h-5 items-center rounded border border-border px-1.5 text-[11px] font-medium text-text-tertiary">{{ airCountdown }}</span>
      </div>

      <div class="mt-2 space-y-0.5">
        <highlight-text class="block text-[15px] font-medium leading-6 text-text-primary" :text="episode.title_jp" :highlight="keyword" lang="ja" />
        <highlight-text class="block text-sm leading-6 text-text-secondary" :text="episode.title_cn" :highlight="keyword" />
      </div>

      <div v-if="aired" class="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <a :href="`https://www.conanpedia.com/TV${episode.num}`" target="_blank" rel="noreferrer"
          class="episode-link">柯南百科</a>
        <streaming-links v-if="bilibiliLinks.length > 0" label="B站" :links="bilibiliLinks" />
        <streaming-links v-if="qqLinks.length > 0" label="腾讯" :links="qqLinks" />
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import SpTag from './SpTag.vue';
import SourceTag from './SourceTag.vue';
import HighlightText from './HighlightText.vue';
import StreamingLinks from './StreamingLinks.vue';

import type { Episode } from '@/types/episode';
import type { Streaming } from '@/types/streaming';

const props = defineProps<{
  episode: Episode;
  keyword: string;
  bilibili: Record<number, Streaming[]>;
  qq: Record<number, Streaming[]>;
}>();

const today = new Date().toISOString().slice(0, 10);
const aired = computed(() => props.episode.aired_at <= today);

const airCountdown = computed(() => {
  const airDate = new Date(props.episode.aired_at + 'T00:00:00');
  const now = new Date();
  const diffMs = airDate.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return '';
  if (days === 1) return '明天播出';
  if (days <= 7) return `${days}天后播出`;
  const weeks = Math.ceil(days / 7);
  if (weeks === 1) return '下周播出';
  return `${weeks}周后播出`;
});

const bilibiliLinks = computed(() => props.bilibili[props.episode.num] ?? []);
const qqLinks = computed(() => props.qq[props.episode.num] ?? []);
</script>

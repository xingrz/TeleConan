<template>
  <article class="group relative grid gap-3 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-accent-subtle sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-3"
    :class="{ 'episode-upcoming': !aired }">
    <div class="flex items-start justify-between gap-3 sm:block">
      <div>
        <div class="flex flex-wrap items-baseline gap-x-1 gap-y-2">
          <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-text-tertiary">TV</span>
          <span class="text-xl font-semibold leading-none tabular-nums" :class="String(episode.num) == keyword ? 'text-accent' : 'text-text-primary'">
            {{ episode.num }}
          </span>
          <span v-if="!aired" class="ml-1 text-xs font-semibold text-accent">未播出</span>
        </div>
        <div v-if="splitNumbers.length" class="mt-2 flex flex-wrap items-baseline gap-x-1 text-xs leading-5 text-text-secondary">
          <span class="tabular-nums"
            :class="{ 'font-semibold text-accent': splitNumbers.some(num => String(num) === keyword) }">{{ splitNumberLabel }}</span>
        </div>
      </div>
      <div class="shrink-0 text-right text-xs leading-5 text-text-tertiary sm:mt-2 sm:text-left">
        <time class="block tabular-nums" :datetime="episode.aired_at">{{ episode.aired_at }}</time>
        <span v-if="!aired" class="block text-text-secondary">{{ airCountdown }}</span>
      </div>
    </div>

    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-1.5">
        <sp-tag v-if="episode.duration > 30" :episode="episode" />
        <source-tag :episode="episode" />
      </div>

      <div class="mt-2 space-y-0.5">
        <highlight-text class="block text-[15px] font-medium leading-6 text-text-primary" :text="episode.title_jp" :highlight="keyword" lang="ja" />
        <highlight-text class="block text-sm leading-6 text-text-secondary" :text="episode.title_cn" :highlight="keyword" />
      </div>

      <div v-if="aired" class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <a :href="`https://www.conanpedia.com/TV${episode.num}`" target="_blank" rel="noreferrer"
          class="episode-link">柯南百科</a>
        <streaming-links v-if="bilibiliLinks.length > 0" label="B站" :links="bilibiliLinks" :keyword="keyword" />
        <streaming-links v-if="qqLinks.length > 0" label="腾讯" :links="qqLinks" :keyword="keyword" />
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';

import SpTag from './SpTag.vue';
import SourceTag from './SourceTag.vue';
import HighlightText from './HighlightText.vue';
import StreamingLinks from './StreamingLinks.vue';

import type { Episode } from '@/types/episode';
import type { Streaming } from '@/types/streaming';

const props = defineProps<{
  episode: Episode;
  keyword: string;
  today: string;
  splitNumbers: number[];
  bilibili: Record<number, Streaming[]>;
  qq: Record<number, Streaming[]>;
}>();

const splitNumberLabel = computed(() => {
  const numbers = props.splitNumbers;
  const start = numbers[0];
  if (numbers.length > 1 && numbers.every((num, index) => num === start! + index)) {
    return `${start}–${numbers[numbers.length - 1]}`;
  }
  return numbers.join('、');
});

const daysUntilAiring = computed(() => DateTime.fromISO(props.episode.aired_at)
  .diff(DateTime.fromISO(props.today), 'days').days);
const aired = computed(() => props.episode.aired_at <= props.today);

const airCountdown = computed(() => {
  const days = daysUntilAiring.value;
  if (days <= 0) return '';
  return days === 1 ? '明天播出' : `${days}天后播出`;
});

const bilibiliLinks = computed(() => props.bilibili[props.episode.num] ?? []);
const qqLinks = computed(() => props.qq[props.episode.num] ?? []);
</script>

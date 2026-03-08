<template>
  <div class="relative pl-4 pr-4 py-3.5 transition-all cursor-default group hover:bg-accent-subtle before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-accent before:scale-y-0 before:transition-transform hover:before:scale-y-100"
    :class="{ 'opacity-75': !aired }"
    style="content-visibility: auto; contain-intrinsic-size: 0 120px;">
    <!-- Row 1: number + date -->
    <div class="flex items-baseline justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="font-semibold tabular-nums" :class="String(episode.num) == keyword ? 'text-accent' : ''">
          {{ episode.num }}
        </span>
        <sp-tag v-if="episode.duration > 30" :episode="episode" />
        <source-tag :episode="episode" />
        <span v-if="!aired" class="text-[11px] text-text-tertiary italic">{{ airCountdown }}</span>
      </div>
      <span class="text-xs text-text-tertiary tabular-nums shrink-0">{{ episode.aired_at }}</span>
    </div>

    <!-- Row 2: titles -->
    <div class="mt-1">
      <highlight-text class="text-sm leading-relaxed" :text="episode.title_jp" :highlight="keyword" lang="ja" />
      <highlight-text class="text-sm text-text-secondary leading-relaxed" :text="episode.title_cn" :highlight="keyword" />
    </div>

    <!-- Row 3: links -->
    <div v-if="aired" class="flex items-center gap-2 mt-1.5 text-xs">
      <a :href="`https://www.conanpedia.com/TV${episode.num}`" target="_blank" rel="noreferrer"
        class="text-accent/70 underline decoration-accent/20 underline-offset-2 hover:text-accent hover:decoration-accent/50 transition-colors">柯南百科</a>
      <template v-for="s in links" :key="s.num">
        <span class="text-text-tertiary">·</span>
        <a :href="s.href" target="_blank" rel="noreferrer"
          class="text-accent/70 underline decoration-accent/20 underline-offset-2 hover:text-accent hover:decoration-accent/50 transition-colors" :title="s.title">
          B站<template v-if="links.length > 1"> #{{ s.num }}</template>
        </a>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import SpTag from './SpTag.vue';
import SourceTag from './SourceTag.vue';
import HighlightText from './HighlightText.vue';

import type { Episode } from '@/types/episode';
import type { Streaming } from '@/types/streaming';

const props = defineProps<{
  episode: Episode;
  keyword: string;
  bilibili: Record<number, Streaming[]>;
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

const links = computed(() => props.bilibili[props.episode.num] ?? []);
</script>

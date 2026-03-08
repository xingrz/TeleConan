<template>
  <template v-for="(source, i) in props.episode.sources" :key="i">
    <span class="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium leading-none" :class="getSourceClass(source)">
      {{ getSourceText(source) }}
    </span>
  </template>
</template>

<script lang="ts" setup>
import type { Episode } from '@/types/episode';

const props = defineProps<{
  episode: Episode;
}>();

function getSourceClass(source: Episode['sources'][number]): string {
  switch (source.kind) {
    case 'original': return 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400';
    case '特别篇': return 'bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400';
    case '魔术快斗': return 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400';
    case '警察学校篇': return 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400';
    default: return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400';
  }
}

function getSourceText(source: Episode['sources'][number]): string {
  const { kind, ref } = source as typeof source & { ref: string };
  if (kind == 'original') {
    return '原创';
  } else if (kind == 'manga') {
    return ref;
  } else {
    return `${kind} ${ref}`;
  }
}
</script>

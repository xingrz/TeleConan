<template>
  <template v-for="(source, i) in props.episode.sources" :key="i">
    <span class="inline-flex h-5 items-center rounded border px-1.5 text-[11px] font-medium leading-none" :class="getSourceClass(source)">
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
    case 'original': return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case '特别篇': return 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300';
    case '魔术快斗': return 'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300';
    case '警察学校篇': return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300';
    default: return 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300';
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

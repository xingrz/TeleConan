<template>
  <template v-for="(source, i) in props.episode.sources" :key="i">
    <span class="source-tag inline-flex h-5 items-center px-1.5 text-[11px] font-medium leading-none"
      :class="{ 'source-tag-original': source.kind === 'original', 'source-tag-manga': source.kind === 'manga' }">
      {{ getSourceText(source) }}
    </span>
  </template>
</template>

<script lang="ts" setup>
import type { Episode } from '@/types/episode';

const props = defineProps<{
  episode: Episode;
}>();

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

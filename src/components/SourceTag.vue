<template>
  <div v-for="source in props.episode.sources" :class="$style.source">
    <a-tag :color="getSourceColor(source)">{{ getSourceText(source) }}</a-tag>
  </div>
</template>

<script lang="ts" setup>
import type { Episode } from '@/types/episode';
import type { TagProps } from 'ant-design-vue';

const props = defineProps<{
  episode: Episode;
}>();

function getSourceColor(source: Episode['sources'][number]): TagProps['color'] {
  switch (source.kind) {
    case 'original': return 'orange';
    case '特别篇': return 'red';
    case '魔术快斗': return 'purple';
    case '警察学校篇': return 'cyan';
    default: return 'blue';
  }
}

function getSourceText(source: Episode['sources'][number]): string {
  const { kind, ref } = source as typeof source & { ref: string };
  if (kind == 'original') {
    return '动画原创';
  } else if (kind == 'manga') {
    return ref;
  } else {
    return `${kind} ${ref}`;
  }
}
</script>

<style lang="scss" module>
.source {
  margin-bottom: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>

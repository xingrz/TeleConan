<template>
  <div v-for="vol in props.episode.manga" :key="vol" :class="$style.manga">
    <a-tag :color="getMangaColor(vol)">{{ vol }}</a-tag>
  </div>
</template>

<script lang="ts" setup>
import type { Episode } from '@/types/episode';

const props = defineProps<{
  episode: Episode;
}>();

function getMangaColor(vol: string): string {
  if (vol == '动画原创') {
    return 'orange';
  } else if (vol.startsWith('特别篇')) {
    return 'red';
  } else if (vol.startsWith('魔术快斗')) {
    return 'purple';
  } else if (vol.startsWith('警察学校篇')) {
    return 'cyan';
  } else {
    return 'blue';
  }
}
</script>

<style lang="scss" module>
.manga {
  margin-bottom: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>

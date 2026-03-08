<template>
  <span v-if="sp" class="inline-block px-1.5 py-0.5 rounded-md text-xs font-medium" :class="sp.cls">
    {{ sp.text }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { Episode } from '@/types/episode';

const props = defineProps<{
  episode: Episode;
}>();

const sp = computed(() => {
  switch (props.episode.duration) {
    case 60: return { cls: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', text: '1HSP' };
    case 90: return { cls: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', text: '1.5HSP' };
    case 120: return { cls: 'bg-red-500/15 text-red-600 dark:text-red-400', text: '2HSP' };
    case 150: return { cls: 'bg-purple-500/15 text-purple-600 dark:text-purple-400', text: '2.5HSP' };
  }
});
</script>

<template>
  <span v-if="sp" class="inline-flex h-5 items-center rounded border px-1.5 text-[11px] font-semibold leading-none" :class="sp.cls">
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
    case 60: return { cls: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300', text: '1HSP' };
    case 90: return { cls: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300', text: '1.5HSP' };
    case 120: return { cls: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300', text: '2HSP' };
    case 150: return { cls: 'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300', text: '2.5HSP' };
  }
});
</script>

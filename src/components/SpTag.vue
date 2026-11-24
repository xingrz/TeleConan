<template>
  <span v-if="sp" class="inline-flex h-5 items-center border border-accent/30 bg-accent-subtle px-1.5 text-accent text-[11px] font-semibold leading-none">
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
    case 60: return { text: '1HSP' };
    case 90: return { text: '1.5HSP' };
    case 120: return { text: '2HSP' };
    case 150: return { text: '2.5HSP' };
  }
});
</script>

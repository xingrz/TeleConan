<template>
  <a-tag v-if="sp" :color="sp.color">{{ sp.text }}</a-tag>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { Episode } from '@/types/episode';

const props = defineProps<{
  episode: Episode;
}>();

const sp = computed(() => {
  switch (props.episode.num_cn.length) {
    case 2: return { color: 'orange', text: '1HSP' };
    case 3: return { color: 'orange', text: '1.5HSP' };
    case 4: return { color: 'red', text: '2HSP' };
    case 5: return { color: 'purple', text: '2.5HSP' };
  }
});
</script>

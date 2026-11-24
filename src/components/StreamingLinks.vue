<template>
  <span v-if="links.length" class="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
    <span class="text-text-tertiary">{{ label }}</span>
    <a v-for="link in links" :key="link.num" :href="link.href" target="_blank" rel="noreferrer"
      class="episode-link tabular-nums" :class="{ 'text-accent': String(link.num) === keyword }"
      :title="link.title" :aria-label="`${label} 第 ${link.num} 集：${link.title}`">
      {{ link.num }}
    </a>
  </span>
</template>

<script lang="ts" setup>
import type { Streaming } from '@/types/streaming';

defineProps<{
  label: string;
  links: Streaming[];
  keyword: string;
}>();
</script>

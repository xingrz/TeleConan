<template>
  <span>
    <template v-for="(part, i) in parts" :key="i">
      <mark v-if="part.highlight" class="rounded bg-accent-subtle px-0.5 font-semibold text-accent">{{ part.text }}</mark>
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  highlight?: string;
}>();

const parts = computed(() => {
  const highlight = props.highlight;
  if (!highlight) return [{ text: props.text, highlight: false }];

  const pieces: { text: string; highlight: boolean }[] = [];
  let start = 0;

  for (;;) {
    const index = props.text.indexOf(highlight, start);
    if (index === -1) break;
    if (index > start) {
      pieces.push({ text: props.text.slice(start, index), highlight: false });
    }
    pieces.push({ text: props.text.slice(index, index + highlight.length), highlight: true });
    start = index + highlight.length;
  }

  if (start < props.text.length) {
    pieces.push({ text: props.text.slice(start), highlight: false });
  }

  return pieces.length ? pieces : [{ text: props.text, highlight: false }];
});
</script>

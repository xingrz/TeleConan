<template>
  <div v-html="highlighted" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  highlight?: string;
}>();

const highlighted = computed(() => {
  return props.highlight
    ? props.text.replaceAll(props.highlight, `<span class="text-accent font-bold">${props.highlight}</span>`)
    : props.text;
});
</script>

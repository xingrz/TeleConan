<template>
  <div v-html="highlight(props.text)" />
</template>

<script lang="ts" setup>
import { defineProps, useCssModule } from 'vue';

const props = defineProps<{
  text: string;
  highlight?: string;
}>();

const style = useCssModule();
function highlight(text: string): string {
  return props.highlight
    ? text.replaceAll(props.highlight, `<span class="${style.highlight}">${props.highlight}</span>`)
    : text;
}
</script>

<style lang="scss" module>
.highlight {
  color: red;
  font-weight: bold;
}
</style>

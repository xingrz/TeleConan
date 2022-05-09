<template>
  <a-menu-item>
    <a :href="props.href" target="_blank" noreferer>
      <component :is="props.icon" /> &nbsp;
      <slot />
    </a>
  </a-menu-item>
</template>

<script lang="ts" setup>
import { defineProps, FunctionalComponent } from 'vue';

const props = defineProps<{
  icon: FunctionalComponent;
  href: string;
}>();
</script>

<template>
  <a-menu-item>
    <a :href="props.href" target="_blank" noreferer :class="$style.link">
      <template v-if="props.icon">
        <component :is="props.icon" /> &nbsp;
      </template>
      <slot />
    </a>
  </a-menu-item>
</template>

<script lang="ts" setup>
import type { FunctionalComponent } from 'vue';

const props = defineProps<{
  icon?: FunctionalComponent;
  href: string;
}>();
</script>

<style lang="scss" module>
.link {
  white-space: nowrap;
}
</style>

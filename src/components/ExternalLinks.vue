<template>
  <template v-if="items.length == 1">
    <link-menu-item :icon="icon" :href="items[0]!.href" :title="items[0]!.title"
      :key="props.keySuffix">
      {{ name }}
    </link-menu-item>
  </template>
  <template v-else-if="items.length > 1">
    <a-sub-menu :key="props.keySuffix">
      <template #title>
        <component :is="icon" /> &nbsp;
        {{ name }}
      </template>
      <template v-for="item in items" :key="`${props.keySuffix}-${item.num}`">
        <link-menu-item :href="item.href" :title="item.title">
          <slot :streaming="item" />
        </link-menu-item>
      </template>
    </a-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import { computed, type FunctionalComponent } from 'vue';

import LinkMenuItem from './LinkMenuItem.vue';

import type { Streaming } from '@/types/streaming';

const props = defineProps<{
  keySuffix: string;
  icon: FunctionalComponent;
  name: string;
  links: Record<number, Streaming[]>;
  episode: number;
}>();

const items = computed(() => {
  return props.links[props.episode] ?? [];
});
</script>

<template>
  <template v-if="episodes.length == 1">
    <link-menu-item :icon="icon" :href="props.links[episodes[0]].href" :title="props.links[episodes[0]].title"
      :key="props.keySuffix">
      {{ name }}
    </link-menu-item>
  </template>
  <template v-else-if="episodes.length > 1">
    <a-sub-menu :key="props.keySuffix">
      <template #title>
        <component :is="icon" /> &nbsp;
        {{ name }}
      </template>
      <template v-for="num in episodes" :key="`${props.keySuffix}-${num}`">
        <link-menu-item :href="props.links[num].href" :title="props.links[num].title">
          <slot :episode="num" :link="props.links[num]" />
        </link-menu-item>
      </template>
    </a-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import { defineProps, FunctionalComponent } from 'vue';

import LinkMenuItem from './LinkMenuItem.vue';

import { Link } from '@/types/link';
import { computed } from '@vue/reactivity';

const props = defineProps<{
  keySuffix: string;
  icon: FunctionalComponent;
  name: string;
  links: Record<number, Link>;
  episode: number | number[];
}>();

const episodes = computed(() => {
  const episodes = Array.isArray(props.episode) ? props.episode : [props.episode];
  return episodes.filter(ep => props.links[ep]);
});
</script>

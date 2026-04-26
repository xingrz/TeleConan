<template>
  <template v-if="props.links.length === 1">
    <a :href="props.links[0]!.href" target="_blank" rel="noreferrer"
      class="episode-link"
      :title="props.links[0]!.title">
      {{ props.label }}
    </a>
  </template>
  <div v-else-if="props.links.length > 1" class="relative inline-block" @mouseenter="openMenu"
    @mouseleave="closeMenu">
    <button type="button"
      class="episode-link cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-accent/20"
      @focus="openMenu" @blur="closeMenu">
      {{ props.label }} {{ props.links.length }} 集
    </button>
    <div
      class="absolute -left-2 top-full z-20 min-w-40 pt-1 transition-all"
      :class="open ? 'visible opacity-100 translate-y-0 pointer-events-auto' : 'invisible opacity-0 translate-y-1 pointer-events-none'">
      <div class="rounded-lg border border-border bg-surface-elevated p-1.5 shadow-lg shadow-black/8 dark:shadow-black/30">
        <a v-for="link in props.links" :key="link.num" :href="link.href" target="_blank" rel="noreferrer"
          class="block rounded-md px-2.5 py-1.5 text-text-secondary transition-colors hover:bg-accent-subtle hover:text-text-primary"
          :title="link.title" @click="closeMenu">
          {{ props.label }} #{{ link.num }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { Streaming } from '@/types/streaming';

const props = defineProps<{
  label: string;
  links: Streaming[];
}>();

const open = ref(false);

function openMenu() {
  open.value = true;
}

function closeMenu() {
  open.value = false;
}
</script>

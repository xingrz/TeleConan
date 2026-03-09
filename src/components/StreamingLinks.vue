<template>
  <template v-if="props.links.length === 1">
    <a :href="props.links[0]!.href" target="_blank" rel="noreferrer"
      class="text-accent/70 underline decoration-accent/20 underline-offset-2 hover:text-accent hover:decoration-accent/50 transition-colors"
      :title="props.links[0]!.title">
      {{ props.label }}
    </a>
  </template>
  <div v-else-if="props.links.length > 1" class="relative inline-block pb-px -mb-px" @mouseenter="openMenu"
    @mouseleave="closeMenu">
    <button type="button"
      class="cursor-pointer text-accent/70 underline decoration-accent/20 underline-offset-2 hover:text-accent hover:decoration-accent/50 transition-colors focus:outline-none select-none"
      @focus="openMenu" @blur="closeMenu">
      {{ props.label }} {{ props.links.length }} 集
    </button>
    <div
      class="absolute -left-4 top-full pt-0.5 min-w-40 z-20 transition-all"
      :class="open ? 'visible opacity-100 translate-y-0 pointer-events-auto' : 'invisible opacity-0 translate-y-1 pointer-events-none'">
      <div class="rounded-xl border border-border bg-surface-elevated p-1.5 shadow-lg shadow-black/5 dark:shadow-black/30">
        <a v-for="link in props.links" :key="link.num" :href="link.href" target="_blank" rel="noreferrer"
          class="block rounded-lg px-2.5 py-1.5 text-text-secondary hover:bg-accent-subtle hover:text-text-primary transition-colors"
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

<template>
  <div class="min-h-screen bg-surface text-text-primary">
    <!-- Hero header -->
    <header class="pt-12 pb-6 px-4 md:px-0">
      <div class="max-w-2xl mx-auto flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">TeleConan</h1>
          <p class="text-text-secondary mt-1">名侦探柯南 TV 动画集数索引</p>
          <p class="text-xs text-text-tertiary mt-2 space-x-1">
            <span>数据来源
              <a :href="WIKI_URL" target="_blank" rel="noreferrer" class="underline underline-offset-2 decoration-border hover:text-text-secondary transition-colors">维基百科</a>
              (CC BY-SA 3.0)</span>
            <span>·</span>
            <a :href="REPO_URL" target="_blank" class="underline underline-offset-2 decoration-border hover:text-text-secondary transition-colors">GitHub</a>
            <template v-if="stats.updated_at">
              <span>·</span>
              <span>更新于
                <a :href="`${REPO_URL}/actions/runs/${stats.workflow_run}`" target="_blank"
                  class="underline underline-offset-2 decoration-border hover:text-text-secondary transition-colors">{{ stats.updated_at }}</a>
              </span>
            </template>
          </p>
        </div>
        <button @click="toggle"
          class="mt-1 p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-accent-subtle transition-colors"
          :title="dark ? '切换为浅色' : '切换为深色'">
          <svg v-if="dark" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
          </svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Sticky search + filters -->
    <div class="sticky top-0 z-10 bg-surface/70 backdrop-blur-xl border-b border-transparent"
      :class="{ '!border-border': scrolled }">
      <div class="max-w-2xl mx-auto px-4 md:px-0 py-3">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none"
            viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd" />
          </svg>
          <input v-model="keyword" type="text" :placeholder="searchPlaceholder" autofocus
            class="w-full h-11 pl-11 pr-4 text-base bg-surface-elevated text-text-primary placeholder-text-tertiary rounded-xl border border-border outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            @blur="updateHistory(keyword)" @keydown.enter="updateHistory(keyword)" />
        </div>

        <!-- Filter chips -->
        <div class="flex flex-wrap gap-1.5 mt-2">
          <button v-for="f in SOURCE_FILTERS" :key="f.value"
            class="px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer select-none transition-all active:scale-95"
            :class="activeFilters.has(f.value)
              ? 'bg-accent text-white border-accent'
              : 'text-text-secondary border-border hover:border-text-tertiary hover:text-text-primary'"
            @click="toggleFilter(f.value)">
            {{ f.label }}
          </button>
          <button
            class="px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer select-none transition-all active:scale-95"
            :class="spOnly
              ? 'bg-accent text-white border-accent'
              : 'text-text-secondary border-border hover:border-text-tertiary hover:text-text-primary'"
            @click="spOnly = !spOnly">
            SP
          </button>
        </div>

        <p v-if="hasActiveFilter" class="text-xs text-text-tertiary mt-2">
          找到 {{ filtered.length }} 条结果
        </p>
      </div>
    </div>

    <!-- Episode list -->
    <div class="max-w-2xl mx-auto px-4 md:px-0 py-4">
      <div class="bg-surface-elevated rounded-2xl border border-border overflow-visible divide-y divide-border">
        <episode-card v-for="ep in filtered" :key="ep.num" :episode="ep" :keyword="keyword"
          :bilibili="bilibili" :qq="qq" />
      </div>
    </div>

    <!-- Info banner -->
    <div class="max-w-2xl mx-auto px-4 md:px-0 py-6">
      <div class="text-sm text-text-tertiary text-center">
        在找字幕编辑器吗？前往
        <a href="https://subtitle.xingrz.me/" class="text-accent hover:text-accent-hover transition-colors">subtitle.xingrz.me</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import EpisodeCard from '@/components/EpisodeCard.vue';

import { useSliceStore, fillSliceStore, useSliceGroupDict } from '@/composables/slices';
import useStats from '@/composables/useStats';
import useTheme from '@/composables/useTheme';
import { useHistory, updateHistory } from '@/composables/history';

import type { Episode } from '@/types/episode';
import type { Streaming } from '@/types/streaming';

const REPO_URL = 'https://github.com/xingrz/TeleConan';
const WIKI_URL = `https://zh.wikipedia.org/wiki/${encodeURIComponent('名偵探柯南動畫集數列表')}`;

const SOURCE_FILTERS = [
  { label: '原创', value: 'original' },
  { label: '漫改', value: 'manga' },
  { label: '特别篇', value: '特别篇' },
  { label: '魔术快斗', value: '魔术快斗' },
  { label: '警察学校篇', value: '警察学校篇' },
] as const;

type SourceFilterValue = typeof SOURCE_FILTERS[number]['value'];

const stats = useStats();
const { dark, toggle } = useTheme();

const scrolled = ref(false);
function onScroll() {
  scrolled.value = window.scrollY > 80;
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));

const episodes = useSliceStore<Episode>();
onMounted(async () => {
  await fillSliceStore(episodes, 'episode-latest');
});

const bilibiliStore = useSliceStore<Streaming>();
const bilibili = useSliceGroupDict<number, Streaming>(bilibiliStore, (s) => s.maps_to.episode_num);
onMounted(async () => {
  await fillSliceStore(bilibiliStore, 'bilibili-latest');
});

const qqStore = useSliceStore<Streaming>();
const qq = useSliceGroupDict<number, Streaming>(qqStore, (s) => s.maps_to.episode_num);
onMounted(async () => {
  await fillSliceStore(qqStore, 'qq-latest');
});

const keyword = ref('');
useHistory(keyword);

const activeFilters = reactive(new Set<SourceFilterValue>());
const spOnly = ref(false);

function toggleFilter(value: SourceFilterValue) {
  if (activeFilters.has(value)) {
    activeFilters.delete(value);
  } else {
    activeFilters.add(value);
  }
}

const hasActiveFilter = computed(() => keyword.value || activeFilters.size > 0 || spOnly.value);

const searchPlaceholder = computed(() => {
  return '搜索集数、标题、日期（2024）、漫画章节（V102）…';
});

const bilibiliNumSet = computed(() => {
  const set = new Set<number>();
  for (const s of bilibiliStore.data) {
    set.add(s.num);
  }
  return set;
});

const qqNumSet = computed(() => {
  const set = new Set<number>();
  for (const s of qqStore.data) {
    set.add(s.num);
  }
  return set;
});

// Parse keyword into structured query
const parsedQuery = computed(() => {
  const kw = keyword.value.trim();
  if (!kw) return null;

  const kwNum = parseInt(kw);

  // Date patterns: "2024", "2024-01", "2024-01-06"
  const dateMatch = kw.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);

  // Manga ref pattern: "V102", "V102-4", "File.1102" etc.
  const isMangaRef = /^[A-Za-z]/.test(kw);

  return { kw, kwNum, dateMatch, isMangaRef };
});

function matchesKeyword(item: Episode): boolean {
  const q = parsedQuery.value;
  if (!q) return true;

  // Date filter
  if (q.dateMatch) {
    return item.aired_at.startsWith(q.kw);
  }

  // Manga ref search (e.g. "V102", "File.1102")
  if (q.isMangaRef) {
    const kwUpper = q.kw.toUpperCase();
    return item.sources.some(s => {
      if (s.kind === 'original') return false;
      return (s as { ref: string }).ref.toUpperCase().includes(kwUpper);
    });
  }

  // Standard search: title, episode number, bilibili number
  return item.title_jp.includes(q.kw) ||
    item.title_cn.includes(q.kw) ||
    item.num == q.kwNum ||
    (!isNaN(q.kwNum) && bilibiliNumSet.value.has(q.kwNum) &&
      bilibili.value[item.num]?.some(s => s.num == q.kwNum) === true) ||
    (!isNaN(q.kwNum) && qqNumSet.value.has(q.kwNum) &&
      qq.value[item.num]?.some(s => s.num == q.kwNum) === true);
}

function matchesSourceFilter(item: Episode): boolean {
  if (activeFilters.size === 0) return true;
  return item.sources.some(s => {
    if (activeFilters.has('original') && s.kind === 'original') return true;
    if (activeFilters.has('manga') && s.kind === 'manga') return true;
    if (activeFilters.has('特别篇') && s.kind === '特别篇') return true;
    if (activeFilters.has('魔术快斗') && s.kind === '魔术快斗') return true;
    if (activeFilters.has('警察学校篇') && s.kind === '警察学校篇') return true;
    return false;
  });
}

function matchesSpFilter(item: Episode): boolean {
  if (!spOnly.value) return true;
  return item.duration > 30;
}

const filtered = computed<Episode[]>(() => {
  const result = episodes.data.filter(item =>
    matchesKeyword(item) && matchesSourceFilter(item) && matchesSpFilter(item)
  );
  return result.reverse();
});
</script>

<template>
  <div class="min-h-screen bg-surface text-text-primary antialiased">
    <header class="border-b border-border bg-surface-elevated/90 backdrop-blur">
      <div class="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-3">
              <span class="h-9 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <div>
                <h1 class="text-2xl font-semibold leading-tight tracking-normal sm:text-3xl">TeleConan</h1>
                <p class="mt-1 text-sm leading-6 text-text-secondary">名侦探柯南 TV 动画集数索引</p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs leading-5 text-text-tertiary">
              <span>数据来源</span>
              <span>
                <a :href="WIKI_URL" target="_blank" rel="noreferrer" class="meta-link">维基百科</a>
                <span> (</span><a :href="LICENSE_URL" target="_blank" rel="noreferrer" class="meta-link">CC BY-SA 3.0</a><span>)</span>
              </span>
              <span>·</span>
              <a :href="REPO_URL" target="_blank" rel="noreferrer" class="meta-link">GitHub</a>
              <template v-if="stats.updated_at">
                <span>·</span>
                <span>更新于
                  <a :href="`${REPO_URL}/actions/runs/${stats.workflow_run}`" target="_blank"
                    rel="noreferrer" class="meta-link">{{ stats.updated_at }}</a>
                </span>
              </template>
            </div>
          </div>

          <button @click="toggle"
            class="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
            :title="dark ? '切换为浅色' : '切换为深色'"
            :aria-label="dark ? '切换为浅色' : '切换为深色'">
            <svg v-if="dark" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <section class="sticky top-0 z-20 border-b border-border bg-surface-elevated/90 backdrop-blur">
      <div class="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8" @focusin="openSearchPanel" @focusout="closeSearchPanel">
        <div class="search-panel" :class="{ 'search-panel-expanded': searchExpanded }">
          <div class="search-field" :class="{ 'search-field-expanded': searchExpanded }">
            <svg class="h-5 w-5 shrink-0 text-text-tertiary"
              viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd" />
            </svg>

            <button v-for="f in activeSourceFilterList" :key="f.value" type="button"
              class="search-token" @pointerdown.prevent @click="removeSourceFilter(f.value)">
              <span>{{ f.label }}</span>
              <span aria-hidden="true">×</span>
            </button>
            <button v-if="spOnly" type="button" class="search-token" @pointerdown.prevent @click="removeSpFilter">
              <span>SP</span>
              <span aria-hidden="true">×</span>
            </button>

            <input ref="searchInput" v-model="keyword" type="search" :placeholder="activeTokenCount ? '' : searchPlaceholder"
              class="search-input min-w-24 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-tertiary"
              @blur="updateHistory(keyword)" @keydown.enter="updateHistory(keyword)" />

            <span class="ml-auto shrink-0 text-xs font-semibold text-text-secondary">{{ resultCountLabel }}</span>

            <button v-if="keyword" type="button"
              class="grid h-7 w-7 shrink-0 place-items-center rounded-md text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary"
              aria-label="清空搜索" @click="clearKeyword">
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          <div v-if="searchExpanded" class="mt-3 flex flex-wrap items-center gap-1.5">
            <button v-for="f in SOURCE_FILTERS" :key="f.value" type="button"
              class="filter-chip"
              :class="activeFilters.has(f.value) ? 'filter-chip-active' : 'filter-chip-idle'"
              @click="toggleFilter(f.value)">
              {{ f.label }}
            </button>
            <button type="button"
              class="filter-chip"
              :class="spOnly ? 'filter-chip-active' : 'filter-chip-idle'"
              @click="spOnly = !spOnly">
              SP
            </button>
            <button v-if="hasActiveFilter" type="button" class="ml-auto h-8 px-2 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
              @click="clearFilters">
              重置
            </button>
          </div>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-text-secondary">剧集列表</h2>
        <p class="text-xs text-text-tertiary">最新剧集在前</p>
      </div>

      <div v-if="isLoading" class="mt-3 overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm">
        <div v-for="i in 8" :key="i" class="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
          <div class="h-5 w-16 animate-pulse rounded bg-surface-muted" />
          <div class="space-y-2">
            <div class="h-4 w-3/4 animate-pulse rounded bg-surface-muted" />
            <div class="h-4 w-1/2 animate-pulse rounded bg-surface-muted" />
          </div>
        </div>
      </div>

      <div v-else-if="filtered.length === 0" class="mt-3 rounded-lg border border-border bg-surface-elevated px-6 py-12 text-center shadow-sm">
        <p class="text-sm font-medium text-text-primary">没有匹配的剧集</p>
        <p class="mt-2 text-sm text-text-tertiary">换一个集数、标题、日期或漫画卷数试试。</p>
      </div>

      <div v-else class="mt-3 overflow-visible rounded-lg border border-border bg-surface-elevated shadow-sm">
        <episode-card v-for="ep in filtered" :key="ep.num" :episode="ep" :keyword="keyword.trim()"
          :bilibili="bilibili" :qq="qq" />
      </div>
    </main>

    <footer class="mx-auto max-w-5xl px-4 pb-8 pt-2 text-center text-sm text-text-tertiary sm:px-6 lg:px-8">
      <p>
        在找字幕编辑器吗？前往
        <a href="https://subtitle.xingrz.me/" class="text-accent transition-colors hover:text-accent-hover">subtitle.xingrz.me</a>
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';

import EpisodeCard from '@/components/EpisodeCard.vue';

import { useSliceStore, fillSliceStore, useSliceGroupDict } from '@/composables/slices';
import useStats from '@/composables/useStats';
import useTheme from '@/composables/useTheme';
import { useHistory, updateHistory } from '@/composables/history';

import type { Episode } from '@/types/episode';
import type { Streaming } from '@/types/streaming';

const REPO_URL = 'https://github.com/xingrz/TeleConan';
const WIKI_URL = `https://zh.wikipedia.org/wiki/${encodeURIComponent('名偵探柯南動畫集數列表')}`;
const LICENSE_URL = 'https://creativecommons.org/licenses/by-sa/3.0/deed.zh-hans';

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
const searchFocused = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

function toggleFilter(value: SourceFilterValue) {
  if (activeFilters.has(value)) {
    activeFilters.delete(value);
  } else {
    activeFilters.add(value);
  }
}

function removeSourceFilter(value: SourceFilterValue) {
  activeFilters.delete(value);
  focusSearchInput();
}

function removeSpFilter() {
  spOnly.value = false;
  focusSearchInput();
}

function focusSearchInput() {
  requestAnimationFrame(() => searchInput.value?.focus());
}

function openSearchPanel() {
  searchFocused.value = true;
}

function closeSearchPanel(event: FocusEvent) {
  const current = event.currentTarget as HTMLElement | null;
  const next = event.relatedTarget as Node | null;
  if (current && next && current.contains(next)) return;
  searchFocused.value = false;
  updateHistory(keyword.value);
}

const hasActiveFilter = computed(() => keyword.value.trim().length > 0 || activeFilters.size > 0 || spOnly.value);

const searchExpanded = computed(() => searchFocused.value);

const activeSourceFilterList = computed(() => SOURCE_FILTERS.filter(f => activeFilters.has(f.value)));

const activeTokenCount = computed(() => activeSourceFilterList.value.length + (spOnly.value ? 1 : 0));

const searchPlaceholder = computed(() => {
  return '集数 / 标题 / 日期 / 漫画';
});

const isLoading = computed(() => episodes.data.length === 0);

const totalEpisodes = computed(() => episodes.data.length);

const resultCountLabel = computed(() => {
  if (isLoading.value) return '加载中';
  if (hasActiveFilter.value) return `${filtered.value.length} 条结果`;
  return `${totalEpisodes.value} 集`;
});

function clearKeyword() {
  keyword.value = '';
  updateHistory(keyword.value);
}

function clearFilters() {
  keyword.value = '';
  activeFilters.clear();
  spOnly.value = false;
  updateHistory(keyword.value);
}

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

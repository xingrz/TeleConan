<template>
  <a-affix :offset-top="8">
    <a-input v-model:value="keyword" placeholder="输入集数或标题关键词搜索" autofocus :class="$style.entry"
      @blur="() => updateHistory(keyword)" @press-enter="() => updateHistory(keyword)" />
  </a-affix>

  <a-table :columns="columns" :data-source="filtered" row-key="num" :class="$style.table">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex == 'aired_at'">
        {{ record.aired_at }}
      </template>
      <template v-else-if="column.dataIndex == 'num'">
        <div :class="{ [$style.highlight]: String(record.num) == keyword }">{{ record.num }}</div>
        <div v-if="record.duration > 30" :class="$style.sp">
          <sp-tag :episode="record" />
        </div>
      </template>
      <template v-else-if="column.dataIndex == 'sources'">
        <source-tag :episode="record" />
      </template>
      <template v-else-if="column.key == 'title'">
        <highlight-text :text="record.title_jp" :highlight="keyword" lang="ja" />
        <highlight-text :text="record.title_cn" :highlight="keyword" />
      </template>
      <template v-else-if="column.key == 'links'">
        <a-dropdown placement="bottomRight">
          <a class="ant-dropdown-link" @click.prevent>
            链接
            <down-outlined />
          </a>
          <template #overlay>
            <a-menu>
              <link-menu-item :icon="FileTextOutlined" :href="`https://www.conanpedia.com/TV${record.num}`">
                柯南百科
              </link-menu-item>
              <external-links :icon="PlaySquareOutlined" name="哔哩哔哩" :episode="record.num" :links="bilibili"
                key-suffix="bilibili">
                <template v-slot="{ streaming }">
                  第 {{ streaming.num }} 集
                </template>
              </external-links>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>

  <a-alert type="info" show-icon :class="$style.subtitle">
    <template #message>
      在找字幕编辑器吗？它已经被移到了 <b><a href="https://subtitle.xingrz.me/">subtitle.xingrz.me</a></b>。
    </template>
  </a-alert>

  <section :class="$style.copyright">
    <p>本页面的数据主要来源<a :href="WIKI_URL" target="_blank" noreferer>维基百科</a>，遵循 <a :href="BY_SA_URL" target="_blank"
        noreferer>CC BY-SA 3.0</a> 提供。
    </p>
    <p>本站源代码托管于 <a :href="REPO_URL" target="_blank">GitHub</a>，遵循 <a :href="`${REPO_URL}/blob/master/LICENSE`"
        target="_blank">GPL-3.0</a> 发布。</p>
    <p v-if="stats.updated_at" :style="{ marginTop: '8px' }">数据更新于 <a
        :href="`${REPO_URL}/actions/runs/${stats.workflow_run}`" target="_blank">{{ stats.updated_at }}</a>。</p>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { DownOutlined, FileTextOutlined, PlaySquareOutlined } from '@ant-design/icons-vue';

import SpTag from '@/components/SpTag.vue';
import SourceTag from '@/components/SourceTag.vue';
import HighlightText from '@/components/HighlightText.vue';
import LinkMenuItem from '@/components/LinkMenuItem.vue';
import ExternalLinks from '@/components/ExternalLinks.vue';

import { useSliceStore, fillSliceStore, useSliceGroupDict } from '@/composables/slices';
import useStats from '@/composables/useStats';
import { useHistory, updateHistory } from '@/composables/history';

import type { Episode } from '@/types/episode';
import type { Streaming } from '@/types/streaming';

const REPO_URL = 'https://github.com/xingrz/TeleConan';
const WIKI_URL = `https://zh.wikipedia.org/wiki/${encodeURIComponent('名偵探柯南動畫集數列表')}`;
const BY_SA_URL = 'https://creativecommons.org/licenses/by-sa/3.0/deed.zh';

const columns = [
  {
    title: '播出日',
    dataIndex: 'aired_at',
    width: '10em',
  },
  {
    title: '集数',
    dataIndex: 'num',
    width: '8em',
    align: 'center',
  },
  {
    title: '对应原作',
    dataIndex: 'sources',
    width: '10em',
  },
  {
    title: '标题',
    key: 'title',
  },
  {
    key: 'links',
    width: '8em',
  }
];

const stats = useStats();

const episodes = useSliceStore<Episode>();
onMounted(async () => {
  await fillSliceStore(episodes, 'episode-latest');
});

const bilibiliStore = useSliceStore<Streaming>();
const bilibili = useSliceGroupDict<number, Streaming>(bilibiliStore, (s) => s.maps_to.episode_num);
onMounted(async () => {
  await fillSliceStore(bilibiliStore, 'bilibili-latest');
});

const keyword = ref('');
useHistory(keyword);

const bilibiliNumSet = computed(() => {
  const set = new Set<number>();
  for (const s of bilibiliStore.data) {
    set.add(s.num);
  }
  return set;
});

const filtered = computed<Episode[]>(() => {
  if (keyword.value) {
    const kw = keyword.value;
    const kwNum = parseInt(kw);
    return episodes.data.filter(item => {
      return item.title_jp.includes(kw) ||
        item.title_cn.includes(kw) ||
        item.num == kwNum ||
        (!isNaN(kwNum) && bilibiliNumSet.value.has(kwNum) &&
          bilibili.value[item.num]?.some(s => s.num == kwNum));
    }).reverse();
  } else {
    return [...episodes.data].reverse();
  }
});
</script>

<style lang="scss" module>
:global(html, body) {
  margin: 0;
  padding: 0;
}

:global(body) {
  background: #f0f2f5;
}

:global(#app) {
  padding: 32px 50px;
  margin: 0 auto;
  max-width: 1200px;
}

.subtitle {
  margin-top: 24px;
}

.entry {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 0;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
}

:global(.ant-affix) .entry {
  border-radius: 4px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.30);
}

.entry:focus {
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.30);
}

.table {
  margin-top: 36px;
}

.sp {
  :global(.ant-tag) {
    margin: 0;
  }
}

.highlight {
  color: red;
  font-weight: bold;
}

.copyright {
  margin-top: 36px;
  color: #999;
  font-size: 12px;

  p {
    margin-bottom: 0;
  }

  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>

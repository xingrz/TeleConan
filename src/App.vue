<template>
  <a-layout>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '24px' }">
      <a-alert type="info" show-icon :class="$style.subtitle">
        <template #message>
          在找字幕编辑器吗？它已经被移到了 <b><a href="https://subtitle.xingrz.me/">subtitle.xingrz.me</a></b>。
        </template>
      </a-alert>

      <a-input v-model:value="keyword" placeholder="输入官方集数、拆分集数或标题关键词搜索" autofocus :class="$style.entry" />

      <a-table :columns="columns" :data-source="filtered" row-key="num_jp" :expand-row-by-click="true"
        :class="$style.table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'aired_at'">
            {{ record.aired_at }}
          </template>
          <template v-else-if="column.dataIndex == 'num_jp'">
            <span v-html="highlight(String(record.num_jp))" />
          </template>
          <template v-else-if="column.dataIndex == 'num_cn'">
            <span v-html="highlight(record.num_cn.join('<br />'))" />
          </template>
          <template v-else-if="column.dataIndex == 'manga'">
            <div v-for="(vol, i) in record.manga" :key="vol">
              <a-tag :color="getMangaColor(vol)">{{ vol }}</a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex == 'title_jp'">
            <span v-html="highlight(record.title_jp)" />
          </template>
          <template v-else-if="column.dataIndex == 'title_cn'">
            <span v-html="highlight(record.title_cn)" />
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <h4>相关链接</h4>
          <ul :class="$style.links">
            <li><a :href="`https://www.conanpedia.com/TV${record.num_jp}`" target="_blank" noreferer>资料：柯南百科</a></li>
          </ul>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useCssModule } from 'vue';

import { useSliceStore, loadEntry, loadSlice } from './slices';
import { Episode } from './episodes';

const columns = [
  {
    title: '播出日',
    dataIndex: 'aired_at',
    width: '10em',
  },
  {
    title: '官方集数',
    dataIndex: 'num_jp',
    width: '8em',
  },
  {
    title: '拆分集数',
    dataIndex: 'num_cn',
    width: '8em',
  },
  {
    title: '对应漫画',
    dataIndex: 'manga',
    width: '10em',
  },
  {
    title: '日文标题',
    dataIndex: 'title_jp',
  },
  {
    title: '中文标题',
    dataIndex: 'title_cn',
  },
];

const episodes = useSliceStore<Episode>();
onMounted(async () => {
  let next = await loadEntry(episodes, 'episode-latest');
  while (next) {
    next = await loadSlice(episodes);
  }
});

const keyword = ref('');
const filtered = computed<Episode[]>(() => {
  if (keyword.value) {
    return episodes.data.filter(item => {
      return item.title_jp.includes(keyword.value) ||
        item.title_cn.includes(keyword.value) ||
        item.num_jp == parseInt(keyword.value) ||
        item.num_cn.includes(parseInt(keyword.value));
    }).reverse();
  } else {
    return [...episodes.data].reverse();
  }
});

const style = useCssModule();
function highlight(text: string): string {
  return text.replaceAll(keyword.value, `<span class="${style.highlight}">${keyword.value}</span>`);
}

function getMangaColor(vol: string): string {
  if (vol == '动画原创') {
    return 'orange';
  } else if (vol.startsWith('特别篇')) {
    return 'red';
  } else if (vol.startsWith('魔术快斗')) {
    return 'purple';
  } else if (vol.startsWith('警察学校篇')) {
    return 'cyan';
  } else {
    return 'blue';
  }
}
</script>

<style lang="scss" module>
:global(body) {
  background: #f0f2f5;
}

.subtitle {
  margin-bottom: 24px;
}

.entry {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 4px;

  & {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
  }

  &:focus {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
  }
}

.table {
  margin-top: 36px;

  :global(tr.ant-table-row) {
    cursor: pointer;
  }
}

.highlight {
  color: red;
  font-weight: bold;
}

.links {
  margin-bottom: 0;
  padding-left: 1em;
}
</style>

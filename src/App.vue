<template>
  <a-input v-model:value="keyword" placeholder="输入官方集数、拆分集数或标题关键词搜索" autofocus :class="$style.entry" />

  <a-table :columns="columns" :data-source="filtered" row-key="num_jp" :expand-row-by-click="true"
    :class="$style.table">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex == 'aired_at'">
        {{ record.aired_at }}
      </template>
      <template v-else-if="column.dataIndex == 'num_jp'">
        <div :class="{ [$style.highlight]: String(record.num_jp) == keyword }">{{ record.num_jp }}</div>
        <div v-if="record.num_cn.length > 1" :class="$style.sp">
          <a-tag color="orange" v-if="record.num_cn.length == 2">1HSP</a-tag>
          <a-tag color="orange" v-else-if="record.num_cn.length == 3">1.5HSP</a-tag>
          <a-tag color="red" v-else-if="record.num_cn.length == 4">2HSP</a-tag>
          <a-tag color="purple" v-else-if="record.num_cn.length == 5">2.5HSP</a-tag>
        </div>
      </template>
      <template v-else-if="column.dataIndex == 'num_cn'">
        <template v-for="num in record.num_cn" :key="num">
          <div :class="{ [$style.highlight]: String(num) == keyword }">{{ num }}</div>
        </template>
      </template>
      <template v-else-if="column.dataIndex == 'manga'">
        <div v-for="(vol, i) in record.manga" :key="vol" :class="$style.manga">
          <a-tag :color="getMangaColor(vol)">{{ vol }}</a-tag>
        </div>
      </template>
      <template v-else-if="column.dataIndex == 'title'">
        <div v-html="highlight(record.title_jp)" lang="ja" />
        <div v-html="highlight(record.title_cn)" />
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <h4>相关链接</h4>
      <ul :class="$style.links">
        <li><a :href="`https://www.conanpedia.com/TV${record.num_jp}`" target="_blank" noreferer>资料：柯南百科</a></li>
      </ul>
    </template>
  </a-table>

  <a-alert type="info" show-icon :class="$style.subtitle">
    <template #message>
      在找字幕编辑器吗？它已经被移到了 <b><a href="https://subtitle.xingrz.me/">subtitle.xingrz.me</a></b>。
    </template>
  </a-alert>
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
    align: 'center',
  },
  {
    title: '拆分集数',
    dataIndex: 'num_cn',
    width: '8em',
    align: 'center',
  },
  {
    title: '对应漫画',
    dataIndex: 'manga',
    width: '10em',
  },
  {
    title: '标题',
    dataIndex: 'title',
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
  return keyword.value
    ? text.replaceAll(keyword.value, `<span class="${style.highlight}">${keyword.value}</span>`)
    : text;
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

.sp {
  :global(.ant-tag) {
    margin: 0;
  }
}

.manga {
  margin-bottom: 4px;

  &:last-of-type {
    margin-bottom: 0;
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

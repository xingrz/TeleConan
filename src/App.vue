<template>
  <div :class="$style.main">
    <v-alert type="info" variant="outlined" :class="$style.subtitle">
      在找字幕编辑器吗？它已经被移到了 <b><a href="https://subtitle.xingrz.me/">subtitle.xingrz.me</a></b>。
    </v-alert>

    <input type="text" v-model="keyword" placeholder="输入官方集数、拆分集数或标题关键词搜索" autofocus :class="$style.entry"
      class="elevation-4" />

    <v-table :style="{ marginTop: '50px' }">
      <thead>
        <tr>
          <th class="text-left" :style="{ width: '10em' }">播出日</th>
          <th class="text-left" :style="{ width: '8em' }">官方集数</th>
          <th class="text-left" :style="{ width: '8em' }">拆分集数</th>
          <th class="text-left" :style="{ width: '10em' }">对应漫画</th>
          <th class="text-left">日文标题</th>
          <th class="text-left">中文标题</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filtered" :key="item.num_jp">
          <td>{{ item.aired_at }}</td>
          <td v-html="highlight(String(item.num_jp))" />
          <td v-html="highlight(item.num_cn.join('<br />'))" />
          <td v-html="highlight(item.manga.join('<br />'))" />
          <td v-html="highlight(item.title_jp)" />
          <td v-html="highlight(item.title_cn)" />
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useCssModule } from 'vue';

import { useSliceStore, loadEntry, loadSlice } from './slices';
import { Episode } from './episodes';

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
      return item.title_cn.includes(keyword.value) ||
        item.title_jp.includes(keyword.value) ||
        String(item.num_cn) == keyword.value ||
        String(item.num_jp) == keyword.value;
    }).reverse();
  } else {
    return [...episodes.data].reverse().slice(0, 5);
  }
});

const style = useCssModule();
function highlight(text: string): string {
  return text.replaceAll(keyword.value, `<span class="${style.highlight}">${keyword.value}</span>`);
}
</script>

<style lang="scss" module>
.main {
  margin: 50px 50px;
}

.subtitle {
  margin-bottom: 50px;

  a,
  a:visited {
    color: inherit;
  }
}

.entry {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 4px;
}

.highlight {
  color: red;
  font-weight: bold;
}
</style>

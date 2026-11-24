import { onMounted, onUnmounted, type Ref } from 'vue';

export function updateHistory(keyword: string): void {
  const url = new URL(location.href);
  if (keyword) url.searchParams.set('q', keyword);
  else url.searchParams.delete('q');
  const target = `${url.pathname}${url.search}${url.hash}`;
  if (target !== `${location.pathname}${location.search}${location.hash}`) {
    history.pushState({}, '', target);
  }
}

export function useHistory(keyword: Ref<string>): void {
  function restore() {
    keyword.value = new URLSearchParams(location.search).get('q') || '';
  }

  onMounted(() => {
    restore();
    window.addEventListener('popstate', restore);
  });
  onUnmounted(() => window.removeEventListener('popstate', restore));
}

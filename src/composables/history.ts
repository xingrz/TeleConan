import { onMounted, Ref } from "vue";

export function updateHistory(keyword: string): void {
  history.pushState({}, '', keyword ? `/?q=${keyword}` : '/');
}

export function useHistory(keyword: Ref<string>): void {
  onMounted(() => {
    keyword.value = new URLSearchParams(location.search).get('q') || '';
  });
}

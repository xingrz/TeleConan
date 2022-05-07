import { reactive, toRefs, UnwrapRef, UnwrapNestedRefs } from 'vue';
import http from 'ky';

export interface DataSlice<T> {
  data: T[];
  next: string | undefined;
}

export function useSliceStore<T>() {
  return reactive<DataSlice<T>>({
    data: [],
    next: undefined,
  });
}

export async function loadEntry<T>(store: UnwrapNestedRefs<DataSlice<T>>, name: string): Promise<boolean> {
  const t = Math.round(Number(new Date()) / 1000 / 60 / 60);
  const slice = await http.get(`/data/e.${name}.json?t=${t}`).json<UnwrapRef<DataSlice<T>>>();
  store.data = slice.data;
  store.next = slice.next;
  return !!store.next;
}

export async function loadSlice<T>(store: UnwrapNestedRefs<DataSlice<T>>): Promise<boolean> {
  if (!store.next) return false;
  const slice = await http.get(`/data/s.${store.next}.json`).json<UnwrapRef<DataSlice<T>>>();
  store.data = [...slice.data, ...store.data];
  store.next = slice.next;
  return !!store.next;
}

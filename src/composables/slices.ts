import {
  computed,
  reactive,
  type Ref,
  type UnwrapNestedRefs,
  type UnwrapRef,
} from 'vue';
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

async function loadEntry<T>(store: UnwrapNestedRefs<DataSlice<T>>, name: string): Promise<boolean> {
  const t = Math.round(Number(new Date()) / 1000 / 60 / 60);
  const slice = await http.get(`/data/e.${name}.json?t=${t}`).json<UnwrapRef<DataSlice<T>>>();
  store.data = slice.data;
  store.next = slice.next;
  return !!store.next;
}

async function loadSlice<T>(store: UnwrapNestedRefs<DataSlice<T>>): Promise<boolean> {
  if (!store.next) return false;
  const slice = await http.get(`/data/s.${store.next}.json`).json<UnwrapRef<DataSlice<T>>>();
  store.data = [...slice.data, ...store.data];
  store.next = slice.next;
  return !!store.next;
}

export async function fillSliceStore<T>(store: UnwrapNestedRefs<DataSlice<T>>, name: string): Promise<void> {
  let next = await loadEntry(store, name);
  while (next) {
    next = await loadSlice(store);
  }
}

export function useSliceDict<K extends string | number, T>(store: UnwrapNestedRefs<DataSlice<T>>, key: keyof T): Readonly<Ref<UnwrapRef<Record<K, T>>>> {
  return computed(() => store.data.reduce((acc, cur) => {
    (acc as Record<K, T>)[(cur as any)[key] as K] = cur as T;
    return acc;
  }, {} as UnwrapRef<Record<K, T>>));
}

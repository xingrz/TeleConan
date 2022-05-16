import { Ref, ref, UnwrapNestedRefs, UnwrapRef } from 'vue';
import { DataSlice } from './slices';

export function useSliceDict<K extends string | number, T>(
  value = {} as Record<K, T>): Ref<UnwrapRef<Record<K, T>>> {
  return ref<Record<K, T>>(value);
}

export function fillSliceDict<K extends string | number, T>(
  dict: Ref<UnwrapRef<Record<K, T>>>,
  store: UnwrapNestedRefs<DataSlice<T>>,
  key: keyof T): void {
  dict.value = store.data.reduce((acc, cur) => {
    (acc as Record<K, T>)[cur[key] as K] = cur as T;
    return acc;
  }, {} as UnwrapRef<Record<K, T>>);
}

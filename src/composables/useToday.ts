import { onMounted, onUnmounted, ref } from 'vue';
import { DateTime } from 'luxon';

export default function useToday() {
  const today = ref(DateTime.local().toISODate()!);
  let timer: ReturnType<typeof setTimeout>;

  function update() {
    const now = DateTime.local();
    today.value = now.toISODate()!;
    const midnight = now.plus({ days: 1 }).startOf('day');
    timer = setTimeout(update, midnight.toMillis() - now.toMillis());
  }

  onMounted(update);
  onUnmounted(() => clearTimeout(timer));

  return today;
}

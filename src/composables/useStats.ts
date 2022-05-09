import { onMounted, Ref, ref } from 'vue';
import http from 'ky';
import { DateTime } from 'luxon';

interface Stats {
  updated_at: string;
  workflow_run: string;
}

export default function useStats(): Ref<Partial<Stats>> {
  const stats = ref<Partial<Stats>>({});
  onMounted(async () => {
    const t = Math.round(Number(new Date()) / 1000 / 60 / 60);
    const data = await http.get(`/data/stats.json?t=${t}`).json<Stats>();
    stats.value = {
      updated_at: DateTime.fromISO(data.updated_at).toFormat('yyyy-MM-dd HH:mm:ss'),
      workflow_run: data.workflow_run,
    };
  });
  return stats;
}

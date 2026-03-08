import { computed, ref, watch, onMounted, onUnmounted } from 'vue';

const dark = ref(false);

function systemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function apply() {
  const override = localStorage.getItem('theme');
  if (override) {
    // Override differs from system → use it; matches system → clear it
    const overrideDark = override === 'dark';
    if (overrideDark === systemDark()) {
      localStorage.removeItem('theme');
    }
    dark.value = overrideDark;
  } else {
    dark.value = systemDark();
  }
  document.documentElement.classList.toggle('dark', dark.value);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', dark.value ? 'dark' : 'light');
}

export default function useTheme() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  onMounted(() => {
    apply();
    mq.addEventListener('change', apply);
  });

  onUnmounted(() => {
    mq.removeEventListener('change', apply);
  });

  function toggle() {
    const next = !dark.value;
    // If next differs from system, persist; otherwise system already matches
    if (next !== systemDark()) {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } else {
      localStorage.removeItem('theme');
    }
    dark.value = next;
    document.documentElement.classList.toggle('dark', dark.value);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', dark.value ? 'dark' : 'light');
  }

  const icon = computed(() => dark.value ? 'moon' : 'sun');

  return { dark, icon, toggle };
}

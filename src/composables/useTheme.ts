import { computed, ref, onMounted, onUnmounted } from 'vue';

const dark = ref(false);
let themeFrame: number | undefined;

function renderTheme() {
  if (themeFrame !== undefined) cancelAnimationFrame(themeFrame);

  const root = document.documentElement;
  root.classList.add('theme-changing');
  root.classList.toggle('dark', dark.value);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', dark.value ? 'dark' : 'light');

  // Restore hover transitions after the new palette has been painted.
  themeFrame = requestAnimationFrame(() => {
    themeFrame = requestAnimationFrame(() => {
      root.classList.remove('theme-changing');
      themeFrame = undefined;
    });
  });
}

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
  renderTheme();
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
    renderTheme();
  }

  const icon = computed(() => dark.value ? 'moon' : 'sun');

  return { dark, icon, toggle };
}

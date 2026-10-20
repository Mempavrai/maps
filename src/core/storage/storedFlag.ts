import { ref, watch, type Ref } from 'vue'

export function storedFlag(key: string, fallback: boolean): Ref<boolean> {
  let initial = fallback
  try {
    const stored = localStorage.getItem(key)
    initial = stored === null ? fallback : stored === 'true'
  } catch {
    // Storage unavailable — fall back to the default
  }
  const flag = ref(initial)
  watch(flag, (value) => {
    try {
      localStorage.setItem(key, String(value))
    } catch {
      // localStorage full or unavailable — the state then only lasts for the session
    }
  })
  return flag
}

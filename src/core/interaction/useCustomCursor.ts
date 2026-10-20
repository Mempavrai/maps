import { ref, watch } from 'vue'
import { CURSOR_STORAGE_KEY } from '../constants'
import { storedFlag } from '../storage/storedFlag'

// Touch/coarse pointer devices have no real cursor for the overlay to follow —
// the feature is completely disabled there.
const isTouchDevice =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches

const cursorEnabled = isTouchDevice ? ref(false) : storedFlag(CURSOR_STORAGE_KEY, true)

function syncHtmlClass(enabled: boolean) {
  document.documentElement.classList.toggle('custom-cursor-active', enabled)
}

if (typeof document !== 'undefined') {
  syncHtmlClass(cursorEnabled.value)
}

watch(cursorEnabled, syncHtmlClass)

export function useCustomCursor() {
  function disableCursor() {
    cursorEnabled.value = false
  }

  function enableCursor() {
    if (isTouchDevice) return
    cursorEnabled.value = true
  }

  return {
    cursorEnabled,
    disableCursor,
    enableCursor,
    isTouchDevice,
  }
}

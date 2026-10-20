<script setup lang="ts">
import Select from 'primevue/select'
import { computed } from 'vue'
import { INNER_LINE_STYLE_OPTIONS } from './innerLineStyles'
import { useEditorStore } from './store/editorStore'
import { ROOM_MODES, SHAPE_MODES, TOOLS } from './toolCatalog'

const store = useEditorStore()

const activeTool = computed(() => TOOLS.find((tool) => tool.id === store.activeTool))

const activeModeHint = computed(() => {
  if (store.activeTool === 'room') {
    return ROOM_MODES.find((mode) => mode.id === store.roomToolMode)?.hint
  }
  if (store.activeTool === 'shape') {
    return SHAPE_MODES.find((mode) => mode.id === store.shapeToolMode)?.hint
  }
  return activeTool.value?.hint
})
</script>

<template>
  <div class="toolbar">
    <div class="segmented" role="toolbar" aria-label="Tools">
      <button
        v-for="tool in TOOLS"
        :key="tool.id"
        v-tooltip.bottom="`${tool.label} (${tool.hotkey})`"
        type="button"
        class="segment"
        :aria-pressed="store.activeTool === tool.id"
        @click="store.activeTool = tool.id"
      >
        <i :class="tool.icon" aria-hidden="true" />
        <span>{{ tool.label }}</span>
        <kbd>{{ tool.hotkey }}</kbd>
      </button>
    </div>

    <div v-if="store.activeTool === 'room'" class="modes" role="toolbar" aria-label="Room mode">
      <button
        v-for="mode in ROOM_MODES"
        :key="mode.id"
        type="button"
        class="segment compact"
        :aria-pressed="store.roomToolMode === mode.id"
        @click="store.roomToolMode = mode.id"
      >
        <i :class="mode.icon" aria-hidden="true" />
        <span>{{ mode.label }}</span>
      </button>
      <button
        v-if="store.roomToolMode === 'polygon'"
        v-tooltip.bottom="'Snap to right angles — hold Alt to invert temporarily'"
        type="button"
        class="segment compact"
        :aria-pressed="store.roomOrthoSnap"
        @click="store.roomOrthoSnap = !store.roomOrthoSnap"
      >
        90°
      </button>
      <Select
        v-if="store.roomToolMode === 'innerline'"
        v-model="store.innerLineStyle"
        :options="INNER_LINE_STYLE_OPTIONS"
        option-label="label"
        option-value="value"
        size="small"
        aria-label="Inner line style"
      />
    </div>

    <div v-if="store.activeTool === 'shape'" class="modes" role="toolbar" aria-label="Shape kind">
      <button
        v-for="mode in SHAPE_MODES"
        :key="mode.id"
        type="button"
        class="segment compact"
        :aria-pressed="store.shapeToolMode === mode.id"
        @click="store.shapeToolMode = mode.id"
      >
        <i :class="mode.icon" aria-hidden="true" />
        <span>{{ mode.label }}</span>
      </button>
    </div>

    <p class="hint" aria-live="polite" :title="store.toolHint || activeModeHint">
      <span v-if="store.toolHint" class="live-hint">{{ store.toolHint }}</span>
      <span v-else>{{ activeModeHint }}</span>
    </p>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border-default);
  background: var(--surface-drawer);
}

.segmented,
.modes {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
}

.modes {
  border-style: dashed;
}

.segment {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  color: var(--text-muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.segment.compact {
  height: 26px;
  padding: 0 8px;
  font-size: 12px;
}

.segment:hover {
  background: var(--surface-hover);
  color: var(--text-strong);
}

.segment[aria-pressed='true'] {
  border-color: var(--border-selected);
  background: var(--surface-selected);
  box-shadow: inset 0 -2px 0 var(--accent);
  color: var(--text-primary);
}

.segment .pi {
  font-size: 12px;
}

kbd {
  min-width: 16px;
  padding: 0 4px;
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  font-family: var(--font-data);
  font-size: 10px;
  line-height: 15px;
  color: var(--text-faint);
}

.hint {
  flex: 1;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  font-size: 12px;
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.live-hint {
  color: var(--text-strong);
}
</style>

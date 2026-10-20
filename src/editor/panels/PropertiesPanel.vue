<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { useClipboard } from '../tools/useClipboard'
import { useMergeRooms } from '../tools/useMergeRooms'
import { useEditorStore } from '../store/editorStore'
import GettingStarted from './GettingStarted.vue'
import PlacementProperties from './PlacementProperties.vue'
import RoomProperties from './RoomProperties.vue'
import RouteProperties from './RouteProperties.vue'
import ShapeProperties from './ShapeProperties.vue'

const emit = defineEmits<{ help: [] }>()

const store = useEditorStore()
const { canPaste, copyToSystemClipboard, cutToSystemClipboard, pasteFromSystemClipboard } =
  useClipboard()
const { canMerge, mergeSelection } = useMergeRooms()

const hasSelection = computed(() => store.selection.length > 0)

/** Buttons paste without a cursor position — the pointer is not over the canvas. */
function paste(): void {
  void pasteFromSystemClipboard(null)
}
</script>

<template>
  <div class="properties-panel">
    <div v-if="store.document && (hasSelection || canPaste)" class="selection-actions">
      <span v-if="store.selection.length > 1" class="selection-count">
        {{ store.selection.length }} objects selected
      </span>
      <template v-if="hasSelection">
        <Button
          v-tooltip.bottom="'Copy (Ctrl+C)'"
          icon="pi pi-copy"
          aria-label="Copy"
          size="small"
          text
          severity="secondary"
          @click="copyToSystemClipboard()"
        />
        <Button
          v-tooltip.bottom="'Cut (Ctrl+X)'"
          aria-label="Cut"
          size="small"
          text
          severity="secondary"
          @click="cutToSystemClipboard()"
        >
          <template #icon>
            <svg class="cut-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
            </svg>
          </template>
        </Button>
      </template>
      <Button
        v-tooltip.bottom="'Paste (Ctrl+V)'"
        icon="pi pi-clipboard"
        aria-label="Paste"
        size="small"
        text
        severity="secondary"
        :disabled="!canPaste"
        @click="paste()"
      />
      <template v-if="hasSelection">
        <Button
          v-if="canMerge"
          v-tooltip.bottom="'Merge rooms (Ctrl+M)'"
          aria-label="Merge rooms"
          size="small"
          text
          severity="secondary"
          @click="mergeSelection()"
        >
          <template #icon>
            <svg class="merge-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="13" height="13" rx="1" />
              <rect x="8" y="8" width="13" height="13" rx="1" />
            </svg>
          </template>
        </Button>
        <Button
          v-tooltip.bottom="'Deselect (Esc)'"
          icon="pi pi-times"
          aria-label="Deselect"
          size="small"
          text
          severity="secondary"
          @click="store.clearSelection()"
        />
        <Button
          v-tooltip.bottom="'Delete (Del)'"
          icon="pi pi-trash"
          aria-label="Delete"
          size="small"
          text
          severity="danger"
          @click="store.deleteSelection()"
        />
      </template>
    </div>
    <RoomProperties v-if="store.selectedRoom" :room="store.selectedRoom" />
    <PlacementProperties v-else-if="store.selectedPlacement" :placement="store.selectedPlacement" />
    <RouteProperties v-else-if="store.selectedRoute" :route="store.selectedRoute" />
    <ShapeProperties v-else-if="store.selectedShape" :shape="store.selectedShape" />
    <GettingStarted v-else-if="!hasSelection" @help="emit('help')" />
  </div>
</template>

<style scoped>
.properties-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selection-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-default);
}

.selection-count {
  margin-right: auto;
  font-size: 12px;
  color: var(--text-muted);
}

/* primeicons has no scissors or union glyph, hence the inline SVGs. */
.cut-icon,
.merge-icon {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
</style>

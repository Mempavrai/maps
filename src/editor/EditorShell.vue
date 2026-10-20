<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ZOOM_BUTTON_FACTOR } from '../core/constants'
import { isUiOwnedTarget } from '../core/interaction/eventTargets'
import ControlsLegend from '../core/ui/ControlsLegend.vue'
import './editor-forms.css'
import EditorCanvas from './EditorCanvas.vue'
import EditorHeader from './EditorHeader.vue'
import EditorStatusBar from './EditorStatusBar.vue'
import EditorToolbar from './EditorToolbar.vue'
import ExportDialog from './panels/ExportDialog.vue'
import ImportDialog from './panels/ImportDialog.vue'
import LibraryDialog from './panels/LibraryDialog.vue'
import MapSettingsDialog from './panels/MapSettingsDialog.vue'
import PalettePanel from './panels/PalettePanel.vue'
import PropertiesPanel from './panels/PropertiesPanel.vue'
import ShortcutHelpDialog from './panels/ShortcutHelpDialog.vue'
import StartDialog from './panels/StartDialog.vue'
import ZoomControls from './ZoomControls.vue'
import { useEditorStore } from './store/editorStore'
import { useLibraryStore } from './store/libraryStore'
import { useValidationIssues } from './store/useValidationIssues'
import { useZonesStore } from './store/zonesStore'

const editor = useEditorStore()
const libraryStore = useLibraryStore()
const zonesStore = useZonesStore()

const canvasRef = ref<InstanceType<typeof EditorCanvas> | null>(null)
const showImportDialog = ref(false)
const showExportDialog = ref(false)
const showMapSettings = ref(false)
const showLibraryDialog = ref(false)
const showShortcutHelp = ref(false)

const validationIssues = useValidationIssues()

function onHelpHotkey(event: KeyboardEvent): void {
  if (event.key === '?' && !isUiOwnedTarget(event.target)) {
    showShortcutHelp.value = !showShortcutHelp.value
  }
}

const showOpenConfirm = ref(false)

function requestOpenOther(): void {
  if (editor.dirty) {
    showOpenConfirm.value = true
  } else {
    editor.closeWorkspace()
  }
}

function confirmOpenOther(): void {
  showOpenConfirm.value = false
  editor.closeWorkspace()
}

function onBeforeUnload(event: BeforeUnloadEvent): void {
  if (editor.dirty) {
    event.preventDefault()
  }
}

onMounted(() => {
  libraryStore.load()
  zonesStore.load()
  window.addEventListener('keydown', onHelpHotkey)
  window.addEventListener('beforeunload', onBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onHelpHotkey)
  window.removeEventListener('beforeunload', onBeforeUnload)
})
</script>

<template>
  <div class="editor">
    <EditorHeader
      @open="requestOpenOther"
      @import="showImportDialog = true"
      @settings="showMapSettings = true"
      @library="showLibraryDialog = true"
      @export="showExportDialog = true"
      @help="showShortcutHelp = true"
    />
    <EditorToolbar v-if="editor.document" />
    <p v-if="libraryStore.loadError" class="error" role="alert">{{ libraryStore.loadError }}</p>
    <p v-if="zonesStore.loadError" class="error" role="alert">{{ zonesStore.loadError }}</p>
    <div class="editor-main">
      <aside class="side-panel palette">
        <PalettePanel />
      </aside>
      <div class="canvas-wrap">
        <EditorCanvas ref="canvasRef" />
        <ControlsLegend
          v-if="editor.document"
          class="canvas-legend"
          :hints="[
            { icon: 'left', label: 'Use tool' },
            { icon: 'right', label: 'Drag to pan' },
            { icon: 'wheel', label: 'Scroll to zoom' },
            { icon: 'wheel', label: 'Hold to pan' },
          ]"
        />
        <ZoomControls
          v-if="editor.document"
          class="canvas-zoom"
          @zoom-in="canvasRef?.zoomBy(ZOOM_BUTTON_FACTOR)"
          @zoom-out="canvasRef?.zoomBy(1 / ZOOM_BUTTON_FACTOR)"
          @fit="canvasRef?.fitToDocument()"
        />
      </div>
      <aside class="side-panel properties">
        <PropertiesPanel @help="showShortcutHelp = true" />
      </aside>
    </div>
    <EditorStatusBar
      :cursor="canvasRef?.cursorWorld ?? null"
      :zoom="canvasRef?.zoom ?? 1"
      :fine-grid="canvasRef?.isFineGrid ?? false"
      :issues="editor.document ? validationIssues : null"
    />
    <StartDialog @import="showImportDialog = true" />
    <ShortcutHelpDialog v-model:visible="showShortcutHelp" />
    <Dialog v-model:visible="showOpenConfirm" modal header="Unsaved changes">
      <p class="confirm-text">
        The current trial has unsaved changes. It stays in the browser autosave and can be continued
        from the start dialog — export it first to keep a file.
      </p>
      <div class="actions">
        <Button label="Cancel" severity="secondary" text @click="showOpenConfirm = false" />
        <Button label="Switch map" @click="confirmOpenOther" />
      </div>
    </Dialog>
    <ImportDialog v-model:visible="showImportDialog" />
    <ExportDialog v-model:visible="showExportDialog" />
    <MapSettingsDialog v-model:visible="showMapSettings" />
    <LibraryDialog v-model:visible="showLibraryDialog" />
    <Toast position="bottom-right" />
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.editor-main {
  display: flex;
  flex: 1;
  min-height: 0;
}

.side-panel {
  width: 248px;
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--surface-drawer);
  padding: 12px;
}

.palette {
  border-right: 1px solid var(--border-default);
}

.properties {
  width: 300px;
  border-left: 1px solid var(--border-default);
}

.canvas-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.canvas-legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
}

.canvas-zoom {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.error {
  margin: 8px 16px;
}

.confirm-text {
  margin: 0 0 16px;
  max-width: 420px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { RouteLine } from '../../core/model/types'
import { useEditorStore } from '../store/editorStore'
import PanelSection from './PanelSection.vue'
import PropertiesHeader from './PropertiesHeader.vue'

const props = defineProps<{ route: RouteLine }>()
const store = useEditorStore()

/** All changes go through the document object from the store (never through the prop). */
function setName(raw: string): void {
  const name = raw.trim()
  if (name) {
    store.commitOn('route', props.route.id, (route) => {
      route.name = name
    })
  }
}

function setFloor(floor: number): void {
  store.commitOn('route', props.route.id, (route) => {
    route.floor = floor
  })
}
</script>

<template>
  <div>
    <PropertiesHeader :id="route.id" kind="Route" :title="route.name" />
    <PanelSection title="General" open>
      <label class="field">
        <span class="field-label">Name</span>
        <InputText
          :model-value="route.name"
          size="small"
          @change="setName(($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="field">
        <span class="field-label">Floor</span>
        <Select
          :model-value="route.floor"
          :options="store.floorOptions"
          option-label="label"
          option-value="value"
          size="small"
          @update:model-value="setFloor($event)"
        />
      </label>
    </PanelSection>
  </div>
</template>

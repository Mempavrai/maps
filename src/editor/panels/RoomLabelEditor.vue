<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { pointsBounds, shapeToPoints } from '../../core/model/roomPath'
import type { Room, Vec2 } from '../../core/model/types'
import { useEditorStore } from '../store/editorStore'

const props = defineProps<{ room: Room }>()
const store = useEditorStore()

function setLabelText(raw: string): void {
  const text = raw.trim()
  store.commitOn('room', props.room.id, (room) => {
    if (!text) {
      delete room.label
      return
    }
    if (room.label) {
      room.label.text = text
      return
    }
    const points = shapeToPoints(room.shape)
    let pos: Vec2 = [0, 0]
    if (points) {
      const { min, max } = pointsBounds(points)
      pos = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2]
    }
    room.label = { text, pos }
  })
}

function setLabelValue(patch: { pos?: Vec2; fontSize?: number | null }, coalesce: string): void {
  store.commitOn(
    'room',
    props.room.id,
    (room) => {
      if (!room.label) {
        return
      }
      if (patch.pos) {
        room.label.pos = patch.pos
      }
      if (patch.fontSize !== undefined) {
        if (patch.fontSize === null) {
          delete room.label.fontSize
        } else {
          room.label.fontSize = patch.fontSize
        }
      }
    },
    { coalesce },
  )
}
</script>

<template>
  <label class="field">
    <span class="field-label">Text on the map</span>
    <InputText
      :model-value="room.label?.text ?? ''"
      size="small"
      placeholder="No label"
      @change="setLabelText(($event.target as HTMLInputElement).value)"
    />
  </label>
  <div v-if="room.label" class="field-row">
    <label class="field">
      <span class="field-label">X</span>
      <InputNumber
        :model-value="room.label.pos[0]"
        size="small"
        fluid
        :use-grouping="false"
        :max-fraction-digits="1"
        @update:model-value="setLabelValue({ pos: [$event ?? 0, room.label.pos[1]] }, 'label-x')"
      />
    </label>
    <label class="field">
      <span class="field-label">Y</span>
      <InputNumber
        :model-value="room.label.pos[1]"
        size="small"
        fluid
        :use-grouping="false"
        :max-fraction-digits="1"
        @update:model-value="setLabelValue({ pos: [room.label.pos[0], $event ?? 0] }, 'label-y')"
      />
    </label>
    <label class="field">
      <span class="field-label">Font size</span>
      <InputNumber
        :model-value="room.label.fontSize ?? null"
        size="small"
        fluid
        :use-grouping="false"
        :max-fraction-digits="1"
        @update:model-value="setLabelValue({ fontSize: $event }, 'label-size')"
      />
    </label>
  </div>
</template>

<style scoped>
.field-row .field {
  flex: 1 1 0;
}
</style>

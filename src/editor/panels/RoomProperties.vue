<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { computed } from 'vue'
import { KEBAB_ID_PATTERN } from '../../core/constants'
import type { Room, RoomFlag, RoomInfo, TrialDocument } from '../../core/model/types'
import { useEditorStore } from '../store/editorStore'
import { useZonesStore } from '../store/zonesStore'
import PanelSection from './PanelSection.vue'
import PropertiesHeader from './PropertiesHeader.vue'
import RoomImagesEditor from './RoomImagesEditor.vue'
import RoomInnerLinesEditor from './RoomInnerLinesEditor.vue'
import RoomLabelEditor from './RoomLabelEditor.vue'
import RoomWallGapsEditor from './RoomWallGapsEditor.vue'

const props = defineProps<{ room: Room }>()
const store = useEditorStore()
const zonesStore = useZonesStore()

const flagOptions: Array<{ id: RoomFlag; label: string }> = [
  { id: 'secret', label: 'Secret room' },
  { id: 'reel', label: 'Reel room' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'noWalls', label: 'No walls' },
  { id: 'unreachable', label: 'Unreachable' },
]

const zoneOptions = computed(() =>
  zonesStore.zones.map((zone) => ({ label: zone.name, value: zone.id })),
)
const flags = computed(() => new Set(props.room.flags ?? []))

/** All changes go through the document object from the store (never through the prop). */
function mutateRoom(mutate: (room: Room, doc: TrialDocument) => void): void {
  store.commitOn('room', props.room.id, mutate)
}

function renameId(raw: string): void {
  const id = raw.trim()
  if (
    !KEBAB_ID_PATTERN.test(id) ||
    id === props.room.id ||
    store.document?.rooms.some((room) => room.id === id)
  ) {
    return
  }
  const oldId = props.room.id
  mutateRoom((room, doc) => {
    room.id = id
    for (const placement of doc.placements) {
      if (placement.roomId === oldId) {
        placement.roomId = id
      }
    }
  })
  store.setSelection([{ kind: 'room', id }])
}

function setInfo(patch: Partial<RoomInfo>): void {
  mutateRoom((room) => {
    const info: RoomInfo = { ...(room.info ?? {}), ...patch }
    if (!info.title) {
      delete info.title
    }
    if (!info.description) {
      delete info.description
    }
    if (!info.images?.length) {
      delete info.images
    }
    if (Object.keys(info).length === 0) {
      delete room.info
    } else {
      room.info = info
    }
  })
}

function setZone(zone: string): void {
  mutateRoom((room) => {
    room.zone = zone
  })
}

/** Placements assigned to the room move along — the floor mismatch would be a validation error. */
function setFloor(floor: number): void {
  if (floor === props.room.floor) {
    return
  }
  mutateRoom((room, doc) => {
    room.floor = floor
    for (const placement of doc.placements) {
      if (placement.roomId === room.id) {
        placement.floor = floor
      }
    }
  })
  store.activeFloor = floor
}

function toggleFlag(flag: RoomFlag, checked: boolean): void {
  mutateRoom((room) => {
    const next = new Set(room.flags ?? [])
    if (checked) {
      next.add(flag)
    } else {
      next.delete(flag)
    }
    if (next.size === 0) {
      delete room.flags
    } else {
      room.flags = flagOptions.map((option) => option.id).filter((id) => next.has(id))
    }
  })
}
</script>

<template>
  <div>
    <PropertiesHeader :id="room.id" kind="Room" :title="room.info?.title ?? room.id" />
    <PanelSection title="General" open>
      <label class="field">
        <span class="field-label">ID</span>
        <InputText
          :model-value="room.id"
          size="small"
          @change="renameId(($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="field">
        <span class="field-label">Title</span>
        <InputText
          :model-value="room.info?.title ?? ''"
          size="small"
          placeholder="Shown when the room is selected"
          @change="setInfo({ title: ($event.target as HTMLInputElement).value.trim() })"
        />
      </label>
      <label class="field">
        <span class="field-label">Description</span>
        <Textarea
          :model-value="room.info?.description ?? ''"
          auto-resize
          rows="3"
          @change="setInfo({ description: ($event.target as HTMLTextAreaElement).value.trim() })"
        />
      </label>
      <div class="field-row">
        <label class="field">
          <span class="field-label">Zone</span>
          <Select
            :model-value="room.zone"
            :options="zoneOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="setZone($event)"
          />
        </label>
        <label class="field">
          <span class="field-label">Floor</span>
          <Select
            v-tooltip.bottom="'Elements assigned to the room move along'"
            :model-value="room.floor"
            :options="store.floorOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="setFloor($event)"
          />
        </label>
      </div>
    </PanelSection>
    <PanelSection title="Flags" :count="flags.size" :open="flags.size > 0">
      <label v-for="option in flagOptions" :key="option.id" class="toggle-row">
        <Checkbox
          :model-value="flags.has(option.id)"
          binary
          @update:model-value="toggleFlag(option.id, $event as boolean)"
        />
        <span>{{ option.label }}</span>
      </label>
    </PanelSection>
    <PanelSection title="Label" :open="Boolean(room.label)">
      <RoomLabelEditor :room="room" />
    </PanelSection>
    <PanelSection title="Wall gaps" :count="room.wallGaps?.length">
      <RoomWallGapsEditor :room-id="room.id" />
    </PanelSection>
    <PanelSection title="Inner lines" :count="room.innerLines?.length">
      <RoomInnerLinesEditor :room-id="room.id" />
    </PanelSection>
    <PanelSection title="Screenshots" :count="room.info?.images?.length">
      <RoomImagesEditor :room-id="room.id" />
    </PanelSection>
  </div>
</template>

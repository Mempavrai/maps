import type { RoomToolMode, ShapeToolMode, ToolId } from './tools/toolTypes'

interface ToolEntry<Id extends string> {
  id: Id
  label: string
  icon: string
  hint: string
}

export const TOOLS: Array<ToolEntry<ToolId> & { hotkey: string }> = [
  {
    id: 'select',
    label: 'Select',
    icon: 'pi pi-arrow-up-left',
    hotkey: '1',
    hint: 'Click to select and drag to move. Shift+click adds, dragging on empty space draws a box.',
  },
  { id: 'room', label: 'Room', icon: 'pi pi-home', hotkey: '2', hint: '' },
  {
    id: 'placement',
    label: 'Element',
    icon: 'pi pi-map-marker',
    hotkey: '3',
    hint: 'Click the map to place the element picked on the left.',
  },
  {
    id: 'route',
    label: 'Route',
    icon: 'pi pi-directions',
    hotkey: '4',
    hint: 'Click to add points — Enter or double-click finishes the route.',
  },
  { id: 'shape', label: 'Shape', icon: 'pi pi-pencil', hotkey: '5', hint: '' },
]

export const ROOM_MODES: Array<ToolEntry<RoomToolMode>> = [
  {
    id: 'polygon',
    label: 'Polygon',
    icon: 'pi pi-share-alt',
    hint: 'Click to add corners — Enter, double-click or clicking the other end closes the room.',
  },
  {
    id: 'rect',
    label: 'Rectangle',
    icon: 'pi pi-stop',
    hint: 'Click two opposite corners.',
  },
  {
    id: 'innerline',
    label: 'Inner lines',
    icon: 'pi pi-pen-line',
    hint: 'Draw decorative lines inside a room.',
  },
  {
    id: 'wallgap',
    label: 'Wall gap',
    icon: 'pi pi-minus-circle',
    hint: 'Click an edge of a room to cut an opening into its wall.',
  },
]

export const SHAPE_MODES: Array<ToolEntry<ShapeToolMode>> = [
  {
    id: 'circle',
    label: 'Circle',
    icon: 'pi pi-circle',
    hint: 'Click the center, then the radius.',
  },
  { id: 'rect', label: 'Rectangle', icon: 'pi pi-stop', hint: 'Click two opposite corners.' },
  {
    id: 'line',
    label: 'Line',
    icon: 'pi pi-minus',
    hint: 'Click to add points — Enter or double-click finishes the line.',
  },
]

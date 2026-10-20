<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ title: string; count?: number; open?: boolean }>()

// `open` is only the initial state — a section must not collapse while its content is edited.
const initiallyOpen = props.open
const rendered = ref(initiallyOpen)

function onToggle(event: Event): void {
  rendered.value ||= (event.target as HTMLDetailsElement).open
}
</script>

<template>
  <details class="panel-section" :open="initiallyOpen" @toggle="onToggle">
    <summary class="section-summary">
      <i class="pi pi-chevron-right section-chevron" aria-hidden="true" />
      <span class="section-title">{{ title }}</span>
      <span v-if="count" class="section-count">{{ count }}</span>
    </summary>
    <div v-if="rendered" class="section-body">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.panel-section {
  border-top: 1px solid var(--border-default);
}

.section-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 2px;
  list-style: none;
  cursor: pointer;
  user-select: none;
}

.section-summary::-webkit-details-marker {
  display: none;
}

.section-summary:hover .section-title {
  color: var(--text-strong);
}

.section-chevron {
  font-size: 10px;
  color: var(--text-faint);
  transition: transform 0.15s ease;
}

.panel-section[open] .section-chevron {
  transform: rotate(90deg);
}

.section-title {
  flex: 1;
  font-family: var(--font-brand);
  font-size: 14px;
  color: var(--text-body);
}

.section-count {
  min-width: 18px;
  padding: 0 6px;
  border-radius: var(--radius-pill);
  background: var(--surface-active);
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  color: var(--text-strong);
}

.section-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 2px 14px;
}
</style>

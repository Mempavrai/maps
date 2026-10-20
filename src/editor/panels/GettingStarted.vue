<script setup lang="ts">
import Button from 'primevue/button'

const emit = defineEmits<{ help: [] }>()

const steps = [
  {
    title: 'Pick a tool',
    text: 'Use the tool bar above the map or the keys 1–5. Elements come from the list on the left.',
  },
  {
    title: 'Draw on the map',
    text: 'Left click uses the tool. Drag with the right mouse button to pan, scroll to zoom.',
  },
  {
    title: 'Fine-tune here',
    text: 'Switch to Select (1) and click anything on the map — its settings show up in this panel.',
  },
  {
    title: 'Share your work',
    text: 'Your changes are autosaved in this browser. Export creates the files for a pull request.',
  },
]
</script>

<template>
  <section class="getting-started">
    <h3 class="heading">Getting started</h3>
    <ol class="steps">
      <li v-for="step in steps" :key="step.title" class="step">
        <span class="step-title">{{ step.title }}</span>
        <span class="step-text">{{ step.text }}</span>
      </li>
    </ol>
    <Button
      label="All keyboard shortcuts"
      icon="pi pi-question-circle"
      size="small"
      severity="secondary"
      text
      @click="emit('help')"
    />
  </section>
</template>

<style scoped>
.getting-started {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.heading {
  margin: 0;
  font-family: var(--font-brand);
  font-size: 18px;
  font-weight: 400;
  color: var(--text-primary);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 30px;
  counter-increment: step;
}

.step::before {
  content: counter(step);
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  font-size: 11px;
  line-height: 20px;
  text-align: center;
  color: var(--text-strong);
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-strong);
}

.step-text {
  font-size: 12px;
  line-height: 1.45;
  color: var(--text-muted);
}
</style>

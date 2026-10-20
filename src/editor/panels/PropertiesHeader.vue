<script setup lang="ts">
defineProps<{ kind: string; title: string; id?: string }>()
</script>

<template>
  <header class="properties-header">
    <span class="kind">{{ kind }}</span>
    <h3 class="title">{{ title }}</h3>
    <span v-if="id && id !== title" class="id">{{ id }}</span>
  </header>
</template>

<style scoped>
.properties-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
}

.kind {
  font-size: 11px;
  color: var(--accent-hover);
}

.title {
  margin: 0;
  overflow: hidden;
  font-family: var(--font-brand);
  font-size: 18px;
  font-weight: 400;
  color: var(--text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.id {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--text-faint);
}
</style>

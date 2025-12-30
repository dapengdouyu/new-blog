<template>
  <div :class="['alert', type]">
    <div class="alert-icon">
      <slot name="icon">
        <span v-if="type === 'info'">ℹ️</span>
        <span v-else-if="type === 'success'">✅</span>
        <span v-else-if="type === 'warning'">⚠️</span>
        <span v-else-if="type === 'error'">❌</span>
      </slot>
    </div>
    <div class="alert-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info'
})
</script>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border-left: 4px solid;
}

.alert.info {
  background: var(--vp-c-blue-soft);
  border-left-color: var(--vp-c-blue);
  color: var(--vp-c-blue-dark);
}

.alert.success {
  background: var(--vp-c-green-soft);
  border-left-color: var(--vp-c-green);
  color: var(--vp-c-green-dark);
}

.alert.warning {
  background: var(--vp-c-yellow-soft);
  border-left-color: var(--vp-c-yellow);
  color: var(--vp-c-yellow-dark);
}

.alert.error {
  background: var(--vp-c-red-soft);
  border-left-color: var(--vp-c-red);
  color: var(--vp-c-red-dark);
}

.alert-icon {
  font-size: 1.2em;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content :deep(p) {
  margin: 0;
}

.alert-content :deep(p + p) {
  margin-top: 0.5rem;
}
</style>

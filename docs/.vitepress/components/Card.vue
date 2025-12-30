<template>
  <div :class="['card', size]">
    <div v-if="hasHeader" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="hasFooter" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  hasHeader?: boolean
  hasFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  hasHeader: false,
  hasFooter: false
})
</script>

<style scoped>
.card {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  overflow: hidden;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card.small {
  max-width: 300px;
}

.card.medium {
  max-width: 500px;
}

.card.large {
  max-width: 800px;
}

.card-header {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
  font-weight: 600;
}

.card-body {
  padding: 1rem;
}

.card-footer {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-border);
}
</style>

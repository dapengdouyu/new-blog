<template>
  <div class="counter">
    <h3>{{ title }}</h3>
    <p>当前计数: {{ count }}</p>
    <button @click="increment" class="counter-btn">+1</button>
    <button @click="decrement" class="counter-btn">-1</button>
    <button @click="reset" class="counter-btn reset">重置</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '计数器',
  initialCount: 0
})

const count = ref(props.initialCount)

const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = props.initialCount
</script>

<style scoped>
.counter {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  background: var(--vp-c-bg-soft);
}

.counter-btn {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-brand);
  border-radius: 4px;
  background: var(--vp-c-brand);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.counter-btn:hover {
  background: var(--vp-c-brand-dark);
}

.reset {
  background: var(--vp-c-text-3);
  border-color: var(--vp-c-text-3);
}

.reset:hover {
  background: var(--vp-c-text-2);
}
</style>

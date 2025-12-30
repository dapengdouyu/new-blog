<template>
  <div class="tabs">
    <div class="tab-nav">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="['tab-button', { active: activeTab === index }]"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="tab-content">
      <div v-html="tabs[activeTab].content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tab {
  title: string
  content: string
}

interface Props {
  tabs: Tab[]
  defaultActive?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultActive: 0
})

const activeTab = ref(props.defaultActive)
</script>

<style scoped>
.tabs {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
}

.tab-nav {
  display: flex;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.tab-button {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.tab-button.active {
  color: var(--vp-c-brand);
  border-bottom-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.tab-content {
  padding: 1rem;
  background: var(--vp-c-bg);
}
</style>

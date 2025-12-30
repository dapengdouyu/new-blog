<template>
  <div class="code-snippet">
    <div class="code-header">
      <span class="language">{{ language }}</span>
      <button @click="copyCode" class="copy-btn" :class="{ copied: isCopied }">
        {{ isCopied ? '已复制' : '复制' }}
      </button>
    </div>
    <pre class="code-block"><code :class="`language-${language}`">{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  code: string
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript'
})

const isCopied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.code-snippet {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 1rem 0;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-border);
}

.language {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.copy-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--vp-c-brand);
  border-radius: 4px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: var(--vp-c-brand-dark);
}

.copy-btn.copied {
  background: var(--vp-c-green);
  border-color: var(--vp-c-green);
}

.code-block {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  background: var(--vp-c-bg);
}

.code-block code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>

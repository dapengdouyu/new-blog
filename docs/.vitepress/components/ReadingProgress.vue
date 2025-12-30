<template>
  <div class="reading-progress" v-if="showProgress">
    <div
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
    <span class="progress-text">{{ Math.round(progress) }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const showProgress = ref(false)

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = (scrollTop / docHeight) * 100
  showProgress.value = scrollTop > 50 // 只在滚动一定距离后显示
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress() // 初始化
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--vp-c-bg-soft);
  z-index: 1000;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-brand-light));
  transition: width 0.1s ease;
}

.progress-text {
  position: absolute;
  right: 10px;
  top: -20px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}
</style>

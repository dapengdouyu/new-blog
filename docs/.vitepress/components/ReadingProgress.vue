<template>
  <div class="reading-progress-container" v-if="showContainer">
    <!-- 阅读进度条 -->
    <div class="reading-progress-bar" :class="{ visible: showProgress }">
      <div
        class="progress-fill"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <!-- 右侧悬浮按钮组 -->
    <div class="floating-actions" :class="{ visible: showActions }">
      <!-- 阅读时间显示 -->
      <div class="reading-time" v-if="showReadingTime">
        <div class="time-icon">📖</div>
        <div class="time-text">{{ readingTimeText }}</div>
      </div>

      <!-- 回到顶部按钮 -->
      <button
        class="scroll-to-top"
        @click="scrollToTop"
        :class="{ visible: showScrollToTop }"
        aria-label="回到顶部"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  showReadingTime?: boolean
  wordsPerMinute?: number
  showScrollToTop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showReadingTime: true,
  wordsPerMinute: 200,
  showScrollToTop: true
})

const progress = ref(0)
const showProgress = ref(false)
const showActions = ref(false)
const showContainer = ref(false)

// 计算阅读时间
const readingTimeText = computed(() => {
  // VitePress 内容选择器（按优先级排序）
  const selectors = [
    '.vp-doc > div > main', // VitePress 1.0+
    '.vp-doc main',
    '.vp-doc article',
    '.vp-doc .content',
    '.vp-doc',
    'main',
    'article',
    '.main-content',
    '.content'
  ]

  let content: Element | null = null
  let usedSelector = ''

  for (const selector of selectors) {
    content = document.querySelector(selector)
    if (content) {
      usedSelector = selector
      break
    }
  }

  if (!content) return '0 min'

  // 获取纯文本内容，排除代码块和其他非内容元素
  const clone = content.cloneNode(true) as Element

  // 移除非内容元素
  const selectorsToRemove = [
    'pre', 'code', 'nav', 'footer', 'header', 'aside',
    '.vp-doc-nav', '.vp-doc-sidebar', '.vp-doc-footer',
    '.vp-sidebar', '.vp-nav', '.vp-footer',
    'script', 'style', '[aria-hidden="true"]',
    '.reading-progress-container', // 排除我们自己的组件
    '.floating-actions',
    '.reading-progress-bar'
  ]

  selectorsToRemove.forEach(selector => {
    const elements = clone.querySelectorAll(selector)
    elements.forEach(el => el.remove())
  })

  const text = clone.textContent || ''

  // 过滤掉只有空白字符的内容，并清理多余空格
  const cleanText = text.replace(/\s+/g, ' ').trim()

  if (cleanText.length === 0) return '0 min'

  // 对中文内容，使用字符数计算；对英文内容，使用单词数计算
  let readingUnits: number
  let isChineseContent = false

  // 检查是否主要为中文内容（中文字符比例 > 20%）
  const chineseChars = (cleanText.match(/[\u4e00-\u9fff]/g) || []).length
  const totalChars = cleanText.replace(/\s/g, '').length

  if (totalChars > 0 && (chineseChars / totalChars) > 0.2) {
    isChineseContent = true
    readingUnits = totalChars
  } else {
    readingUnits = cleanText.split(/\s+/).filter(word => word.length > 0).length
  }

  if (readingUnits === 0) return '0 min'

  // 计算阅读时间
  let minutes: number
  if (isChineseContent) {
    // 中文：调整阅读速度，中文阅读速度约为英文的2.5-3倍
    const adjustedReadingSpeed = Math.floor(props.wordsPerMinute * 2.8)
    minutes = Math.ceil(readingUnits / adjustedReadingSpeed)
  } else {
    // 英文：正常单词阅读速度
    minutes = Math.ceil(readingUnits / props.wordsPerMinute)
  }

  return minutes > 0 ? `${minutes} min` : '< 1 min'
})

// 平滑滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 更新进度
const updateProgress = () => {
  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

  // 获取更准确的文档高度和视窗高度
  const windowHeight = window.innerHeight
  const body = document.body
  const html = document.documentElement

  // 使用更精确的方法计算文档总高度
  const docHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  // 计算可滚动距离（文档高度减去视窗高度）
  const totalScroll = docHeight - windowHeight

  // 计算阅读进度，确保在合理范围内
  if (totalScroll > 0) {
    progress.value = Math.min(100, Math.max(0, (scrollTop / totalScroll) * 100))
  } else {
    progress.value = 0
  }

  // 显示逻辑 - 使用更合理的阈值
  const scrollThreshold = Math.min(100, windowHeight * 0.1) // 视窗高度的10%，最大100px
  const actionsThreshold = Math.min(200, windowHeight * 0.2) // 视窗高度的20%，最大200px
  const containerThreshold = Math.min(50, windowHeight * 0.05) // 视窗高度的5%，最大50px

  showProgress.value = scrollTop > scrollThreshold
  showActions.value = scrollTop > actionsThreshold
  showContainer.value = scrollTop > containerThreshold

  // 添加完成状态的CSS类
  const progressBar = document.querySelector('.reading-progress-bar')
  if (progressBar) {
    if (progress.value >= 99) {
      progressBar.classList.add('completed')
    } else {
      progressBar.classList.remove('completed')
    }
  }
}

// 防抖更新
let updateTimeout: number | null = null
const debouncedUpdate = () => {
  if (updateTimeout) {
    cancelAnimationFrame(updateTimeout)
  }
  updateTimeout = requestAnimationFrame(updateProgress)
}

onMounted(() => {
  window.addEventListener('scroll', debouncedUpdate, { passive: true })
  updateProgress() // 初始化

  // 延迟计算阅读时间，确保内容完全加载
  const triggerRecalculation = () => {
    // 触发阅读时间重新计算（通过访问computed值）
    readingTimeText.value
  }

  // 多次尝试，确保内容加载完成
  setTimeout(triggerRecalculation, 100)
  setTimeout(triggerRecalculation, 500)
  setTimeout(triggerRecalculation, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedUpdate)
  if (updateTimeout) {
    cancelAnimationFrame(updateTimeout)
  }
})
</script>

<style scoped>
.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

/* 阅读进度条 */
.reading-progress-bar {
  position: relative;
  width: 100%;
  height: 6px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(128, 128, 128, 0.2) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: translateY(-100%) scaleY(0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.reading-progress-bar.visible {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #1d4ed8 0%,
    #2563eb 20%,
    #3b82f6 40%,
    #06b6d4 60%,
    #0891b2 80%,
    #1d4ed8 100%
  );
  background-size: 200% 100%;
  animation: gradient-shift 3s ease-in-out infinite;
  border-radius: 0 6px 6px 0;
  transition: width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 0 20px rgba(37, 99, 235, 0.8),
    0 0 40px rgba(37, 99, 235, 0.6),
    0 0 80px rgba(37, 99, 235, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

/* 完成状态样式 */
.reading-progress-bar.completed .progress-fill {
  background: linear-gradient(
    90deg,
    #047857 0%,
    #059669 20%,
    #10b981 40%,
    #34d399 60%,
    #6ee7b7 80%,
    #047857 100%
  );
  box-shadow:
    0 0 25px rgba(5, 150, 105, 0.9),
    0 0 50px rgba(5, 150, 105, 0.7),
    0 0 100px rgba(5, 150, 105, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  animation: completed-glow 2s ease-in-out infinite;
}

@keyframes completed-glow {
  0%, 100% {
    box-shadow:
      0 0 25px rgba(5, 150, 105, 0.9),
      0 0 50px rgba(5, 150, 105, 0.7),
      0 0 100px rgba(5, 150, 105, 0.5),
      0 2px 4px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow:
      0 0 35px rgba(5, 150, 105, 1.0),
      0 0 70px rgba(5, 150, 105, 0.8),
      0 0 140px rgba(5, 150, 105, 0.6),
      0 2px 4px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}


/* 右侧悬浮按钮组 */
.floating-actions {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  pointer-events: auto;
}

.floating-actions.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 阅读时间显示 */
.reading-time {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.reading-time:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.time-icon {
  font-size: 14px;
}

.time-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

/* 回到顶部按钮 */
.scroll-to-top {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);
}

.scroll-to-top:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.scroll-to-top.visible {
  opacity: 1;
  transform: scale(1);
}

.scroll-to-top svg {
  transition: transform 0.2s ease;
}

.scroll-to-top:hover svg {
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-actions {
    right: 16px;
    bottom: 16px;
  }

  .reading-time {
    padding: 6px 10px;
    font-size: 11px;
  }

  .scroll-to-top {
    width: 40px;
    height: 40px;
  }

}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .reading-progress-bar {
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.08) 100%
    );
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .progress-fill {
    box-shadow:
      0 0 20px rgba(59, 130, 246, 0.6),
      0 0 40px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }


  .reading-time,
  .scroll-to-top {
    backdrop-filter: blur(10px) brightness(1.1);
  }
}
</style>

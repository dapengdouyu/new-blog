<template>
  <div class="python-runner">
    <div class="runner-header">
      <h3>Python 代码运行器</h3>
      <div class="runner-controls">
        <button
          @click="runCode"
          :disabled="isRunning || !isPyodideLoaded"
          class="run-btn"
        >
          {{ isRunning ? '运行中...' : '运行代码' }}
        </button>
        <button @click="clearOutput" class="clear-btn">
          清除输出
        </button>
      </div>
    </div>

    <div class="code-section">
      <textarea
        v-model="code"
        class="code-editor"
        placeholder="输入 Python 代码..."
        spellcheck="false"
      ></textarea>
    </div>

    <div class="output-section">
      <div class="output-header">
        <span>输出结果</span>
        <div class="status-indicators">
          <span v-if="!isPyodideLoaded && !loadError" class="loading-status">
            <div class="status-spinner"></div>
            正在加载 Python 环境...
          </span>
  <span v-else-if="loadError" class="error-status">
    <div class="error-icon">⚠️</div>
    <span>加载失败</span>
  </span>
          <span v-else class="success-status">
            <div class="success-icon">✅</div>
            <span>Python 环境就绪</span>
          </span>
        </div>
      </div>
      <pre class="output-display" :class="{ error: loadError }">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 默认代码示例
const defaultCode = `# Python 代码示例
print("Hello, Python in Browser!")

# 计算斐波那契数列
def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print("斐波那契数列前10项:", fibonacci(10))

# 数据处理示例
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squared = [x**2 for x in data]
print("平方数:", squared)
print("平均值:", sum(data) / len(data))`

const code = ref(defaultCode)
const output = ref('')
const isRunning = ref(false)
const isPyodideLoaded = ref(false)
const loadError = ref(false)
let pyodide: any = null

// Pyodide CDN 配置
const PYODIDE_CONFIGS = [
  {
    name: 'Staticfile CDN',
    scriptUrl: 'https://cdn.staticfile.net/pyodide/0.25.0/pyodide.min.js',
    indexUrl: 'https://cdn.staticfile.net/pyodide/0.25.0/'
  }
]

// 加载 Pyodide
const loadPyodide = async () => {
  const config = PYODIDE_CONFIGS[0]

  try {
    output.value = `正在从 ${config.name} 加载 Python 环境...\n`

    // 检查脚本是否已存在
    const existingScript = document.querySelector(`script[src="${config.scriptUrl}"]`)
    if (existingScript) {
      // 等待脚本加载完成
      await new Promise((resolve, reject) => {
        if ((window as any).loadPyodide) {
          resolve(void 0)
        } else {
          existingScript.addEventListener('load', () => resolve(void 0))
          existingScript.addEventListener('error', reject)
        }
      })
    } else {
      // 动态加载 Pyodide
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = config.scriptUrl
        script.onload = resolve
        script.onerror = () => reject(new Error(`Failed to load from ${config.name}`))
        document.head.appendChild(script)
      })
    }

    // 初始化 Pyodide
    // @ts-ignore
    pyodide = await loadPyodide({
      indexURL: config.indexUrl
    })

    isPyodideLoaded.value = true
    output.value = `✅ Python 环境已从 ${config.name} 加载完成！\n`

  } catch (error) {
    console.error(`Failed to load Pyodide:`, error)
    loadError.value = true
    output.value = '\n❌ 加载 Python 环境失败。\n'
    output.value += '可能的原因：\n'
    output.value += '• 网络连接问题\n'
    output.value += '• CDN 服务暂时不可用\n'
    output.value += '• 浏览器安全策略限制\n\n'
    output.value += '建议：\n'
    output.value += '• 检查网络连接\n'
    output.value += '• 尝试刷新页面\n'
    output.value += '• 检查浏览器控制台错误信息\n'
  }
}

// 运行代码
const runCode = async () => {
  if (!pyodide || !isPyodideLoaded.value) {
    output.value = 'Python 环境尚未加载完成。\n'
    return
  }

  isRunning.value = true
  output.value = '正在执行代码...\n'

  try {
    // 重定向 stdout
    pyodide.runPython(`
import sys
from io import StringIO

# 创建字符串缓冲区来捕获输出
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()
`)

    // 运行用户代码
    await pyodide.runPythonAsync(code.value)

    // 获取输出
    const result = pyodide.runPython('captured_output.getvalue()')
    output.value = result || '代码执行完成，无输出。\n'

    // 恢复 stdout
    pyodide.runPython('sys.stdout = old_stdout')

  } catch (error: any) {
    output.value = `执行错误: ${error.message}\n`
  } finally {
    isRunning.value = false
  }
}

// 清除输出
const clearOutput = () => {
  output.value = ''
}


// 组件挂载时加载 Pyodide
onMounted(() => {
  loadPyodide()
})
</script>

<style scoped>
.python-runner {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin: 2rem 0;
  overflow: hidden;
}

.runner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.runner-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.runner-controls {
  display: flex;
  gap: 0.5rem;
}

.run-btn, .clear-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.run-btn {
  background: var(--vp-c-brand);
  color: white;
}

.run-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

.run-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.clear-btn:hover {
  background: var(--vp-c-bg);
}

.code-section {
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.code-editor {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}

.code-editor:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(var(--vp-c-brand-rgb), 0.1);
}

.output-section {
  padding: 1rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.error-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-error);
  font-weight: 500;
}

.success-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-success);
  font-weight: 500;
}

.output-display {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--vp-c-text-1);
  margin: 0;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--vp-c-border);
  border-top: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 状态指示器样式 */
.status-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--vp-c-border);
  border-top: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon, .success-icon {
  font-size: 14px;
  line-height: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .runner-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .runner-controls {
    justify-content: center;
  }

  .code-editor {
    font-size: 0.8rem;
  }

  .output-display {
    font-size: 0.8rem;
  }
}
</style>

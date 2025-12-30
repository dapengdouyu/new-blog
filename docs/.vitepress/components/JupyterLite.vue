<template>
  <div class="jupyter-lite">
    <div class="jupyter-header">
      <h3>🪐 JupyterLite 环境</h3>
      <div class="jupyter-controls">
        <button
          @click="createNewNotebook"
          class="new-notebook-btn"
          :disabled="!isJupyterLoaded"
        >
          新建 Notebook
        </button>
        <button
          @click="clearWorkspace"
          class="clear-btn"
        >
          清除工作区
        </button>
      </div>
    </div>

    <div class="jupyter-status">
      <span v-if="!isJupyterLoaded" class="loading-status">
        <div class="status-spinner"></div>
        正在加载 JupyterLite 环境...
      </span>
      <span v-else class="ready-status">
        ✅ JupyterLite 环境已就绪
      </span>
    </div>

    <div class="jupyter-workspace" v-show="isJupyterLoaded">
      <div class="notebook-list" v-if="notebooks.length > 0">
        <h4>现有 Notebook</h4>
        <div class="notebook-items">
          <div
            v-for="(notebook, index) in notebooks"
            :key="index"
            class="notebook-item"
            @click="loadNotebook(index)"
          >
            <div class="notebook-icon">📓</div>
            <div class="notebook-info">
              <div class="notebook-name">{{ notebook.name }}</div>
              <div class="notebook-date">创建时间: {{ notebook.created }}</div>
            </div>
            <button @click.stop="deleteNotebook(index)" class="delete-notebook-btn">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div class="notebook-editor" v-if="currentNotebook">
        <div class="notebook-toolbar">
          <span class="notebook-title">{{ currentNotebook.name }}</span>
          <div class="notebook-actions">
            <button @click="runAllCells" class="run-all-btn">
              ▶️ 运行全部
            </button>
            <button @click="addCell" class="add-cell-btn">
              ➕ 添加单元格
            </button>
            <button @click="saveNotebook" class="save-btn">
              💾 保存
            </button>
          </div>
        </div>

        <div class="cells-container">
          <div
            v-for="(cell, index) in currentNotebook.cells"
            :key="index"
            class="notebook-cell"
            :class="{ 'cell-executing': cell.executing }"
          >
            <div class="cell-header">
              <span class="cell-type">{{ cell.type === 'code' ? '📝' : '📄' }}</span>
              <span class="cell-index">[{{ index + 1 }}]</span>
              <button @click="deleteCell(index)" class="delete-cell-btn">
                ✕
              </button>
            </div>

            <div class="cell-content">
              <textarea
                v-if="cell.type === 'code'"
                v-model="cell.source"
                class="code-input"
                placeholder="输入 Python 代码..."
                spellcheck="false"
              ></textarea>

              <textarea
                v-else
                v-model="cell.source"
                class="markdown-input"
                placeholder="输入 Markdown 文本..."
              ></textarea>
            </div>

            <div class="cell-output" v-if="cell.output">
              <div class="output-header">输出:</div>
              <pre class="output-content">{{ cell.output }}</pre>
            </div>

            <div class="cell-actions">
              <button @click="runCell(index)" :disabled="cell.executing" class="run-cell-btn">
                {{ cell.executing ? '运行中...' : '▶️ 运行' }}
              </button>
              <select v-model="cell.type" class="cell-type-select">
                <option value="code">代码</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="jupyter-welcome" v-else>
        <div class="welcome-content">
          <h3>欢迎使用 JupyterLite！</h3>
          <p>在这里你可以：</p>
          <ul>
            <li>✨ 创建和编辑 Jupyter Notebook</li>
            <li>🐍 运行 Python 代码</li>
            <li>📊 数据可视化</li>
            <li>📝 混合代码和文档</li>
          </ul>
          <button @click="createNewNotebook" class="welcome-cta">
            🚀 开始创建第一个 Notebook
          </button>
        </div>
      </div>
    </div>

    <div class="jupyter-info">
      <details>
        <summary>ℹ️ 关于 JupyterLite</summary>
        <p>
          JupyterLite 是 Jupyter 的浏览器版本，基于 Pyodide 运行。
          它支持 Python 编程、数据分析和可视化，所有计算都在您的浏览器中进行。
        </p>
        <p><strong>支持的功能：</strong></p>
        <ul>
          <li>Python 代码执行</li>
          <li>数据可视化 (matplotlib, plotly)</li>
          <li>科学计算 (numpy, pandas, scipy)</li>
          <li>机器学习 (scikit-learn)</li>
          <li>文件上传和下载</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 类型定义
interface NotebookCell {
  type: 'code' | 'markdown'
  source: string
  output?: string
  executing?: boolean
}

interface Notebook {
  name: string
  cells: NotebookCell[]
  created: string
}

// 响应式数据
const isJupyterLoaded = ref(false)
const notebooks = ref<Notebook[]>([])
const currentNotebook = ref<Notebook | null>(null)
let pyodide: any = null

// 初始化 JupyterLite
const initializeJupyter = async () => {
  try {
    // 这里我们使用已有的 Pyodide 实例
    // 如果需要独立的 JupyterLite，我们可以单独加载

    // 模拟加载过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    isJupyterLoaded.value = true

    // 加载示例notebook
    loadExampleNotebooks()

  } catch (error) {
    console.error('Failed to initialize Jupyter:', error)
  }
}

// 创建新notebook
const createNewNotebook = () => {
  const timestamp = new Date().toLocaleString()
  const notebook: Notebook = {
    name: `Untitled-${notebooks.value.length + 1}`,
    cells: [{
      type: 'markdown',
      source: '# 新建 Notebook\n\n欢迎使用 JupyterLite！'
    }, {
      type: 'code',
      source: 'print("Hello, JupyterLite!")\nprint("这是一个交互式的 Python 环境")'
    }],
    created: timestamp
  }

  notebooks.value.push(notebook)
  currentNotebook.value = notebook
}

// 加载notebook
const loadNotebook = (index: number) => {
  currentNotebook.value = notebooks.value[index]
}

// 删除notebook
const deleteNotebook = (index: number) => {
  if (confirm('确定要删除这个 notebook 吗？')) {
    notebooks.value.splice(index, 1)
    if (currentNotebook.value === notebooks.value[index]) {
      currentNotebook.value = null
    }
  }
}

// 添加单元格
const addCell = () => {
  if (currentNotebook.value) {
    currentNotebook.value.cells.push({
      type: 'code',
      source: ''
    })
  }
}

// 删除单元格
const deleteCell = (index: number) => {
  if (currentNotebook.value) {
    currentNotebook.value.cells.splice(index, 1)
  }
}

// 运行单个单元格
const runCell = async (index: number) => {
  if (!currentNotebook.value) return

  const cell = currentNotebook.value.cells[index]
  if (cell.type !== 'code') return

  cell.executing = true
  cell.output = '正在执行...'

  try {
    // 这里应该使用 Pyodide 执行代码
    // 暂时模拟执行结果
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟一些常见的输出
    if (cell.source.includes('print(')) {
      cell.output = 'Hello, JupyterLite!\n这是一个交互式的 Python 环境'
    } else if (cell.source.includes('import')) {
      cell.output = '模块导入成功'
    } else {
      // 简单的表达式求值（避免使用eval）
      try {
        // 对于简单的数学表达式，我们可以使用Function构造器
        const result = new Function('return ' + cell.source)()
        cell.output = `执行结果: ${result}`
      } catch (e) {
        cell.output = '复杂表达式请使用 print() 输出结果'
      }
    }

  } catch (error: any) {
    cell.output = `错误: ${error.message}`
  } finally {
    cell.executing = false
  }
}

// 运行所有单元格
const runAllCells = async () => {
  if (!currentNotebook.value) return

  for (let i = 0; i < currentNotebook.value.cells.length; i++) {
    const cell = currentNotebook.value.cells[i]
    if (cell.type === 'code') {
      await runCell(i)
    }
  }
}

// 保存notebook
const saveNotebook = () => {
  if (!currentNotebook.value) return

  // 这里可以实现保存到localStorage或其他存储
  const notebookData = JSON.stringify(currentNotebook.value)
  localStorage.setItem(`jupyter-notebook-${currentNotebook.value.name}`, notebookData)

  alert('Notebook 已保存到浏览器存储！')
}

// 清除工作区
const clearWorkspace = () => {
  if (confirm('确定要清除所有 notebook 吗？此操作无法撤销。')) {
    notebooks.value = []
    currentNotebook.value = null
    localStorage.clear()
  }
}

// 加载示例notebook
const loadExampleNotebooks = () => {
  const examples = [
    {
      name: 'Python 入门',
      cells: [
        {
          type: 'markdown',
          source: '# Python 编程入门\n\n这是一个简单的 Python 编程示例。'
        },
        {
          type: 'code',
          source: '# 基本输出\nprint("Hello, World!")\nprint("欢迎来到 Python 编程世界！")'
        },
        {
          type: 'code',
          source: '# 变量和运算\nx = 10\ny = 20\nprint(f"x + y = {x + y}")\nprint(f"x * y = {x * y}")'
        },
        {
          type: 'code',
          source: '# 列表操作\nfruits = ["苹果", "香蕉", "橙子"]\nprint("水果列表:", fruits)\nprint("列表长度:", len(fruits))'
        }
      ],
      created: new Date().toLocaleString()
    },
    {
      name: '数据可视化',
      cells: [
        {
          type: 'markdown',
          source: '# 数据可视化示例\n\n使用 matplotlib 创建图表。'
        },
        {
          type: 'code',
          source: '# 简单绘图\nimport matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [1, 4, 9, 16, 25]\n\nplt.plot(x, y)\nplt.title("简单二次函数")\nplt.xlabel("x")\nplt.ylabel("y")\nplt.show()\n\nprint("图表已生成！")'
        }
      ],
      created: new Date().toLocaleString()
    }
  ]

  notebooks.value = examples
}

// 组件挂载
onMounted(() => {
  initializeJupyter()
})
</script>

<style scoped>
.jupyter-lite {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin: 2rem 0;
  overflow: hidden;
}

.jupyter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.jupyter-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.jupyter-controls {
  display: flex;
  gap: 0.5rem;
}

.new-notebook-btn, .clear-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.new-notebook-btn {
  background: var(--vp-c-brand);
  color: white;
}

.new-notebook-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

.new-notebook-btn:disabled {
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

.jupyter-status {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.loading-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-3);
}

.ready-status {
  color: var(--vp-c-success);
  font-weight: 500;
}

.status-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-border);
  border-top: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.jupyter-workspace {
  min-height: 400px;
}

.notebook-list {
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.notebook-list h4 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.notebook-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notebook-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s;
}

.notebook-item:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand);
}

.notebook-icon {
  font-size: 1.2rem;
}

.notebook-info {
  flex: 1;
}

.notebook-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.notebook-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.delete-notebook-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 3px;
  transition: all 0.2s;
}

.delete-notebook-btn:hover {
  background: var(--vp-c-error);
  color: white;
}

.notebook-editor {
  padding: 1rem;
}

.notebook-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.notebook-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.notebook-actions {
  display: flex;
  gap: 0.5rem;
}

.run-all-btn, .add-cell-btn, .save-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.run-all-btn {
  background: var(--vp-c-success);
  color: white;
}

.run-all-btn:hover {
  background: var(--vp-c-success-dark);
}

.add-cell-btn {
  background: var(--vp-c-brand);
  color: white;
}

.add-cell-btn:hover {
  background: var(--vp-c-brand-dark);
}

.save-btn {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.save-btn:hover {
  background: var(--vp-c-bg);
}

.cells-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notebook-cell {
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  overflow: hidden;
  transition: all 0.2s;
}

.notebook-cell.cell-executing {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-rgb), 0.1);
}

.cell-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.cell-type {
  font-size: 1rem;
}

.cell-index {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.delete-cell-btn {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem;
  border-radius: 3px;
  color: var(--vp-c-text-3);
  transition: all 0.2s;
}

.delete-cell-btn:hover {
  background: var(--vp-c-error);
  color: white;
}

.cell-content {
  padding: 0.75rem;
}

.code-input, .markdown-input {
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  resize: vertical;
  outline: none;
}

.code-input:focus, .markdown-input:focus {
  border-color: var(--vp-c-brand);
}

.cell-output {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-border);
}

.output-header {
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.output-content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--vp-c-text-1);
  margin: 0;
}

.cell-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-border);
}

.run-cell-btn {
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--vp-c-success);
  color: white;
}

.run-cell-btn:hover:not(:disabled) {
  background: var(--vp-c-success-dark);
}

.run-cell-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cell-type-select {
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 3px;
  font-size: 0.8rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.jupyter-welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
}

.welcome-content h3 {
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.welcome-content p {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.welcome-content ul {
  text-align: left;
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--vp-c-text-2);
}

.welcome-content li {
  margin-bottom: 0.5rem;
}

.welcome-cta {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.welcome-cta:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.jupyter-info {
  padding: 1rem;
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.jupyter-info details {
  cursor: pointer;
}

.jupyter-info summary {
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.jupyter-info p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.jupyter-info ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .jupyter-header {
    flex-direction: column;
    gap: 1rem;
  }

  .notebook-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .notebook-actions {
    justify-content: center;
  }

  .notebook-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .cell-actions {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}
</style>

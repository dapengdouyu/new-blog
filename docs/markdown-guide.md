---
title: Markdown 扩展指南
---

# Markdown 扩展指南

这个页面展示了你的 VitePress 博客支持的所有 Markdown 扩展功能。

## Vue 组件

### 计数器

```markdown
<Counter title="我的计数器" :initial-count="10" />
```

<Counter title="我的计数器" :initial-count="10" />

### 代码片段

```markdown
<CodeSnippet
  :code="`function hello() {\n  return 'Hello World!';\n}`"
  language="javascript"
/>
```

<CodeSnippet
  :code="`function hello() {\n  return 'Hello World!';\n}`"
  language="javascript"
/>

### 警告提示

```markdown
<Alert type="info">这是一条信息</Alert>
<Alert type="success">操作成功</Alert>
<Alert type="warning">请注意</Alert>
<Alert type="error">发生错误</Alert>
```

<Alert type="info">这是一条信息</Alert>
<Alert type="success">操作成功</Alert>
<Alert type="warning">请注意</Alert>
<Alert type="error">发生错误</Alert>

### 卡片

```markdown
<Card size="medium">
  <template #header>
    <h3>卡片标题</h3>
  </template>
  卡片内容
  <template #footer>
    卡片底部
  </template>
</Card>
```

<Card size="medium">
  <template #header>
    <h3>卡片标题</h3>
  </template>
  卡片内容
  <template #footer>
    卡片底部
  </template>
</Card>

### 阅读进度

```markdown
<ReadingProgress />
```

<ReadingProgress />

### 时间线

```markdown
<Timeline
  :items="[
    { title: '事件1', date: '2024-01-01', content: '事件描述' },
    { title: '事件2', date: '2024-01-02', content: '另一个事件' }
  ]"
/>
```

<Timeline
  :items="[
    { title: 'Vue 3 发布', date: '2022-02-07', content: 'Vue 3 正式版发布' },
    { title: 'VitePress 发布', date: '2021-04-21', content: '基于 Vite 的静态站点生成器' }
  ]"
/>

## Markdown 扩展

### 自定义容器

```markdown
::: tip 提示
这是一个提示容器
:::

::: warning 警告
这是一个警告容器
:::

::: danger 危险
这是一个危险容器
:::

::: info 信息
这是一个信息容器
:::

::: details 查看详情
这是一个可展开的详情容器
:::
```

::: tip 提示
这是一个提示容器
:::

::: warning 警告
这是一个警告容器
:::

::: danger 危险
这是一个危险容器
:::

::: info 信息
这是一个信息容器
:::

::: details 查看详情
这是一个可展开的详情容器
:::

### 代码块扩展

#### 带行号的代码块

```javascript
function hello() {
  console.log('Hello World!')
  return 'Hello'
}
```

#### 语法高亮

```python
def hello():
    print("Hello World!")
    return "Hello"
```

#### 行高亮

```javascript {1,3-5}
function hello() {
  console.log('Hello World!') // 高亮这一行
  return 'Hello'
}
```

### 导入代码片段

#### 导入完整文件

```markdown
<<< @/snippets/hello.js
```

<<< @/snippets/hello.js

#### 导入文件区域

```markdown
<<< @/snippets/snippet-with-region.js#snippet{1,2 ts:line-numbers} [snippet with region]
```

<<< @/snippets/snippet-with-region.js#snippet{1,2 ts:line-numbers} [snippet with region]

#### 导入Vue组件

```markdown
<<< @/snippets/vue-component.vue
```

<<< @/snippets/vue-component.vue

#### 导入TypeScript代码

```markdown
<<< @/snippets/typescript-example.ts
```

<<< @/snippets/typescript-example.ts

#### 导入Python代码

```markdown
<<< @/snippets/python-example.py
```

<<< @/snippets/python-example.py

#### 导入JavaScript工具函数

```markdown
<<< @/snippets/utils.js#debounce
```

<<< @/snippets/utils.js#debounce

### 代码组

使用代码组可以让用户在不同代码示例之间切换：

````markdown
::: code-group

```javascript [JavaScript]
function hello() {
  console.log('Hello from JavaScript!')
}
```

```python [Python]
def hello():
    print("Hello from Python!")
```

```typescript [TypeScript]
function hello(): void {
  console.log('Hello from TypeScript!')
}
```

:::
````

::: code-group

```javascript [JavaScript]
function hello() {
  console.log('Hello from JavaScript!')
}
```

```python [Python]
def hello():
    print("Hello from Python!")
```

```typescript [TypeScript]
function hello(): void {
  console.log('Hello from TypeScript!')
}
```

:::

### 表格

| 功能 | 描述 | 状态 |
|------|------|------|
| Vue 组件 | 在 Markdown 中使用 Vue 组件 | ✅ |
| 自定义容器 | 扩展的容器语法 | ✅ |
| 代码高亮 | 语法高亮和行号 | ✅ |
| 图片懒加载 | 自动图片懒加载 | ✅ |

### 任务列表

- [x] Vue 组件支持
- [x] 自定义容器
- [x] 代码高亮
- [x] 图片懒加载
- [ ] 数学公式 (可选)

### Emoji

🎉 ✨ 🚀 🔥 💯

### 链接

[内部链接](/playground) | [外部链接](https://vuejs.org/)

### 图片 (支持懒加载)

![Vue Logo](https://vuejs.org/logo.svg)

## Vue 语法

### 插值

当前时间: {{ new Date().toLocaleString() }}

### 指令

#### v-for

<span v-for="i in 5" :key="i">{{ i }} </span>

#### v-if / v-else

<div v-if="Math.random() > 0.5">随机显示的内容</div>
<div v-else>或者显示这个</div>

#### v-bind

<div :class="{ active: Math.random() > 0.5 }">动态样式</div>

## 快速开始

1. **创建新文章**: 在 `docs/posts/` 目录下创建 `.md` 文件
2. **使用组件**: 直接在 Markdown 中使用 `<ComponentName />`
3. **添加样式**: 使用 scoped 样式或 CSS 变量
4. **自定义容器**: 使用 `::: type 标题` 语法

## Python 代码运行器

### 基本使用

```markdown
<PythonRunner />
```

<PythonRunner />

### 功能特性

- **实时执行**: 在浏览器中直接运行 Python 代码
- **输出捕获**: 显示 print 语句和执行结果
- **错误处理**: 显示语法错误和运行时错误
- **代码编辑**: 内置代码编辑器，支持语法高亮

### 使用方法

1. 在代码编辑器中输入 Python 代码
2. 点击"运行代码"按钮
3. 查看输出结果区域的执行结果
4. 如需清除输出，点击"清除输出"按钮

## JupyterLite 环境

```markdown
<JupyterLite />
```

### JupyterLite 功能特性

- **完整 Notebook**: 完整的 Jupyter Notebook 体验
- **多种单元格**: 支持代码和 Markdown 单元格
- **交互式执行**: 逐个运行或批量执行单元格
- **数据可视化**: 支持 matplotlib, plotly 等绘图库
- **科学计算**: 集成 numpy, pandas, scipy 等库

### JupyterLite 使用方法

1. 点击"新建 Notebook"创建新的 notebook
2. 在单元格中输入代码或 Markdown
3. 使用工具栏按钮运行单元格或整个 notebook
4. 保存 notebook 到浏览器存储

### 示例场景

- **编程学习**: 交互式 Python 编程练习
- **数据分析**: 使用 pandas 处理和分析数据
- **科学计算**: 进行数学计算和可视化
- **教学演示**: 创建包含代码和说明的教学内容

更多用法请查看 [VitePress 官方文档](https://vitepress.dev/)。

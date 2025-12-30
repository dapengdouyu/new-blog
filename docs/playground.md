---
title: Interactive Playground
---

# Interactive Vue Playground

Learn Vue 3 concepts with interactive examples!

## 基础组件

### 计数器

<Counter title="简单计数器" :initial-count="5" />

### 自定义代码组件

<CodeSnippet
  :code="`const hello = 'Hello Vue in Markdown!';\nconsole.log(hello);`"
  language="javascript"
/>

### 阅读进度增强版

<ReadingProgress />

### 导入代码片段演示

#### 导入完整文件

<<< @/snippets/hello.js

#### 导入文件区域

<<< @/snippets/snippet-with-region.js#snippet{1,2 ts:line-numbers} [snippet with region]

#### 导入Vue组件

<<< @/snippets/vue-component.vue

#### 导入TypeScript

<<< @/snippets/typescript-example.ts

#### 导入Python

<<< @/snippets/python-example.py

#### 导入工具函数

<<< @/snippets/utils.js#debounce

### 代码组演示

::: code-group

```bash [npm]
npm install vitepress
```

```bash [yarn]
yarn add vitepress
```

```bash [pnpm]
pnpm add vitepress
```

:::

::: code-group

```javascript [ES6]
const greet = (name) => `Hello, ${name}!`
```

```javascript [CommonJS]
function greet(name) {
  return 'Hello, ' + name + '!'
}
```

```typescript [TypeScript]
function greet(name: string): string {
  return `Hello, ${name}!`
}
```

:::

### Python 代码运行器

<PythonRunner />

## 布局组件

### 标签页

<Tabs
  :tabs="[
    { title: 'Vue 3', content: 'Vue 3 带来了 Composition API、更好的性能和更小的包体积。' },
    { title: 'VitePress', content: 'VitePress 是基于 Vite 的静态站点生成器，专为文档设计。' },
    { title: 'Markdown', content: 'Markdown 是一种轻量级标记语言，使用简单的语法格式化文本。' }
  ]"
  :default-active="0"
/>

### 卡片

<Card size="medium">
  <template #header>
    <h3>Vue 3 特性</h3>
  </template>
  <ul>
    <li>Composition API</li>
    <li>更好的 TypeScript 支持</li>
    <li>更快的运行时性能</li>
    <li>更小的包体积</li>
  </ul>
  <template #footer>
    <small>Vue 3 正式版发布于 2022 年</small>
  </template>
</Card>

## 提示组件

### 警告提示

<Alert type="warning">
  <template #icon>⚠️</template>
  这是一个警告提示！
</Alert>

<Alert type="success">
  操作成功完成！
</Alert>

<Alert type="error">
  发生了一个错误！
</Alert>

<Alert type="info">
  这是一条信息提示。
</Alert>

## 时间线

<Timeline
  :items="[
    { title: 'Vue 3 发布', date: '2022-02-07', content: 'Vue 3 正式版发布，带来 Composition API 等新特性' },
    { title: 'VitePress 发布', date: '2021-04-21', content: 'VitePress 基于 Vite 的静态站点生成器发布' },
    { title: 'Vue 3.3 发布', date: '2023-05-11', content: 'Vue 3.3 版本发布，包含重要性能优化' }
  ]"
/>

## Markdown 扩展演示

### 自定义容器

::: tip 提示
这是一个提示容器
:::

::: warning 注意
这是一个警告容器
:::

::: danger 危险
这是一个危险容器
:::

::: details 查看详情
这是一个可展开的详情容器
:::

### 表格

| 组件 | 描述 | 状态 |
|------|------|------|
| Counter | 计数器组件 | ✅ 完成 |
| Alert | 警告提示 | ✅ 完成 |
| Card | 卡片布局 | ✅ 完成 |
| Tabs | 标签页 | ✅ 完成 |

### 代码块 (带行号)

```javascript {1,3-5}
function hello() {
  console.log('Hello Vue!') // 高亮这一行
  return 'Hello World'
}
```

### 任务列表

- [x] 创建基础组件
- [x] 添加布局组件
- [x] 实现提示系统
- [ ] 添加更多交互功能

## 阅读进度

<ReadingProgress />

<script setup>
// 这里可以添加一些简单的 Vue 逻辑
</script>

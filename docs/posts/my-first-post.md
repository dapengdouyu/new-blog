# My First Blog Post

<ReadingProgress />

Welcome to my new blog! This is the beginning of my journey in writing and sharing my thoughts with the world.

## Why I chose VitePress

I decided to use VitePress for my blog because:

- It's fast and efficient
- Easy to write in Markdown
- Built with Vue 3 which I love
- Has great SEO capabilities

## Vue in Markdown Demo

现在让我展示一些 Vue 在 Markdown 中的用法！

### 插值语法

当前时间是: {{ new Date().toLocaleString() }}

### 动态计数器

试试这个交互式计数器：

<Counter title="访客计数器" :initial-count="42" />

### 使用指令

这里有一个简单的循环展示：

<span v-for="tech in ['Vue', 'VitePress', 'TypeScript', 'Markdown']" :key="tech">
  {{ tech }}
</span>

### 自定义代码片段组件

<CodeSnippet
  :code="`function hello() {\n  console.log('Hello from Vue in Markdown!');\n  return 'Welcome!';\n}`"
  language="javascript"
/>

## What to expect

In future posts, I'll be sharing:

- Technical tutorials
- Personal experiences
- Thoughts on web development
- Book reviews

<script setup>
import { ref } from 'vue'

const visitorCount = ref(42)
</script>
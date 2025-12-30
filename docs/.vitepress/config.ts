import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  title: 'My Blog',
  description: 'A blog built with VitePress and Vue',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '指南', items: [
        { text: 'Markdown 指南', link: '/markdown-guide' },
        { text: '阅读进度指南', link: '/reading-progress-guide' }
      ]},
      { text: '游乐场', link: '/playground' },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: '文章',
          items: [
            { text: '我的第一篇文章', link: '/posts/my-first-post' }
          ]
        }
      ]
    }
  },
  markdown: {
    // 启用图片懒加载
    image: {
      lazyLoading: true
    },
    // 自定义容器标签
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    // 启用代码块行号
    lineNumbers: true,
    // 目录配置
    toc: {
      level: [2, 3, 4]
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    }
  }
})
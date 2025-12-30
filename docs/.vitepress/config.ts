import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  title: 'My Blog',
  description: 'A blog built with VitePress and Vue',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about' },
      { text: '游乐场', link: '/playground' }
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
  // markdown: {
  //   // 如需数学公式支持，可取消注释并安装 markdown-it-mathjax3
  //   math: true
  // },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    }
  }
})
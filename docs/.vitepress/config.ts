import { defineConfig } from 'vitepress'
import { join } from 'path'
import type { DefaultTheme } from 'vitepress'
import { generateSidebarConfig, generateNavConfig } from './utils/sidebarGenerator'

// 获取 docs 目录路径
const DOCS_DIR: string = join(process.cwd(), 'docs')

// 生成 sidebar 配置，同时获取已使用的路径集合
const { sidebar, sidebarPaths } = generateSidebarConfig(DOCS_DIR)

// 生成 nav 配置，排除 sidebar 中已使用的目录
const nav = generateNavConfig(DOCS_DIR, sidebarPaths) as DefaultTheme.NavItem[]

export default defineConfig({
  title: '我的博客',
  description: '这是我的个人博客，分享技术、生活和思考',
  lang: 'zh-CN',

  vite: {
    ssr: {
      noExternal: ['@nolebase/vitepress-plugin-breadcrumbs'],
    },
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-breadcrumbs/client'],
    },
  },

  markdown: {
    // 启用行号
    lineNumbers: true,
    // 配置容器支持
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
  },

  themeConfig: {
    nav,
    sidebar,
  },
})

import { defineConfig } from 'vitepress'
import { join } from 'path'
import { generateSidebarConfig, generateNavConfig } from './utils/sidebarGenerator'

// 获取 docs 目录路径
const DOCS_DIR: string = join(process.cwd(), 'docs')
console.log(generateNavConfig(DOCS_DIR),'generateNavConfig')
console.log(generateSidebarConfig(DOCS_DIR),'generateSidebarConfig')
export default defineConfig({
  title: '我的博客',
  description: '这是我的个人博客，分享技术、生活和思考',
  lang: 'zh-CN',
  
  themeConfig: {
    nav: generateNavConfig(DOCS_DIR),
    sidebar: generateSidebarConfig(DOCS_DIR)
  }
})

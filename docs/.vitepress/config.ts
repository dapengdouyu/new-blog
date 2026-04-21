import { defineConfig } from 'vitepress'
import { join } from 'path'
import { readdirSync } from 'fs'
import type { DefaultTheme } from 'vitepress'

interface CategoryNames {
  sidebar: string
  nav: string
}

const NAME_MAP: Record<string, CategoryNames> = {
  'golang':    { sidebar: 'Go语言',          nav: 'Go语言' },
  'core':      { sidebar: 'Go语言核心教程',   nav: '核心教程' },
  'gin':       { sidebar: 'Gin框架教程',      nav: 'Gin框架' },
  'gorm':      { sidebar: 'GORM教程',         nav: 'GORM' },
  'kratos':    { sidebar: 'Kratos框架教程',   nav: 'Kratos' },
  'wasm':      { sidebar: 'WebAssembly教程',  nav: 'WebAssembly' },
  'nginx':     { sidebar: 'Nginx教程',        nav: 'Nginx' },
  'network':   { sidebar: '网络问题',         nav: '网络' },
  'python':    { sidebar: 'Python教程',       nav: 'Python' },
  'question':  { sidebar: '日常问题',         nav: '日常问题' },
  'kafka':     { sidebar: 'Kafka教程',        nav: 'Kafka' },
  'langgraph': { sidebar: 'LangGraph教程',    nav: 'LangGraph' },
  '学车教程':   { sidebar: '学车教程',         nav: '学车教程' },
  '开车小技巧': { sidebar: '开车小技巧',       nav: '开车小技巧' },
  '技术问题':   { sidebar: '技术问题',         nav: '技术问题' },
}

function getDisplayName(dirName: string, variant: 'sidebar' | 'nav'): string {
  return NAME_MAP[dirName]?.[variant] ?? dirName
}

function generateSidebarItems(dirPath: string, basePath: string) {
  const files = readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .filter(name => name !== 'index.md')

  files.sort((a, b) => {
    const numA = parseInt(a.match(/^\d+/)?.[0] || '0')
    const numB = parseInt(b.match(/^\d+/)?.[0] || '0')
    return numA - numB
  })

  return files.map(file => {
    const fileName = file.replace('.md', '')
    const link = `${basePath}${fileName}`
    return {
      text: fileName,
      link
    }
  })
}

function generateSidebar() {
  const sidebar: DefaultTheme.Sidebar = {}
  const articleDir = join(__dirname, '../article')

  function processDirectory(dirPath: string, urlBase: string) {
    const entries = readdirSync(dirPath, { withFileTypes: true })
    const subDirs = entries.filter(e => e.isDirectory())
    const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')

    if (mdFiles.length > 0) {
      const dirName = dirPath.split('/').pop()!
      const items = generateSidebarItems(dirPath, urlBase)
      sidebar[urlBase] = [{
        text: getDisplayName(dirName, 'sidebar'),
        link: urlBase,
        items
      }]
    }

    for (const subDir of subDirs) {
      processDirectory(
        join(dirPath, subDir.name),
        `${urlBase}${subDir.name}/`
      )
    }
  }

  const firstLevelDirs = readdirSync(articleDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())

  for (const dir of firstLevelDirs) {
    processDirectory(
      join(articleDir, dir.name),
      `/article/${dir.name}/`
    )
  }

  return sidebar
}

function generateNav() {
  const nav: DefaultTheme.NavItem[] = [
    { text: '首页', link: '/article/' }
  ]
  const articleDir = join(__dirname, '../article')

  const firstLevelDirs = readdirSync(articleDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const dirName of firstLevelDirs) {
    const dirPath = join(articleDir, dirName)
    const subDirs = readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    if (subDirs.length > 0) {
      const items: DefaultTheme.NavItem[] = []

      const hasOwnFiles = readdirSync(dirPath, { withFileTypes: true })
        .some(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')

      if (hasOwnFiles) {
        items.push({
          text: getDisplayName(dirName, 'nav'),
          link: `/article/${dirName}/`
        })
      }

      for (const subDir of subDirs) {
        items.push({
          text: getDisplayName(subDir.name, 'nav'),
          link: `/article/${dirName}/${subDir.name}/`
        })
      }

      nav.push({
        text: getDisplayName(dirName, 'nav'),
        items
      })
    } else {
      nav.push({
        text: getDisplayName(dirName, 'nav'),
        link: `/article/${dirName}/`
      })
    }
  }

  return nav
}

export default defineConfig({
  title: '我的博客',
  description: '这是我的个人博客，分享技术、生活和思考',
  lang: 'zh-CN',
  base: '/',
  ignoreDeadLinks: true,

  vite: {
    ssr: {
      noExternal: ['@nolebase/vitepress-plugin-breadcrumbs'],
    },
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-breadcrumbs/client'],
    },
  },

  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
  },

  themeConfig: {
    nav: generateNav(),

    sidebar: generateSidebar()
  },
})

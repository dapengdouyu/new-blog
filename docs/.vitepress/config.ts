import { defineConfig } from 'vitepress'
import { join } from 'path'
import { readdirSync } from 'fs'
import type { DefaultTheme } from 'vitepress'

// 动态生成侧边栏配置
function generateSidebar() {
  const sidebar: DefaultTheme.Sidebar = {}
  const articleDir = join(__dirname, '../article')

  // 遍历一级目录
  const firstLevelDirs = readdirSync(articleDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const firstLevel of firstLevelDirs) {
    const firstLevelPath = join(articleDir, firstLevel)
    
    // 处理 golang 特殊情况，它有子目录
    if (firstLevel === 'golang') {
      const golangSubDirs = readdirSync(firstLevelPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      for (const subDir of golangSubDirs) {
        const subDirPath = join(firstLevelPath, subDir)
        const sidebarPath = `/article/${firstLevel}/${subDir}/`
        const items = generateSidebarItems(subDirPath, sidebarPath)
        
        sidebar[sidebarPath] = [{
          text: getDirDisplayName(subDir),
          link: sidebarPath,
          items
        }]
      }
    } else {
      // 其他一级目录直接处理
      const sidebarPath = `/article/${firstLevel}/`
      const items = generateSidebarItems(firstLevelPath, sidebarPath)
      
      sidebar[sidebarPath] = [{
        text: getDirDisplayName(firstLevel),
        link: sidebarPath,
        items
      }]
    }
  }

  return sidebar
}

// 生成单个目录的侧边栏项
function generateSidebarItems(dirPath: string, basePath: string) {
  const files = readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .filter(name => name !== 'index.md') // 排除 index.md

  // 排序文件，确保数字编号的文件按顺序排列
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

// 获取目录的显示名称
function getDirDisplayName(dirName: string) {
  const nameMap: Record<string, string> = {
    'core': 'Go语言核心教程',
    'gin': 'Gin框架教程',
    'gorm': 'GORM教程',
    'kratos': 'Kratos框架教程',
    'wasm': 'WebAssembly教程',
    'nginx': 'Nginx教程',
    'network': '网络问题',
    'python': 'Python教程',
    'question': '日常问题',
    'kafka': 'Kafka教程'
  }
  return nameMap[dirName] || dirName
}

// 动态生成导航配置
function generateNav() {
  const nav: DefaultTheme.NavItem[] = [
    {
      text: '首页',
      link: '/article/'
    }
  ]
  const articleDir = join(__dirname, '../article')

  // 遍历一级目录
  const firstLevelDirs = readdirSync(articleDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const firstLevel of firstLevelDirs) {
    // 处理 golang 特殊情况，它有子目录
    if (firstLevel === 'golang') {
      const golangSubDirs = readdirSync(join(articleDir, firstLevel), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      const golangItems: DefaultTheme.NavItem[] = golangSubDirs.map(subDir => ({
        text: getNavItemDisplayName(subDir),
        link: `/article/${firstLevel}/${subDir}/`
      }))

      nav.push({
        text: 'Go语言',
        items: golangItems
      })
    } else {
      // 其他一级目录直接处理
      nav.push({
        text: getNavItemDisplayName(firstLevel),
        link: `/article/${firstLevel}/`
      })
    }
  }

  return nav
}

// 获取导航项的显示名称
function getNavItemDisplayName(dirName: string) {
  const nameMap: Record<string, string> = {
    'core': '核心教程',
    'gin': 'Gin框架',
    'gorm': 'GORM',
    'kratos': 'Kratos',
    'wasm': 'WebAssembly',
    'nginx': 'Nginx',
    'network': '网络',
    'python': 'Python',
    'question': '日常问题',
    'kafka': 'Kafka'
  }
  return nameMap[dirName] || dirName
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

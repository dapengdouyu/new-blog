// 自动生成侧边栏和导航配置
import { readdirSync, readFileSync, Dirent } from 'fs'
import { join, extname, basename } from 'path'

// VitePress 主题配置类型
export interface NavItem {
  text: string
  link: string
}

export interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
}

export interface SidebarConfig {
  [key: string]: SidebarItem[]
}

/**
 * 过滤目录项，排除特殊目录
 */
export function isContentDirectory(item: Dirent): boolean {
  const excludedDirs: string[] = ['.vitepress', 'components']
  return item.isDirectory() && !excludedDirs.includes(item.name)
}

/**
 * 从 Markdown 文件的 frontmatter 中提取标题
 */
export function extractTitleFromMarkdown(filePath: string): string {
  try {
    const content: string = readFileSync(filePath, 'utf-8')
    const titleMatch: RegExpMatchArray | null = content.match(/^---[\s\S]*?title: ([\s\S]*?)\n[\s\S]*?---/)
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim().replace(/['"]/g, '')
    }
    return basename(filePath, '.md')
  } catch (error) {
    console.error(`Error extracting title from ${filePath}:`, error)
    return basename(filePath, '.md')
  }
}

/**
 * 获取文档目录下的顶层内容目录
 */
export function getTopLevelContentDirs(docsDir: string): string[] {
  return readdirSync(docsDir, { withFileTypes: true })
    .filter(isContentDirectory)
    .map(item => item.name)
}

/**
 * 递归生成侧边栏项
 */
export function generateSidebarItems(baseDir: string, baseUrl: string, currentDir: string = ''): SidebarItem[] {
  const items: SidebarItem[] = []
  const fullDirPath: string = join(baseDir, currentDir)
  
  try {
    const itemsInDir: Dirent[] = readdirSync(fullDirPath, { withFileTypes: true })
    
    // 处理文件
    const mdFiles: Dirent[] = itemsInDir
      .filter(item => item.isFile() && extname(item.name) === '.md' && item.name !== 'index.md')
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    
    for (const file of mdFiles) {
      const filePath: string = join(fullDirPath, file.name)
      const title: string = extractTitleFromMarkdown(filePath)
      const fileUrl: string = `${baseUrl}${currentDir}${currentDir ? '/' : ''}${file.name.replace('.md', '')}`
      
      items.push({
        text: title,
        link: fileUrl
      })
    }
    
    // 处理子目录（递归）
    const subDirs: Dirent[] = itemsInDir
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    
    for (const subDir of subDirs) {
      const subDirPath: string = join(currentDir, subDir.name)
      const subItems: SidebarItem[] = generateSidebarItems(baseDir, baseUrl, subDirPath)
      
      if (subItems.length > 0) {
        items.push({
          text: subDir.name,
          items: subItems
        })
      }
    }
  } catch (error) {
    console.error(`Error generating sidebar items for ${fullDirPath}:`, error)
  }
  
  return items
}

/**
 * 生成完整的侧边栏配置
 */
export function generateSidebarConfig(docsDir: string): SidebarConfig {
  const sidebar: SidebarConfig = {}
  const topLevelDirs: string[] = getTopLevelContentDirs(docsDir)
  
  for (const dir of topLevelDirs) {
    const dirPath: string = join(docsDir, dir)
    const baseUrl: string = `/${dir}/`
    
    const sidebarItems: SidebarItem[] = generateSidebarItems(dirPath, baseUrl)
    
    if (sidebarItems.length > 0) {
      sidebar[baseUrl] = [
        {
          text: dir,
          items: sidebarItems
        }
      ]
    }
  }
  
  return sidebar
}

/**
 * 生成导航栏配置
 */
export function generateNavConfig(docsDir: string): NavItem[] {
  const nav: NavItem[] = [
    {
      text: '首页',
      link: '/' 
    }
  ]
  
  const topLevelDirs: string[] = getTopLevelContentDirs(docsDir)
  
  for (const dir of topLevelDirs) {
    nav.push({
      text: dir,
      link: `/${dir}/`
    })
  }
  
  return nav
}
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
 * 获取目录的显示文本
 * 优先从 .text 文件读取，如果没有则使用目录名
 */
export function getDirectoryText(dirPath: string, defaultName: string): string {
  try {
    const textFilePath: string = join(dirPath, '.text')
    const dirItems: Dirent[] = readdirSync(dirPath, { withFileTypes: true })
    
    if (dirItems.some(item => item.isFile() && item.name === '.text')) {
      const content: string = readFileSync(textFilePath, 'utf-8')
      const trimmed: string = content.trim()
      // 如果 .text 文件有内容，返回它；否则使用默认名称
      return trimmed || defaultName
    }
  } catch (error) {
    // 如果读取失败，使用默认名称
    console.warn(`Failed to read .text file from ${dirPath}:`, error)
  }
  return defaultName
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
 * @param baseDir 基础目录路径（docs目录）
 * @param baseUrl 基础URL路径（如 /go/）
 * @param currentDir 当前处理的相对目录路径（如 core 或 技术问题）
 */
export function generateSidebarItems(baseDir: string, baseUrl: string, currentDir: string = ''): SidebarItem[] {
  const items: SidebarItem[] = []
  const fullDirPath: string = join(baseDir, currentDir)
  
  try {
    const itemsInDir: Dirent[] = readdirSync(fullDirPath, { withFileTypes: true })
    
    // 1. 先处理当前目录下的 Markdown 文件（不包括 index.md，它作为目录入口）
    const mdFiles: Dirent[] = itemsInDir
      .filter(item => item.isFile() && extname(item.name) === '.md' && item.name !== 'index.md')
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    
    for (const file of mdFiles) {
      const filePath: string = join(fullDirPath, file.name)
      const title: string = extractTitleFromMarkdown(filePath)
      // 构建文件URL：baseUrl + currentDir + filename
      const fileUrl: string = currentDir 
        ? `${baseUrl}${currentDir}/${file.name.replace('.md', '')}`
        : `${baseUrl}${file.name.replace('.md', '')}`
      
      items.push({
        text: title,
        link: fileUrl
      })
    }
    
    // 2. 处理子目录（递归），放在文件之后
    const subDirs: Dirent[] = itemsInDir
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    
    for (const subDir of subDirs) {
      const subDirPath: string = currentDir ? join(currentDir, subDir.name) : subDir.name
      const subDirFullPath: string = join(baseDir, subDirPath)
      
      // 获取子目录的显示文本：优先从 .text 文件读取，其次从 index.md，最后使用目录名
      let subDirTitle: string = subDir.name
      const subDirIndexPath: string = join(subDirFullPath, 'index.md')
      // 子目录的链接：baseUrl + subDirPath + /
      const subDirLink: string = `${baseUrl}${subDirPath}/`
      
      try {
        const subDirItems: Dirent[] = readdirSync(subDirFullPath, { withFileTypes: true })
        const hasIndex: boolean = subDirItems.some(item => item.isFile() && item.name === 'index.md')
        
        // 优先使用 .text 文件，其次使用 index.md 的标题，最后使用目录名
        subDirTitle = getDirectoryText(subDirFullPath, subDir.name)
        if (subDirTitle === subDir.name && hasIndex) {
          subDirTitle = extractTitleFromMarkdown(subDirIndexPath)
        }
        
        // 递归获取子目录的内容
        const subItems: SidebarItem[] = generateSidebarItems(baseDir, baseUrl, subDirPath)
        
        // 如果子目录有内容（index.md 或其他文件/子目录），添加到侧边栏
        if (hasIndex || subItems.length > 0) {
          items.push({
            text: subDirTitle,
            link: subDirLink,
            items: subItems.length > 0 ? subItems : undefined
          })
        }
      } catch (e) {
        console.error(`Error processing subdirectory ${subDirFullPath}:`, e)
      }
    }
  } catch (error) {
    console.error(`Error generating sidebar items for ${fullDirPath}:`, error)
  }
  
  return items
}

/**
 * 生成完整的侧边栏配置
 * 第一层目录作为导航栏，每个目录下的内容作为侧边栏
 */
export function generateSidebarConfig(docsDir: string): SidebarConfig {
  const sidebar: SidebarConfig = {}
  const topLevelDirs: string[] = getTopLevelContentDirs(docsDir)
  
  for (const dir of topLevelDirs) {
    const dirPath: string = join(docsDir, dir)
    const baseUrl: string = `/${dir}/`
    
    // 检查是否有 index.md
    const indexPath: string = join(dirPath, 'index.md')
    const hasIndex: boolean = readdirSync(dirPath, { withFileTypes: true })
      .some(item => item.isFile() && item.name === 'index.md')
    
    // 生成该目录下的所有侧边栏项（包括子目录和文件）
    const sidebarItems: SidebarItem[] = generateSidebarItems(dirPath, baseUrl)
    
    // 构建侧边栏配置
    const sidebarConfig: SidebarItem[] = []
    
    // 如果有 index.md，将其作为第一项
    if (hasIndex) {
      // 优先使用 .text 文件，其次使用 index.md 的标题，最后使用目录名
      let dirTitle: string = getDirectoryText(dirPath, dir)
      if (dirTitle === dir) {
        dirTitle = extractTitleFromMarkdown(indexPath)
      }
      sidebarConfig.push({
        text: dirTitle,
        link: baseUrl
      })
    }
    
    // 添加其他内容（文件和子目录）
    if (sidebarItems.length > 0) {
      sidebarConfig.push(...sidebarItems)
    }
    
    // 如果有任何内容，添加到侧边栏配置
    if (sidebarConfig.length > 0) {
      sidebar[baseUrl] = sidebarConfig
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
    const dirPath: string = join(docsDir, dir)
    const indexPath: string = join(dirPath, 'index.md')
    
    // 获取目录显示文本：优先从 .text 文件读取，其次从 index.md，最后使用目录名
    let dirTitle: string = getDirectoryText(dirPath, dir)
    
    // 如果没有 .text 文件，尝试从 index.md 提取标题
    if (dirTitle === dir) {
      try {
        if (readdirSync(dirPath, { withFileTypes: true })
          .some(item => item.isFile() && item.name === 'index.md')) {
          dirTitle = extractTitleFromMarkdown(indexPath)
        }
      } catch (e) {
        // 如果无法读取，使用目录名
      }
    }
    
    nav.push({
      text: dirTitle,
      link: `/${dir}/`
    })
  }
  
  return nav
}
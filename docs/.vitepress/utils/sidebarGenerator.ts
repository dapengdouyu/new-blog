// 自动生成侧边栏和导航配置
import { readdirSync, readFileSync, Dirent } from 'fs'
import { join, extname, basename } from 'path'

// VitePress 主题配置类型
export interface NavItem {
  text: string
  link?: string
  items?: NavItem[]
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
 * 从文件名提取序号（自然排序用）
 * 支持：1.xxx、1、xxx、1_xxx 等
 */
export function extractOrderFromName(name: string): number | null {
  const m = name.match(/^(\d+)\s*[._、-]/)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

export function stripLeadingOrder(text: string): string {
  return text.replace(/^\s*\d+\s*[._、-]\s*/, '').trim()
}

export function normalizeTitleWithFileOrder(fileName: string, title: string): string {
  const order = extractOrderFromName(fileName)
  if (order == null) return title

  const rest = stripLeadingOrder(title)
  // 用文件名序号兜底，避免 frontmatter 序号写错导致侧边栏显示异常
  return rest ? `${order}、${rest}` : `${order}、${stripLeadingOrder(basename(fileName, '.md'))}`
}

export function compareNamesNaturally(aName: string, bName: string): number {
  const aOrder = extractOrderFromName(aName)
  const bOrder = extractOrderFromName(bName)
  if (aOrder != null && bOrder != null) return aOrder - bOrder
  if (aOrder != null) return -1
  if (bOrder != null) return 1
  return aName.localeCompare(bName, 'zh-CN')
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
 * 检查目录是否包含Markdown文件（递归检查）
 */
export function hasMarkdownFiles(dirPath: string): boolean {
  try {
    const items: Dirent[] = readdirSync(dirPath, { withFileTypes: true })

    // 检查当前目录是否有md文件
    const hasMdFiles = items.some(item => item.isFile() && extname(item.name) === '.md')

    // 如果有md文件，直接返回true
    if (hasMdFiles) {
      return true
    }

    // 递归检查子目录
    const subDirs = items.filter(item => item.isDirectory())
    for (const subDir of subDirs) {
      if (hasMarkdownFiles(join(dirPath, subDir.name))) {
        return true
      }
    }

    return false
  } catch (error) {
    return false
  }
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
      .sort((a, b) => compareNamesNaturally(a.name, b.name))

    for (const file of mdFiles) {
      const filePath: string = join(fullDirPath, file.name)
      const rawTitle: string = extractTitleFromMarkdown(filePath)
      const title: string = normalizeTitleWithFileOrder(file.name, rawTitle)
      // 构建文件URL：baseUrl + currentDir + filename
      const fileUrl: string = currentDir
        ? `${baseUrl}${currentDir}/${file.name.replace('.md', '')}`
        : `${baseUrl}${file.name.replace('.md', '')}`

      items.push({
        text: title,
        link: fileUrl
      })
    }

    // 2. 处理子目录（递归），放在文件之后，只包含有md文件的目录
    const subDirs: Dirent[] = itemsInDir
      .filter(item => item.isDirectory() && hasMarkdownFiles(join(fullDirPath, item.name)))
      .sort((a, b) => compareNamesNaturally(a.name, b.name))

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

        // 只有当子目录有md文件时才添加到侧边栏
        if (hasMarkdownFiles(subDirFullPath)) {
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
 * 生成侧边栏项，只保留直接包含md文件的目录
 */
export function generateSidebarItemsFlat(baseDir: string, baseUrl: string, currentDir: string = ''): SidebarItem[] {
  const items: SidebarItem[] = []
  const fullDirPath: string = join(baseDir, currentDir)

  try {
    const itemsInDir: Dirent[] = readdirSync(fullDirPath, { withFileTypes: true })

    // 1. 处理当前目录下的 Markdown 文件
    const mdFiles: Dirent[] = itemsInDir
      .filter(item => item.isFile() && extname(item.name) === '.md')
      .sort((a, b) => compareNamesNaturally(a.name, b.name))

    for (const file of mdFiles) {
      const filePath: string = join(fullDirPath, file.name)
      const rawTitle: string = extractTitleFromMarkdown(filePath)
      const title: string = normalizeTitleWithFileOrder(file.name, rawTitle)
      const fileUrl: string = currentDir
        ? `${baseUrl}${currentDir}/${file.name.replace('.md', '')}`
        : `${baseUrl}${file.name.replace('.md', '')}`

      items.push({
        text: title,
        link: fileUrl
      })
    }

    // 2. 处理直接包含md文件的子目录（不递归，只显示一层）
    const subDirs: Dirent[] = itemsInDir
      .filter(item => item.isDirectory())
      .sort((a, b) => compareNamesNaturally(a.name, b.name))

    for (const subDir of subDirs) {
      const subDirPath: string = currentDir ? join(currentDir, subDir.name) : subDir.name
      const subDirFullPath: string = join(baseDir, subDirPath)

      try {
        const subDirItems: Dirent[] = readdirSync(subDirFullPath, { withFileTypes: true })

        // 检查子目录是否直接包含md文件
        const hasDirectMdFiles = subDirItems.some(item =>
          item.isFile() && extname(item.name) === '.md'
        )

        if (hasDirectMdFiles) {
          // 获取子目录的显示文本
          let subDirTitle: string = subDir.name
          const subDirIndexPath: string = join(subDirFullPath, 'index.md')
          const hasIndex: boolean = subDirItems.some(item => item.isFile() && item.name === 'index.md')

          subDirTitle = getDirectoryText(subDirFullPath, subDir.name)
          if (subDirTitle === subDir.name && hasIndex) {
            subDirTitle = extractTitleFromMarkdown(subDirIndexPath)
          }

          // 子目录的链接
          const subDirLink: string = `${baseUrl}${subDirPath}/`

          // 获取子目录下的md文件
          const subMdFiles: SidebarItem[] = []
          const sortedMdFiles = subDirItems
            .filter(item => item.isFile() && extname(item.name) === '.md')
            .sort((a, b) => compareNamesNaturally(a.name, b.name))

          for (const file of sortedMdFiles) {
            const filePath: string = join(subDirFullPath, file.name)
            const rawTitle: string = extractTitleFromMarkdown(filePath)
            const title: string = normalizeTitleWithFileOrder(file.name, rawTitle)
            const fileUrl: string = `${baseUrl}${subDirPath}/${file.name.replace('.md', '')}`

            subMdFiles.push({
              text: title,
              link: fileUrl
            })
          }

          // 添加子目录
          items.push({
            text: subDirTitle,
            link: subDirLink,
            items: subMdFiles.length > 0 ? subMdFiles : undefined
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
 * 只显示直接包含md文件的父级目录
 * @returns { sidebar: SidebarConfig, sidebarPaths: Set<string> } - 返回侧边栏配置和已使用的路径集合
 */
export function generateSidebarConfig(docsDir: string): { sidebar: SidebarConfig, sidebarPaths: Set<string> } {
  const sidebar: SidebarConfig = {}
  const sidebarPaths = new Set<string>()

  // 收集所有直接包含md文件的目录（包含完整的相对路径信息）
  function collectMdDirectories(baseDir: string, currentPath: string = ''): Array<{fullPath: string, relativePath: string, displayName: string}> {
    const result: Array<{fullPath: string, relativePath: string, displayName: string}> = []

    try {
      const items = readdirSync(baseDir, { withFileTypes: true })

      for (const item of items) {
        if (item.isDirectory()) {
          // 跳过特殊目录
          if (item.name.startsWith('.') || item.name === 'components') {
            continue
          }

          const itemPath = join(baseDir, item.name)
          // 使用 URL 格式（正斜杠）构建相对路径
          const itemRelativePath = currentPath ? `${currentPath}/${item.name}` : item.name
          const subItems = readdirSync(itemPath, { withFileTypes: true })

          // 检查当前目录是否直接包含md文件
          const hasDirectMd = subItems.some(subItem =>
            subItem.isFile() && extname(subItem.name) === '.md'
          )

          if (hasDirectMd) {
            // 如果直接包含md文件，添加到结果中
            result.push({
              fullPath: itemPath,
              relativePath: itemRelativePath,
              displayName: item.name  // 只显示最后一级目录名
            })
          } else {
            // 如果不直接包含md文件，继续递归查找
            const subResults = collectMdDirectories(itemPath, itemRelativePath)
            result.push(...subResults)
          }
        }
      }
    } catch (e) {
      console.error(`Error collecting MD directories from ${baseDir}:`, e)
    }

    return result
  }

  const topLevelDirs = getTopLevelContentDirs(docsDir)

  for (const topDir of topLevelDirs) {
    const topDirPath = join(docsDir, topDir)

    if (!hasMarkdownFiles(topDirPath)) {
      continue
    }

    // 收集该顶级目录下所有直接包含md文件的目录
    // 注意：顶级目录本身（如 docs/golang）也可能直接包含 index.md，需要纳入 sidebar key（/golang/）
    const mdDirectories: Array<{fullPath: string, relativePath: string, displayName: string}> = []
    try {
      const topDirItems = readdirSync(topDirPath, { withFileTypes: true })
      const hasTopDirectMd = topDirItems.some(item => item.isFile() && extname(item.name) === '.md')
      if (hasTopDirectMd) {
        mdDirectories.push({
          fullPath: topDirPath,
          relativePath: topDir,
          displayName: topDir
        })
      }
    } catch (e) {
      // ignore
    }
    mdDirectories.push(...collectMdDirectories(topDirPath, topDir))

    // 为每个包含md文件的目录生成侧边栏
    for (const dirInfo of mdDirectories) {
      const sidebarItems: SidebarItem[] = []

      try {
        const dirItems = readdirSync(dirInfo.fullPath, { withFileTypes: true })

        // 获取目录标题
        let dirTitle = dirInfo.displayName
        const dirIndexPath = join(dirInfo.fullPath, 'index.md')
        const hasIndex = dirItems.some(item => item.isFile() && item.name === 'index.md')

        dirTitle = getDirectoryText(dirInfo.fullPath, dirTitle)
        if (dirTitle === dirInfo.displayName && hasIndex) {
          dirTitle = extractTitleFromMarkdown(dirIndexPath)
        }

        // sidebar 的 key 必须匹配真实路由前缀，否则 VitePress 不会渲染侧边栏
        // 例如：docs/golang/core => key 必须是 /golang/core/（而不是 /core/）
        const actualBaseUrl = `/${dirInfo.relativePath}/`
        const sidebarKey = actualBaseUrl

        // 记录这个路径已被 sidebar 使用
        sidebarPaths.add(dirInfo.relativePath)

        // 添加目录入口（如果有index.md）
        if (hasIndex) {
          sidebarItems.push({
            text: dirTitle,
            link: actualBaseUrl
          })
        }

        // 添加md文件
        const mdFiles = dirItems
          .filter(item => item.isFile() && extname(item.name) === '.md' && item.name !== 'index.md')
          .sort((a, b) => compareNamesNaturally(a.name, b.name))

        for (const file of mdFiles) {
          const filePath = join(dirInfo.fullPath, file.name)
          const rawTitle = extractTitleFromMarkdown(filePath)
          const title = normalizeTitleWithFileOrder(file.name, rawTitle)
          const fileUrl = `${actualBaseUrl}${file.name.replace('.md', '')}`

          sidebarItems.push({
            text: title,
            link: fileUrl
          })
        }

        // 如果有内容，添加到侧边栏配置
        if (sidebarItems.length > 0) {
          sidebar[sidebarKey] = sidebarItems
        }

      } catch (e) {
        console.error(`Error processing directory ${dirInfo.fullPath}:`, e)
      }
    }
  }

  return { sidebar, sidebarPaths }
}

/**
 * 递归生成导航项（排除 sidebar 中已使用的目录）
 * @param baseDir 基础目录路径
 * @param currentPath 当前相对路径（URL 格式，使用正斜杠）
 * @param sidebarPaths sidebar 已使用的路径集合
 * @returns 导航项数组
 */
function generateNavItemsRecursive(
  baseDir: string,
  currentPath: string,
  sidebarPaths: Set<string>
): NavItem[] {
  const items: NavItem[] = []
  // 将 URL 格式的路径转换为文件系统路径
  const fullDirPath = join(baseDir, ...currentPath.split('/').filter(Boolean))

  try {
    const dirItems = readdirSync(fullDirPath, { withFileTypes: true })
    const subDirs = dirItems
      .filter(item => item.isDirectory() && !item.name.startsWith('.') && item.name !== 'components')
      .sort((a, b) => compareNamesNaturally(a.name, b.name))

    for (const subDir of subDirs) {
      // 构建 URL 格式的相对路径
      const subDirRelativePath = currentPath ? `${currentPath}/${subDir.name}` : subDir.name
      // 构建文件系统路径
      const subDirFullPath = join(baseDir, ...subDirRelativePath.split('/').filter(Boolean))

      // 如果这个目录在 sidebar 中，跳过
      if (sidebarPaths.has(subDirRelativePath)) {
        continue
      }

      // 检查子目录是否有内容（md文件或子目录）
      if (!hasMarkdownFiles(subDirFullPath)) {
        continue
      }

      // 获取目录标题
      let dirTitle = getDirectoryText(subDirFullPath, subDir.name)
      const subDirIndexPath = join(subDirFullPath, 'index.md')
      try {
        if (readdirSync(subDirFullPath, { withFileTypes: true })
          .some(item => item.isFile() && item.name === 'index.md')) {
          if (dirTitle === subDir.name) {
            dirTitle = extractTitleFromMarkdown(subDirIndexPath)
          }
        }
      } catch (e) {
        // ignore
      }

      // 递归获取子目录的导航项
      const subItems = generateNavItemsRecursive(baseDir, subDirRelativePath, sidebarPaths)

      // 构建导航项
      const navItem: NavItem = {
        text: dirTitle,
        link: `/${subDirRelativePath}/`
      }

      // 如果有子项，添加到 items 中
      if (subItems.length > 0) {
        navItem.items = subItems
      }

      items.push(navItem)
    }
  } catch (e) {
    console.error(`Error generating nav items for ${fullDirPath}:`, e)
  }

  return items
}

/**
 * 生成导航栏配置（支持递归展示，排除 sidebar 中的目录）
 * @param docsDir docs 目录路径
 * @param sidebarPaths sidebar 已使用的路径集合
 */
export function generateNavConfig(docsDir: string, sidebarPaths: Set<string> = new Set()): NavItem[] {
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

    // 递归获取该目录下的所有导航项（排除 sidebar 中的目录）
    const navItems = generateNavItemsRecursive(docsDir, dir, sidebarPaths)

    // nav 应该显示所有顶级目录，即使它们在 sidebar 中
    // 但只显示那些不在 sidebar 中的子目录
    if (navItems.length > 0) {
      // 如果有不在 sidebar 中的子目录，创建多级导航
      nav.push({
        text: dirTitle,
        items: navItems
      })
    } else {
      // 如果没有不在 sidebar 中的子目录，显示顶级链接
      // nav 应该显示所有顶级目录，无论它们是否在 sidebar 中
      nav.push({
        text: dirTitle,
        link: `/${dir}/`
      })
    }
  }

  return nav
}
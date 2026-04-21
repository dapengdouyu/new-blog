#!/usr/bin/env node
/**
 * 生成有意义的图片文件名
 * 优先使用 alt text，其次从 URL 提取，最后使用索引
 */

import * as path from 'path';

/**
 * 生成有意义的文件名
 * @param altText 图片的 alt 文本
 * @param url 图片 URL
 * @param index 图片索引
 * @returns 文件名（不含扩展名）
 */
export function generateImageFileName(
  altText: string,
  url: string,
  index: number
): string {
  // 优先使用 alt text
  if (altText && altText.trim()) {
    // 清理 alt text：移除特殊字符，保留中文、英文、数字、下划线、连字符
    let fileName = altText
      .trim()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    // 限制长度
    if (fileName.length > 50) {
      fileName = fileName.substring(0, 50);
    }

    if (fileName) {
      return fileName;
    }
  }

  // 如果没有 alt text，尝试从 URL 中提取文件名
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const urlFileName = path.basename(pathname);
    if (urlFileName && urlFileName !== '/') {
      // 移除扩展名，只保留文件名部分
      const nameWithoutExt = path.parse(urlFileName).name;
      if (nameWithoutExt) {
        return nameWithoutExt.replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_');
      }
    }
  } catch (e) {
    // URL 解析失败，忽略
  }

  // 如果都失败，使用索引
  return `image_${index + 1}`;
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const altText = process.argv[2] || '';
  const url = process.argv[3];
  const index = parseInt(process.argv[4] || '0');

  if (!url) {
    console.error('使用方法: node generate-image-filename.ts [altText] <url> [index]');
    process.exit(1);
  }

  const fileName = generateImageFileName(altText, url, index);
  console.log(fileName);
}

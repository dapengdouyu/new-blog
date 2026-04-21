#!/usr/bin/env node
/**
 * 从 URL、base64 数据或路径中获取图片扩展名
 */

import * as path from 'path';

/**
 * 从 URL、base64 数据或路径中获取图片扩展名
 * @param url 图片 URL、base64 数据或文件路径
 * @returns 图片扩展名（不含点号）
 */
export function getImageExtension(url: string): string {
  // 处理 base64 图片
  const base64Match = url.match(/data:image\/([^;]+)/);
  if (base64Match) {
    const mimeType = base64Match[1];
    const mimeToExt: Record<string, string> = {
      jpeg: 'jpg',
      jpg: 'jpg',
      png: 'png',
      gif: 'gif',
      webp: 'webp',
      'svg+xml': 'svg',
    };
    return mimeToExt[mimeType] || 'png';
  }

  // 从 URL 中提取扩展名
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = path.extname(pathname).toLowerCase().replace('.', '');
    if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  } catch (e) {
    // URL 解析失败，可能是相对路径
  }

  // 尝试直接从路径提取扩展名（处理相对路径）
  const ext = path.extname(url).toLowerCase().replace('.', '');
  if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }

  // 默认返回 png
  return 'png';
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];

  if (!url) {
    console.error('使用方法: node get-image-extension.ts <url>');
    process.exit(1);
  }

  const ext = getImageExtension(url);
  console.log(ext);
}

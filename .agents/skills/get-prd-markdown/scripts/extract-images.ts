#!/usr/bin/env node
/**
 * 从 markdown 内容中提取所有图片
 * 支持标准 markdown 格式和 HTML img 标签
 */

interface ImageInfo {
  alt: string;
  url: string;
  fullMatch: string;
  index: number;
}

/**
 * 从 markdown 内容中提取所有图片
 * @param content markdown 内容
 * @returns 图片信息数组
 */
export function extractImages(content: string): ImageInfo[] {
  const images: ImageInfo[] = [];
  let index = 0;

  // 匹配标准 markdown 图片格式: ![alt text](url)
  const markdownImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownImagePattern.exec(content)) !== null) {
    images.push({
      alt: match[1] || '',
      url: match[2],
      fullMatch: match[0],
      index: index++,
    });
  }

  // 匹配 HTML img 标签: <img src="url" alt="alt text">
  const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  while ((match = htmlImagePattern.exec(content)) !== null) {
    images.push({
      alt: match[2] || '',
      url: match[1],
      fullMatch: match[0],
      index: index++,
    });
  }

  return images;
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('fs');
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('使用方法: node extract-images.ts <markdownFile>');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const images = extractImages(content);
  console.log(JSON.stringify(images, null, 2));
}

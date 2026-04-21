#!/usr/bin/env node
/**
 * 下载单个图片
 * 支持网络图片、base64 图片和相对路径图片
 */

import * as fs from 'fs';
import * as path from 'path';
import { getImageExtension } from './get-image-extension.js';

/**
 * 下载单个图片
 * @param url 图片 URL、base64 数据或相对路径
 * @param imageDir 图片保存目录
 * @param fileName 文件名（不含扩展名）
 * @param sourceDir 源文档所在目录（用于解析相对路径）
 * @returns 保存的图片路径
 */
export async function downloadImage(
  url: string,
  imageDir: string,
  fileName: string,
  sourceDir?: string
): Promise<string> {
  // 确保目录存在
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const extension = getImageExtension(url);
  let finalFileName = `${fileName}.${extension}`;
  let filePath = path.join(imageDir, finalFileName);

  // 如果文件已存在，添加序号
  let counter = 1;
  while (fs.existsSync(filePath)) {
    finalFileName = `${fileName}_${counter}.${extension}`;
    filePath = path.join(imageDir, finalFileName);
    counter++;
  }

  // 处理 base64 图片
  if (url.startsWith('data:image/')) {
    const base64Data = url.split(',')[1];
    if (base64Data) {
      const buffer = Buffer.from(base64Data, 'base64');
      await fs.promises.writeFile(filePath, buffer);
      return filePath;
    }
  }

  // 处理相对路径图片
  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://') &&
    !url.startsWith('data:image/')
  ) {
    if (sourceDir) {
      // 解析相对路径为绝对路径
      const absolutePath = path.resolve(sourceDir, url);
      console.error(`尝试从相对路径复制图片: ${url} -> ${absolutePath}`);

      if (fs.existsSync(absolutePath)) {
        // 复制文件到目标目录
        await fs.promises.copyFile(absolutePath, filePath);
        console.error(`图片已复制: ${absolutePath} -> ${filePath}`);
        return filePath;
      } else {
        throw new Error(`相对路径图片不存在: ${absolutePath}`);
      }
    } else {
      throw new Error(`无法处理相对路径图片（缺少源目录）: ${url}`);
    }
  }

  // 下载网络图片
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error(`下载图片失败 ${url}:`, error);
    throw error;
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  const imageDir = process.argv[3];
  const fileName = process.argv[4];
  const sourceDir = process.argv[5];

  if (!url || !imageDir || !fileName) {
    console.error('使用方法: node download-image.ts <url> <imageDir> <fileName> [sourceDir]');
    process.exit(1);
  }

  downloadImage(url, imageDir, fileName, sourceDir)
    .then((path) => {
      console.log(path);
    })
    .catch((error) => {
      console.error('下载失败:', error);
      process.exit(1);
    });
}

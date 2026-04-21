#!/usr/bin/env node
/**
 * 提取并下载文档中的所有图片
 * 将图片保存到本地并更新文档中的引用路径
 */

import * as fs from 'fs';
import * as path from 'path';
import { extractImages } from './extract-images.js';
import { generateImageFileName } from './generate-image-filename.js';
import { downloadImage } from './download-image.js';

/**
 * 提取并下载文档中的所有图片
 * @param content markdown 内容
 * @param imageDir 图片保存目录
 * @param markdownPath markdown 文件路径（用于生成相对路径）
 * @returns 处理后的内容和下载的图片数量
 */
export async function extractAndDownloadImages(
  content: string,
  imageDir: string,
  markdownPath?: string
): Promise<{ content: string; imageCount: number }> {
  const images = extractImages(content);

  if (images.length === 0) {
    return { content, imageCount: 0 };
  }

  console.error(`发现 ${images.length} 张图片，开始处理...`);

  // 确保图片目录存在
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  let processedContent = content;
  let downloadedCount = 0;

  // 从后往前处理，避免替换时索引变化
  for (let i = images.length - 1; i >= 0; i--) {
    const image = images[i];
    console.error(`\n处理第 ${i + 1}/${images.length} 张图片:`);
    console.error(`  URL: ${image.url}`);
    console.error(`  Alt: ${image.alt}`);
    try {
      const fileName = generateImageFileName(image.alt, image.url, image.index);
      console.error(`  生成文件名: ${fileName}`);

      // 传递源文档目录，用于解析相对路径
      const sourceDir = markdownPath ? path.dirname(markdownPath) : process.cwd();
      console.error(`  源目录: ${sourceDir}`);
      console.error(`  图片目录: ${imageDir}`);

      const savedPath = await downloadImage(image.url, imageDir, fileName, sourceDir);
      console.error(`  保存路径: ${savedPath}`);

      // 计算相对路径
      let relativePath: string;
      if (markdownPath) {
        relativePath = path.relative(path.dirname(markdownPath), savedPath);
        // 确保使用正斜杠（markdown 标准）
        relativePath = relativePath.replace(/\\/g, '/');
      } else {
        relativePath = path.relative(process.cwd(), savedPath).replace(/\\/g, '/');
      }
      console.error(`  相对路径: ${relativePath}`);

      // 替换原图片链接为本地路径
      // 保持原有的 alt text
      const newImageMarkdown = `![${image.alt}](${relativePath})`;
      processedContent = processedContent.replace(image.fullMatch, newImageMarkdown);

      downloadedCount++;
      console.error(`  ✓ 图片处理成功!`);
    } catch (error) {
      console.error(`  ✗ 处理图片失败:`);
      console.error(
        `    错误类型: ${error instanceof Error ? error.constructor.name : typeof error}`
      );
      console.error(`    错误信息: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error && error.stack) {
        console.error(`    错误堆栈: ${error.stack}`);
      }
      // 继续处理其他图片，不替换失败的图片链接
    }
  }

  console.error(`图片处理完成，成功下载 ${downloadedCount}/${images.length} 张图片`);
  return { content: processedContent, imageCount: downloadedCount };
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const inputFile = process.argv[2];
  const imageDir = process.argv[3];
  const outputFile = process.argv[4];

  if (!inputFile || !imageDir) {
    console.error('使用方法: node extract-and-download-images.ts <inputFile> <imageDir> [outputFile]');
    process.exit(1);
  }

  const content = fs.readFileSync(inputFile, 'utf-8');
  extractAndDownloadImages(content, imageDir, inputFile)
    .then((result) => {
      const output = outputFile || inputFile;
      fs.writeFileSync(output, result.content, 'utf-8');
      console.log(`处理完成，下载了 ${result.imageCount} 张图片`);
      console.log(`输出文件: ${output}`);
    })
    .catch((error) => {
      console.error('处理失败:', error);
      process.exit(1);
    });
}

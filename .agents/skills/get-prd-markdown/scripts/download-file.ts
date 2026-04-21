#!/usr/bin/env node
/**
 * 下载文件到本地
 * 支持进度显示
 */

import * as fs from 'fs';
import * as path from 'path';
import { ensureDirectoryExists } from './ensure-directory-exists.js';
import { resolveSavePath } from './resolve-save-path.js';

type ExportType = 'pdf' | 'docx' | 'jpg' | 'md' | 'xlsx' | 'pptx' | 'jpeg' | 'xmind';

/**
 * 下载文件到本地
 * @param url 下载链接
 * @param exportType 导出类型（用于确定文件扩展名）
 * @param savePath 保存路径（可选）
 * @param documentName 文档名称（可选，默认为 prd）
 * @returns 保存的文件路径
 */
export async function downloadFile(
  url: string,
  exportType?: ExportType,
  savePath?: string,
  documentName?: string
): Promise<string> {
  try {
    // 使用统一的路径解析函数
    const finalSavePath = resolveSavePath(savePath, exportType, documentName);

    // 确保目标目录存在
    ensureDirectoryExists(finalSavePath);

    console.error(`开始下载文件到: ${finalSavePath}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取文件大小
    const contentLength = response.headers.get('content-length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

    // 创建写入流
    const fileStream = fs.createWriteStream(finalSavePath);
    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('无法读取响应流');
    }

    let downloaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        fileStream.write(Buffer.from(value));
        downloaded += value.length;

        // 显示下载进度
        if (totalSize > 0) {
          const progress = (downloaded / totalSize) * 100;
          process.stderr.write(`\r下载进度: ${progress.toFixed(1)}%`);
        }
      }
    }

    fileStream.end();
    console.error('\n下载完成!');
    return path.resolve(finalSavePath);
  } catch (error) {
    console.error('下载文件时出错:', error);
    throw error;
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  const exportType = process.argv[3] as ExportType;
  const savePath = process.argv[4];
  const documentName = process.argv[5];

  if (!url) {
    console.error('使用方法: node download-file.ts <url> [exportType] [savePath] [documentName]');
    process.exit(1);
  }

  downloadFile(url, exportType, savePath, documentName)
    .then((path) => {
      console.log(`文件已保存到: ${path}`);
    })
    .catch((error) => {
      console.error('下载失败:', error);
      process.exit(1);
    });
}

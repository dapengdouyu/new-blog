#!/usr/bin/env node
/**
 * 读取文件内容
 */

import * as fs from 'fs';

/**
 * 读取文件内容
 * @param filePath 文件路径
 * @returns 文件内容（UTF-8 编码）
 */
export async function readFileContent(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, 'utf-8');
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('使用方法: node read-file-content.ts <filePath>');
    process.exit(1);
  }

  readFileContent(filePath)
    .then((content) => {
      console.log(content);
    })
    .catch((error) => {
      console.error('读取失败:', error);
      process.exit(1);
    });
}

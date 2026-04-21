#!/usr/bin/env node
/**
 * 确保文件路径的目录存在
 * 如果目录不存在，则递归创建
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * 确保文件路径的目录存在
 * @param filePath 文件路径
 */
export function ensureDirectoryExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('使用方法: node ensure-directory-exists.ts <filePath>');
    process.exit(1);
  }

  ensureDirectoryExists(filePath);
  console.log(`已确保目录存在: ${path.dirname(filePath)}`);
}

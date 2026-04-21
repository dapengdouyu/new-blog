#!/usr/bin/env node
/**
 * 清理临时目录
 * 如果目录为空则删除
 */

import * as fs from 'fs';

/**
 * 清理临时目录
 * @param dirPath 目录路径
 */
export function cleanupTempDir(dirPath: string): void {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length === 0) {
        fs.rmdirSync(dirPath);
      }
    }
  } catch (error) {
    console.error(`清理临时目录失败 ${dirPath}:`, error);
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const dirPath = process.argv[2];

  if (!dirPath) {
    console.error('使用方法: node cleanup-temp-dir.ts <dirPath>');
    process.exit(1);
  }

  cleanupTempDir(dirPath);
  console.log(`已清理临时目录: ${dirPath}`);
}

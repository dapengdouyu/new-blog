#!/usr/bin/env node
/**
 * 清空目录中的所有文件（保留目录本身）
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * 清空目录中的所有文件（保留目录本身）
 * @param dirPath 目录路径
 */
export function clearDirectory(dirPath: string): void {
  try {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // 递归删除子目录
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        // 删除文件
        fs.unlinkSync(filePath);
      }
    }

    console.error(`已清空目录: ${dirPath}`);
  } catch (error) {
    console.error(`清空目录失败 ${dirPath}:`, error);
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const dirPath = process.argv[2];

  if (!dirPath) {
    console.error('使用方法: node clear-directory.ts <dirPath>');
    process.exit(1);
  }

  clearDirectory(dirPath);
  console.log(`已清空目录: ${dirPath}`);
}

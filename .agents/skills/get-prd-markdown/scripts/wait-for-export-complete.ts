#!/usr/bin/env node
/**
 * 等待知音楼文档导出任务完成并返回下载链接
 * 自动轮询任务状态直到完成或超时
 */

import { checkExportStatus } from './check-export-status.js';

interface ApiResponse<T = any> {
  code: number;
  msg: string;
  obj?: T;
}

interface ExportStatusResponse {
  progress: number;
  file_size: number;
  cost_time: number;
  download_url?: string;
}

/**
 * 等待导出任务完成并返回下载链接
 * @param accessToken 访问令牌
 * @param taskId 任务 ID
 * @param maxWaitTime 最大等待时间（毫秒），默认 5 分钟
 * @param pollInterval 轮询间隔（毫秒），默认 3 秒
 * @returns 下载链接，如果超时则返回 null
 */
export async function waitForExportComplete(
  accessToken: string,
  taskId: string,
  maxWaitTime: number = 5 * 60 * 1000,
  pollInterval: number = 3000
): Promise<string | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const statusResult = await checkExportStatus(accessToken, taskId);

    if (statusResult.code === 200 && statusResult.obj) {
      const status = statusResult.obj;

      // 如果任务完成且有下载链接
      if (status.download_url) {
        return status.download_url;
      }

      // 如果进度达到 100%，但还没有下载链接，再等待一下
      if (status.progress >= 100) {
        // 再等待一次轮询间隔
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        const finalCheck = await checkExportStatus(accessToken, taskId);
        if (finalCheck.code === 200 && finalCheck.obj?.download_url) {
          return finalCheck.obj.download_url;
        }
      }
    }

    // 等待后继续轮询
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  return null; // 超时
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const accessToken = process.argv[2];
  const taskId = process.argv[3];
  const maxWaitTime = process.argv[4] ? parseInt(process.argv[4]) : 5 * 60 * 1000;

  if (!accessToken || !taskId) {
    console.error('使用方法: node wait-for-export-complete.ts <accessToken> <taskId> [maxWaitTime]');
    console.error('maxWaitTime: 最大等待时间（毫秒），默认 300000（5分钟）');
    process.exit(1);
  }

  waitForExportComplete(accessToken, taskId, maxWaitTime).then((url) => {
    if (url) {
      console.log(url);
    } else {
      console.error('等待超时');
      process.exit(1);
    }
  }).catch((error) => {
    console.error('等待失败:', error);
    process.exit(1);
  });
}

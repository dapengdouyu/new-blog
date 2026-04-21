#!/usr/bin/env node
/**
 * 查询知音楼文档导出任务状态
 */

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

const baseUrl = 'https://yach-oapi.zhiyinlou.com';

/**
 * 查询导出任务状态
 * @param accessToken 访问令牌
 * @param taskId 任务 ID
 * @returns 任务状态信息
 */
export async function checkExportStatus(
  accessToken: string,
  taskId: string
): Promise<ApiResponse<ExportStatusResponse>> {
  const url = `${baseUrl}/openapi/v2/doc/export/async/process`;
  const params = new URLSearchParams({
    access_token: accessToken,
    task_id: taskId,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as ApiResponse<ExportStatusResponse>;
  } catch (error) {
    console.error('查询任务状态时出错:', error);
    throw error;
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const accessToken = process.argv[2];
  const taskId = process.argv[3];

  if (!accessToken || !taskId) {
    console.error('使用方法: node check-export-status.ts <accessToken> <taskId>');
    process.exit(1);
  }

  checkExportStatus(accessToken, taskId).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error('查询失败:', error);
    process.exit(1);
  });
}

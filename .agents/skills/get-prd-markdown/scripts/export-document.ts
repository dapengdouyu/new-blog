#!/usr/bin/env node
/**
 * 导出知音楼文档
 * 创建异步导出任务
 */

type ExportType = 'pdf' | 'docx' | 'jpg' | 'md' | 'xlsx' | 'pptx' | 'jpeg' | 'xmind';

interface ApiResponse<T = any> {
  code: number;
  msg: string;
  obj?: T;
}

interface ExportTaskResponse {
  status: number;
  task_id: string;
  message: string;
}

const baseUrl = 'https://yach-oapi.zhiyinlou.com';

/**
 * 导出文档
 * @param accessToken 访问令牌
 * @param type 导出类型
 * @param fileUrl 文档 URL
 * @returns 导出任务信息
 */
export async function exportDocument(
  accessToken: string,
  type: ExportType,
  fileUrl: string
): Promise<ApiResponse<ExportTaskResponse>> {
  const url = `${baseUrl}/openapi/v2/doc/export/async`;

  const payload: any = {
    access_token: accessToken,
    type: type,
    file_url: fileUrl,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as ApiResponse<ExportTaskResponse>;
  } catch (error) {
    console.error('导出文档时出错:', error);
    throw error;
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const accessToken = process.argv[2];
  const type = process.argv[3] as ExportType;
  const fileUrl = process.argv[4];

  if (!accessToken || !type || !fileUrl) {
    console.error('使用方法: node export-document.ts <accessToken> <type> <fileUrl>');
    console.error('type可选: pdf, docx, jpg, md, xlsx, pptx, jpeg, xmind');
    process.exit(1);
  }

  exportDocument(accessToken, type, fileUrl).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error('导出失败:', error);
    process.exit(1);
  });
}

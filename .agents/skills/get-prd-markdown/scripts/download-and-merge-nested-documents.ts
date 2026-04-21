#!/usr/bin/env node
/**
 * 递归下载嵌套文档并合并内容
 * 支持多层嵌套文档，自动避免循环引用
 */

import * as fs from 'fs';
import * as path from 'path';
import { extractNestedDocumentLinks } from './extract-nested-document-links.js';
import { extractDocumentIdentifier } from './extract-document-identifier.js';
import { mergeDocumentContents } from './merge-document-contents.js';

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

// 简化版 API 客户端接口
interface ApiClient {
  exportDocument(type: ExportType, fileUrl: string): Promise<ApiResponse<ExportTaskResponse>>;
  waitForExportComplete(taskId: string, maxWaitTime: number): Promise<string | null>;
}

/**
 * 从文档内容中提取《》中的名称
 * @param content 文档内容
 * @returns 《》中的内容，如果没有则返回 null
 */
function extractDocumentNameFromContent(content: string): string | null {
  const match = content.match(/《([^》]+)》/);
  return match ? match[1] : null;
}

/**
 * 从主文档内容中提取链接对应的文档名称
 * @param mainContent 主文档内容
 * @param linkUrl 链接URL
 * @returns 《》中的内容，如果没有则返回 null
 */
function extractDocumentNameFromLink(mainContent: string, linkUrl: string): string | null {
  const escapedUrl = linkUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`\\[${escapedUrl}\\]\\(${escapedUrl}\\)\\s*《([^》]+)》`, 'i'),
    new RegExp(`${escapedUrl}\\s*《([^》]+)》`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = mainContent.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * 生成临时文件名
 * @param content 文档内容
 * @param type 文件类型
 * @param linkUrl 链接URL
 * @param mainContent 主文档内容
 * @returns 临时文件名
 */
function generateTempFileName(
  content: string,
  type: ExportType,
  linkUrl?: string,
  mainContent?: string
): string {
  let name: string | null = null;

  if (linkUrl && mainContent) {
    name = extractDocumentNameFromLink(mainContent, linkUrl);
  }

  if (!name) {
    name = extractDocumentNameFromContent(content);
  }

  if (!name) {
    name = 'nested_document';
  }

  const safeName = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim();
  const timestamp = Date.now();

  return `${safeName}_${timestamp}.${type}`;
}

/**
 * 下载文件到本地
 * @param url 下载链接
 * @param filePath 保存路径
 */
async function downloadFile(url: string, filePath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(filePath, buffer);
}

/**
 * 清空目录
 * @param dirPath 目录路径
 */
function clearDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * 递归下载嵌套文档并合并内容
 * @param apiClient API 客户端实例
 * @param mainContent 主文档内容
 * @param exportType 导出类型
 * @param maxWaitTime 最大等待时间（毫秒）
 * @param depth 解析深度：1=只解析主文档，2=主文档+第一层嵌套，-1=无限递归
 * @param currentDepth 当前深度（内部使用）
 * @param visitedUrls 已访问的 URL Map
 * @returns 合并后的文档内容
 */
export async function downloadAndMergeNestedDocuments(
  apiClient: ApiClient,
  mainContent: string,
  exportType: ExportType,
  maxWaitTime: number,
  depth: number = -1,
  currentDepth: number = 1,
  visitedUrls: Map<string, string> = new Map()
): Promise<string> {
  // 只有当导出类型是 markdown 时，才处理嵌套文档
  if (exportType !== 'md') {
    return mainContent;
  }

  const nestedLinks = extractNestedDocumentLinks(mainContent);

  if (nestedLinks.length === 0) {
    return mainContent;
  }

  if (depth === 1) {
    return mainContent;
  }

  if (depth > 1 && currentDepth >= depth) {
    return mainContent;
  }

  console.error(
    `发现 ${nestedLinks.length} 个嵌套文档链接 (当前深度: ${currentDepth}, 目标深度: ${
      depth === -1 ? '无限' : depth
    })`
  );

  const tempDir = path.join(process.cwd(), '.aid2c', 'prd', 'other');

  if (currentDepth === 1) {
    if (fs.existsSync(tempDir)) {
      clearDirectory(tempDir);
    } else {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }

  const nestedContents: Array<{ content: string; url: string }> = [];

  for (const link of nestedLinks) {
    if (visitedUrls.has(link)) {
      console.error(`跳过已下载的文档: ${link}`);
      const cachedContent = visitedUrls.get(link);
      if (cachedContent) {
        nestedContents.push({
          content: cachedContent,
          url: link,
        });
      }
      continue;
    }

    try {
      console.error(`正在下载嵌套文档: ${link} (深度: ${currentDepth})`);

      const { fileUrl } = extractDocumentIdentifier(link);

      const exportResult = await apiClient.exportDocument(exportType, fileUrl);

      if (exportResult.code !== 200 || !exportResult.obj?.task_id) {
        console.error(`嵌套文档导出任务创建失败: ${link}`);
        continue;
      }

      const taskId = exportResult.obj.task_id;
      const downloadUrl = await apiClient.waitForExportComplete(taskId, maxWaitTime);

      if (!downloadUrl) {
        console.error(`嵌套文档下载超时: ${link}`);
        continue;
      }

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const initialTempFileName = `temp_${Date.now()}.${exportType}`;
      const initialTempPath = path.join(tempDir, initialTempFileName);

      await downloadFile(downloadUrl, initialTempPath);

      let tempPath: string;

      try {
        const initialContent = await fs.promises.readFile(initialTempPath, 'utf-8');
        const finalTempFileName = generateTempFileName(
          initialContent,
          exportType,
          link,
          mainContent
        );
        tempPath = path.join(tempDir, finalTempFileName);

        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }

        fs.renameSync(initialTempPath, tempPath);
        console.error(`嵌套文档临时文件: ${tempPath}`);
      } catch (error) {
        console.error(`文件重命名失败，使用临时文件名: ${initialTempPath}`, error);
        tempPath = initialTempPath;
      }

      const nestedContent = await fs.promises.readFile(tempPath, 'utf-8');

      visitedUrls.set(link, nestedContent);

      const processedContent = await downloadAndMergeNestedDocuments(
        apiClient,
        nestedContent,
        exportType,
        maxWaitTime,
        depth,
        currentDepth + 1,
        visitedUrls
      );

      visitedUrls.set(link, processedContent);

      nestedContents.push({
        content: processedContent,
        url: link,
      });

      console.error(`嵌套文档下载完成: ${link}，文件保留在: ${tempPath}`);
    } catch (error) {
      console.error(`下载嵌套文档时出错 ${link}:`, error);
    }
  }

  return mergeDocumentContents(mainContent, nestedContents);
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  console.error('此脚本需要 API 客户端实例，请在代码中导入使用');
  console.error('示例:');
  console.error('import { downloadAndMergeNestedDocuments } from "./download-and-merge-nested-documents.js";');
  console.error('const result = await downloadAndMergeNestedDocuments(apiClient, content, "md", 300000);');
  process.exit(1);
}

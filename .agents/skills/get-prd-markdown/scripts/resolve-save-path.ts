#!/usr/bin/env node
/**
 * 生成最终的保存路径
 * 智能处理 savePath 可能是目录或完整文件路径的情况
 */

import * as path from 'path';

type ExportType = 'pdf' | 'docx' | 'jpg' | 'md' | 'xlsx' | 'pptx' | 'jpeg' | 'xmind';

/**
 * 生成最终的保存路径
 * @param savePath 保存路径（可选）
 * @param exportType 导出类型（用于确定文件扩展名）
 * @param documentName 文档名称（可选，默认为 prd）
 * @returns 最终的完整文件路径
 */
export function resolveSavePath(
  savePath: string | undefined,
  exportType?: ExportType,
  documentName?: string
): string {
  const baseName = documentName || 'prd';
  const extension = exportType || 'md';
  const filename = `${baseName}.${extension}`;

  if (savePath) {
    // 检查 savePath 是否已经包含正确的文件扩展名
    const hasExtension = savePath.endsWith(`.${extension}`);
    if (hasExtension) {
      // savePath 已经是完整的文件路径
      return path.resolve(savePath);
    } else {
      // savePath 是目录路径，需要拼接文件名
      return path.join(path.resolve(savePath), filename);
    }
  } else {
    // 没有提供 savePath，使用当前工作目录
    return path.join(process.cwd(), filename);
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const savePath = process.argv[2];
  const exportType = (process.argv[3] as ExportType) || 'md';
  const documentName = process.argv[4];

  const resolved = resolveSavePath(savePath, exportType, documentName);
  console.log(resolved);
}

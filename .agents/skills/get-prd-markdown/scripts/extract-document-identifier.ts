#!/usr/bin/env node
/**
 * 从链接中提取文档标识符
 */

/**
 * 从链接中提取文档标识符
 * @param url 文档链接
 * @returns 文档 GUID 和完整 URL
 */
export function extractDocumentIdentifier(url: string): {
  fileGuid?: string;
  fileUrl: string;
} {
  const match = url.match(/https:\/\/yach-doc-shimo\.zhiyinlou\.com\/docs\/([^?\/\s]+)/);
  if (match && match[1]) {
    return { fileGuid: match[1], fileUrl: url };
  }
  return { fileUrl: url };
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];

  if (!url) {
    console.error('使用方法: node extract-document-identifier.ts <url>');
    process.exit(1);
  }

  const result = extractDocumentIdentifier(url);
  console.log(JSON.stringify(result, null, 2));
}

#!/usr/bin/env node
/**
 * 从文档内容中提取嵌套文档链接
 */

/**
 * 从文档内容中提取嵌套文档链接
 * @param content 文档内容
 * @returns 嵌套文档链接数组（已去重）
 */
export function extractNestedDocumentLinks(content: string): string[] {
  // 匹配以 https://yach-doc-shimo.zhiyinlou.com/docs/ 开头的链接
  // 匹配到空白字符、换行符、右括号、右方括号或字符串结尾
  const nestedDocPattern = /https:\/\/yach-doc-shimo\.zhiyinlou\.com\/docs\/[^\s\)\]\n]+/g;
  const matches = content.match(nestedDocPattern);
  return matches ? Array.from(new Set(matches)) : []; // 去重
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('fs');
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('使用方法: node extract-nested-document-links.ts <markdownFile>');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const links = extractNestedDocumentLinks(content);
  console.log(JSON.stringify(links, null, 2));
}

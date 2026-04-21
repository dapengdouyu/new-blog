#!/usr/bin/env node
/**
 * 合并多个文档内容到一个文档中
 */

/**
 * 合并多个文档内容到一个文档中
 * @param mainContent 主文档内容
 * @param nestedContents 嵌套文档内容数组，每个元素包含 { content: string, url: string }
 * @returns 合并后的文档内容
 */
export function mergeDocumentContents(
  mainContent: string,
  nestedContents: Array<{ content: string; url: string }>
): string {
  if (nestedContents.length === 0) {
    return mainContent;
  }

  let mergedContent = mainContent;

  // 添加嵌套文档区域的统一标题
  mergedContent += '\n\n---\n\n';
  mergedContent += '# 引用文档内容\n\n';
  mergedContent += '以下是从主文档中引用的文档内容：\n\n';

  // 为每个嵌套文档添加标识和内容
  nestedContents.forEach((nested, index) => {
    mergedContent += `---\n\n`;
    mergedContent += `**文档来源：** \`${nested.url}\`\n\n`;
    mergedContent += `---\n\n`;
    mergedContent += nested.content;
    mergedContent += '\n\n';
  });
  return mergedContent;
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('fs');
  const mainFile = process.argv[2];
  const nestedFilesJson = process.argv[3];
  const outputFile = process.argv[4];

  if (!mainFile || !nestedFilesJson) {
    console.error('使用方法: node merge-document-contents.ts <mainFile> <nestedFilesJson> [outputFile]');
    console.error('nestedFilesJson: JSON数组，格式: [{"content":"...", "url":"..."}]');
    process.exit(1);
  }

  const mainContent = fs.readFileSync(mainFile, 'utf-8');
  const nestedContents = JSON.parse(nestedFilesJson);
  const mergedContent = mergeDocumentContents(mainContent, nestedContents);

  if (outputFile) {
    fs.writeFileSync(outputFile, mergedContent, 'utf-8');
    console.log(`合并完成，输出文件: ${outputFile}`);
  } else {
    console.log(mergedContent);
  }
}

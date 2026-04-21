---
name: get-prd-markdown
description: 获取知音楼需求文档
---

## 工作内容：

### 下载文档
要求使用提供的脚本下载知音楼文档并进行处理
请确保：
- 过程中所有文件保存到：当前项目绝对地址/.aid2c/prd
- 文档名称：requirements.md
- 下载所有图片到本地，目录为：当前项目绝对地址/.aid2c/prd/images
- 下载所有嵌套文档并合并
- 严禁使用curl下载，必须使用提供的脚本，如果遇到问题，应修复脚本

### 输出标准文档

根据requirements.md，按照template下的requirements-template.md输出标准需求文档，输出的标准需求文档命名为standard_requirements.md，要求：
1.  分析下载的图片文件，以md的形式，将原型图以TUI结合ASCII Art的形式1:1（像素级别）还原，标准文档无需再加载图片文件，如无法读取图片，直接终止进程
2.  严格还原原型图的**结构层级**（标题、分栏、列表、表格、按钮、输入框等UI元素的位置和嵌套关系）
3.  保留原型图中的**所有文字内容**（包括占位符、标签、注释、提示文案），不增删、不改写，确保描述完整、准确，不得遗漏细节，确保相关文字展示信息与原型图保持一致
4.  用 Markdown、TUI结合ASCII Art 语法精准表达原型图样式：
    - 标题层级：#/##/### 对应原型图的一级/二级/三级标题
    - 列表：有序列表 1./2./3. 或无序列表 -/· 对应原型图的列表样式
    - 表格：| 表头 | 内容 | 格式还原原型图的表格行列结构
    - 组件标注：按钮用 **[按钮名称]** 加粗，输入框用 `[输入框占位符]` 反引号标注
    - 分区：用 --- 分割线还原原型图的模块分隔
5.  若无法还原的部分用文字描述清楚
6.  如果有动态交互，比如hover操作，也需要表述清楚，包括前后状态变化、颜色变化、有无背景遮罩要求等
7.  若文字内容与原型图内容不符，**以文字表述为准**
8.  如果文档中文字样式为中划线，则表示该需求已删除，直接忽略，无需分析输出到标准产品文档，而是声明该功能点已删除，并同步至还原的UI中
9.  要求分析潜在的交互细节，但不得与需求文档的描述冲突，完善标准需求文档，确保系统交互流程逻辑完整
10. 对于UI样式和交互效果，需要在标准设计文档中进行基础描述，详细的设计规范将在设计文档阶段（gen-design-doc）进行补充

本目录下的 `scripts/` 文件夹包含了处理知音楼文档的所有独立脚本，每个脚本都可以单独使用或组合使用。

### API 客户端脚本

#### 1. get-access-token.ts
获取知音楼访问令牌，自动管理令牌缓存和刷新。

**用法：**
```bash
npx tsx get-access-token.ts <appKey> <appSecret>
# 或使用环境变量
ZHIYINLOU_APP_KEY=xxx ZHIYINLOU_APP_SECRET=xxx npx tsx get-access-token.ts
# 注：除用户明确给出，否则无需传这两个参数，而是使用内部的默认值
```

**返回：** 访问令牌字符串

#### 2. export-document.ts
创建文档导出任务。

**用法：**
```bash
npx tsx export-document.ts <accessToken> <type> <fileUrl>
# type可选: pdf, docx, jpg, md, xlsx, pptx, jpeg, xmind
```

**返回：** 导出任务信息的 JSON 对象

#### 3. check-export-status.ts
查询导出任务状态。

**用法：**
```bash
npx tsx check-export-status.ts <accessToken> <taskId>
```

**返回：** 任务状态信息的 JSON 对象

#### 4. wait-for-export-complete.ts
等待导出任务完成并返回下载链接（自动轮询）。

**用法：**
```bash
npx tsx wait-for-export-complete.ts <accessToken> <taskId> [maxWaitTime]
# maxWaitTime: 最大等待时间（毫秒），默认 300000（5分钟）
```

**返回：** 下载链接 URL

### 图片处理脚本

#### 5. extract-images.ts
从 markdown 内容中提取所有图片信息。

**用法：**
```bash
npx tsx extract-images.ts <markdownFile>
```

**返回：** 图片信息数组的 JSON

#### 6. generate-image-filename.ts
生成有意义的图片文件名。

**用法：**
```bash
npx tsx generate-image-filename.ts [altText] <url> [index]
```

**返回：** 文件名（不含扩展名）

#### 7. get-image-extension.ts
从 URL、base64 数据或路径中获取图片扩展名。

**用法：**
```bash
npx tsx get-image-extension.ts <url>
```

**返回：** 扩展名（不含点号）

#### 8. download-image.ts
下载单个图片（支持网络图片、base64、相对路径）。

**用法：**
```bash
npx tsx download-image.ts <url> <imageDir> <fileName> [sourceDir]
```

**返回：** 保存的图片路径

#### 9. extract-and-download-images.ts
提取并下载文档中的所有图片，更新 markdown 中的引用路径。

**用法：**
```bash
npx tsx extract-and-download-images.ts <inputFile> <imageDir> [outputFile]
```

**功能：** 自动提取图片、下载到本地、更新 markdown 引用

### 文档合并脚本

#### 10. extract-nested-document-links.ts
从文档内容中提取嵌套文档链接。

**用法：**
```bash
npx tsx extract-nested-document-links.ts <markdownFile>
```

**返回：** 嵌套文档链接数组的 JSON（已去重）

#### 11. extract-document-identifier.ts
从链接中提取文档标识符。

**用法：**
```bash
npx tsx extract-document-identifier.ts <url>
```

**返回：** 包含 fileGuid 和 fileUrl 的 JSON 对象

#### 12. merge-document-contents.ts
合并多个文档内容到一个文档中。

**用法：**
```bash
npx tsx merge-document-contents.ts <mainFile> <nestedFilesJson> [outputFile]
# nestedFilesJson: JSON数组，格式: [{"content":"...", "url":"..."}]
```

**返回：** 合并后的文档内容

#### 13. download-and-merge-nested-documents.ts
递归下载嵌套文档并合并内容，支持多层嵌套，自动避免循环引用。

**注意：** 此脚本需要 API 客户端实例，通常在代码中导入使用：

```typescript
import { downloadAndMergeNestedDocuments } from "./download-and-merge-nested-documents.js";
const result = await downloadAndMergeNestedDocuments(apiClient, content, "md", 300000);
```

### 文件工具脚本

#### 14. read-file-content.ts
读取文件内容（UTF-8 编码）。

**用法：**
```bash
npx tsx read-file-content.ts <filePath>
```

**返回：** 文件内容

#### 15. ensure-directory-exists.ts
确保文件路径的目录存在，如果不存在则递归创建。

**用法：**
```bash
npx tsx ensure-directory-exists.ts <filePath>
```

#### 16. cleanup-temp-dir.ts
清理临时目录（如果目录为空则删除）。

**用法：**
```bash
npx tsx cleanup-temp-dir.ts <dirPath>
```

#### 17. clear-directory.ts
清空目录中的所有文件（保留目录本身）。

**用法：**
```bash
npx tsx clear-directory.ts <dirPath>
```

#### 18. resolve-save-path.ts
生成最终的保存路径，智能处理目录或文件路径。

**用法：**
```bash
npx tsx resolve-save-path.ts [savePath] [exportType] [documentName]
```

**返回：** 完整文件路径

#### 19. download-file.ts
下载文件到本地，支持进度显示。

**用法：**
```bash
npx tsx download-file.ts <url> [exportType] [savePath] [documentName]
```

**返回：** 保存的文件路径

## 使用示例

### 命令行直接使用

所有脚本都支持使用 `tsx` 直接在命令行执行：

```bash
# 1. 获取访问令牌
TOKEN=$(npx tsx scripts/get-access-token.ts YOUR_APP_KEY YOUR_APP_SECRET)

# 2. 创建导出任务
EXPORT_RESULT=$(npx tsx scripts/export-document.ts "$TOKEN" md "https://yach-doc-shimo.zhiyinlou.com/docs/xxxxx")
TASK_ID=$(echo $EXPORT_RESULT | jq -r '.obj.task_id')

# 3. 等待任务完成并获取下载链接
DOWNLOAD_URL=$(npx tsx scripts/wait-for-export-complete.ts "$TOKEN" "$TASK_ID")

# 4. 下载文件
npx tsx scripts/download-file.ts "$DOWNLOAD_URL" md .aid2c/prd requirements

# 5. 提取并下载图片
npx tsx scripts/extract-and-download-images.ts .aid2c/prd/requirements.md .aid2c/prd/images

# 6. 提取嵌套文档链接
npx tsx scripts/extract-nested-document-links.ts .aid2c/prd/requirements.md

# 7. 从 markdown 提取图片信息
npx tsx scripts/extract-images.ts .aid2c/prd/requirements.md
```

### 在代码中导入使用

脚本也可以作为模块在 TypeScript/JavaScript 代码中使用：

```typescript
import { getAccessToken } from './scripts/get-access-token.js';
import { exportDocument } from './scripts/export-document.js';
import { waitForExportComplete } from './scripts/wait-for-export-complete.js';
import { downloadFile } from './scripts/download-file.js';
import { extractAndDownloadImages } from './scripts/extract-and-download-images.js';

// 完整流程
const token = await getAccessToken(appKey, appSecret);
const exportResult = await exportDocument(token, 'md', docUrl);
const downloadUrl = await waitForExportComplete(token, exportResult.obj.task_id);
const filePath = await downloadFile(downloadUrl, 'md', '.aid2c/prd', 'requirements');
await extractAndDownloadImages(content, '.aid2c/prd/images', filePath);
```

## 注意事项

1. **TypeScript 执行**：所有脚本都是 TypeScript 文件，使用 `tsx` 执行：
   ```bash
   npx tsx scripts/get-access-token.ts <参数>
   ```
2. **依赖安装**：首次使用前，请在 scripts 目录下安装依赖：
   ```bash
   cd .cursor/skills/get-prd-document/scripts
   npm install
   ```
3. **模块导入**：脚本使用 ES 模块语法，需要在 Node.js 环境中正确配置
4. **权限要求**：需要有效的知音楼 API 密钥和密钥，脚本内部已内置默认key，如未明确提出，无需传密钥
5. **路径处理**：所有路径处理都支持相对路径和绝对路径
6. **错误处理**：每个脚本都包含基本的错误处理和日志输出
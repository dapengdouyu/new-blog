# 代码片段目录

这个目录包含了所有可导入的代码片段示例，用于在 Markdown 文档中展示代码。

## 可用的代码片段

### JavaScript 文件

- `hello.js` - 简单的导出函数示例
- `snippet-with-region.js` - 包含多个函数，用于演示区域导入
- `utils.js` - 实用工具函数集合

### Vue 文件

- `vue-component.vue` - 完整的 Vue 3 组件示例

### TypeScript 文件

- `typescript-example.ts` - TypeScript 类和接口示例

### Python 文件

- `python-example.py` - Python 函数示例

## 使用方法

### 导入完整文件

```markdown
<<< @/snippets/hello.js
```

### 导入文件区域

```markdown
<<< @/snippets/utils.js#debounce
```

### 导入带行号的区域

```markdown
<<< @/snippets/snippet-with-region.js#snippet{1,2 ts:line-numbers} [snippet with region]
```

## 添加新代码片段

1. 在此目录中创建新的代码文件
2. 使用适当的文件扩展名 (`.js`, `.ts`, `.vue`, `.py` 等)
3. 在文档中使用 `<<< @/snippets/filename.ext` 语法导入

## 注意事项

- 所有代码片段都会被语法高亮
- 支持行号显示和区域选择
- 可以为导入的代码片段添加自定义标题

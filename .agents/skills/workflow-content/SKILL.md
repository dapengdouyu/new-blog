---
name: workflow-content
description: 获取处理prd文档的工作流
---

# 文档到代码(D2C)完整工作流

## 工作流概述

这是一个分析需求文档并产出标准文档的工作流

## 3个步骤

```
□ 步骤1: 获取知音楼需求文档，并按照模板产出一份标准的需求文档 - skill：get-prd-document
□ 步骤2: 获取根据需求文档产出交互设计文档 - skill：gen-design-doc
□ 步骤3: 按照标准的需求文档和交互设计文档生成代码 - skill：reduce-project
```

*注：每执行一个步骤，都需要调用对应的skill以获取具体的要求*
# Blog

基于 VitePress 的博客系统，支持 Vue 组件和多语言代码预览。

## 技术栈

- **框架**: [VitePress](https://vitepress.dev/) ^1.0.0
- **前端**: Vue 3.4.0
- **构建工具**: Vite 5.4.8
- **样式**: UnoCSS
- **部署**: 七牛云 OSS

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

启动本地开发服务器：

```bash
npm run dev
```

访问 `http://localhost:5173` 查看博客。

### 构建

构建生产版本：

```bash
npm run build
```

构建产物位于 `docs/.vitepress/dist` 目录。

### 预览

预览构建后的静态站点：

```bash
npm run preview
```

## 部署到七牛云 OSS

### 自动部署（推荐）

项目已配置 GitHub Actions，当代码推送到 `main` 分支时会自动构建并上传到七牛云 OSS。

#### 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. **QINIU_ACCESS_KEY**: 七牛云 Access Key
2. **QINIU_SECRET_KEY**: 七牛云 Secret Key
3. **QINIU_BUCKET**: 七牛云存储空间名称
4. **QINIU_REGION**: 七牛云区域代码（`z0`、`z1`、`z2`、`na0`、`as0`）
5. **QINIU_UPLOAD_PREFIX**（可选）: 上传文件的前缀路径，如 `blog/` 或 `dist/`

#### 区域代码说明

- `z0`: 华东
- `z1`: 华北
- `z2`: 华南
- `na0`: 北美
- `as0`: 东南亚

#### 工作流程

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发
3. 安装依赖并构建项目
4. 上传构建产物到七牛云 OSS

### 手动部署

#### 方式一：使用 .env 文件（推荐）

1. 复制 `.env.example` 文件为 `.env`：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的七牛云配置：

```bash
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
QINIU_BUCKET=your-bucket-name
QINIU_REGION=z0
QINIU_UPLOAD_PREFIX=blog/  # 可选
```

3. 构建并上传：

```bash
# 构建项目
npm run build

# 执行上传（会自动读取 .env 文件）
npm run deploy
```

#### 方式二：使用环境变量

如果需要手动部署，可以使用以下命令：

```bash
# 1. 构建项目
npm run build

# 2. 配置环境变量并上传
export QINIU_ACCESS_KEY="your-access-key"
export QINIU_SECRET_KEY="your-secret-key"
export QINIU_BUCKET="your-bucket-name"
export QINIU_REGION="z0"  # 根据实际情况选择
export QINIU_UPLOAD_PREFIX="blog/"  # 可选

# 3. 执行上传
npm run deploy
```

> **注意**: 环境变量的优先级高于 `.env` 文件。如果同时设置了环境变量和 `.env` 文件，将优先使用环境变量的值。

### 环境变量说明

上传脚本支持两种方式配置环境变量：

1. **`.env` 文件**（推荐用于本地开发）：在项目根目录创建 `.env` 文件
2. **系统环境变量**（推荐用于 CI/CD）：直接设置环境变量

> **优先级**: 系统环境变量 > `.env` 文件

| 变量名 | 必填 | 说明 | 默认值 |
|--------|------|------|--------|
| `QINIU_ACCESS_KEY` | ✅ | 七牛云 Access Key | - |
| `QINIU_SECRET_KEY` | ✅ | 七牛云 Secret Key | - |
| `QINIU_BUCKET` | ✅ | 存储空间名称 | - |
| `QINIU_REGION` | ✅ | 区域代码（z0/z1/z2/na0/as0） | - |
| `QINIU_UPLOAD_PREFIX` | ❌ | 上传文件前缀路径 | `""` |
| `QINIU_DIST_DIR` | ❌ | 构建产物目录 | `docs/.vitepress/dist` |

#### .env 文件示例

项目根目录已包含 `.env.example` 文件，你可以复制它并填入实际配置：

```bash
cp .env.example .env
```

`.env` 文件格式：

```env
# 七牛云配置
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
QINIU_BUCKET=your-bucket-name
QINIU_REGION=z0

# 可选配置
QINIU_UPLOAD_PREFIX=blog/
QINIU_DIST_DIR=docs/.vitepress/dist
```

> **安全提示**: `.env` 文件已添加到 `.gitignore`，不会被提交到 Git 仓库。

## 项目结构

```
blog/
├── docs/                    # 文档目录
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.ts       # 配置文件
│   │   └── theme/          # 主题配置
│   ├── golang/             # Go 语言相关文档
│   ├── network/             # 网络相关文档
│   ├── nginx/               # Nginx 相关文档
│   └── ...                  # 其他文档
├── scripts/                 # 脚本目录
│   └── upload-to-qiniu.mjs # 七牛云上传脚本
├── .github/
│   └── workflows/
│       └── deploy-qiniu.yml # GitHub Actions 工作流
├── package.json
└── README.md
```

## 开发规范

### 文档编写

- 使用 Markdown 格式编写文档
- 支持 Vue 组件和代码预览
- 支持数学公式（KaTeX）
- 支持代码高亮（highlight.js）

### 代码规范

- 使用 TypeScript
- 遵循 Vue 3 Composition API 最佳实践
- 使用 UnoCSS 进行样式管理

## 常见问题

### 1. 构建失败

确保已安装所有依赖：

```bash
npm install
```

### 2. 上传到七牛云失败

检查以下内容：

- 环境变量是否配置正确
- 七牛云 Access Key 和 Secret Key 是否有效
- 存储空间名称是否正确
- 区域代码是否匹配存储空间所在区域
- 是否有上传权限

### 3. GitHub Actions 部署失败

检查 GitHub Secrets 是否已正确配置，确保所有必填的 Secret 都已设置。

## 许可证

ISC

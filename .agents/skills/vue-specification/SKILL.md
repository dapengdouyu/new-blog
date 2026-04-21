---
name: vue-specification
description: vue项目技术栈版本使用说明
---

# Vue3 最新技术栈核心清单（Ant Design Vue 版）
| 技术类别         | 技术栈名称                     | 版本选择                  | 备注                     |
|------------------|--------------------------------|---------------------------|--------------------------|
| 核心框架         | Vue                            | 3.4.x（最新稳定版）       | 主框架，基于Composition API |
| 构建工具         | Vite                           | 5.4.0-beta.1（最新Beta版）| 核心构建工具，要求Beta版 |
| 强类型语言       | TypeScript                     | 5.5.x（最新稳定版）       | 全项目强类型约束         |
| 路由管理         | Vue Router                     | 4.4.x（最新稳定版）       | Vue3官方路由             |
| 状态管理         | Pinia                          | 2.2.x（最新稳定版）       | Vue3官方推荐，替代Vuex   |
| 企业级UI组件库   | Ant Design Vue                 | 4.2.x（最新稳定版）       | 替换Element Plus，Vue3适配 |
| HTTP请求客户端   | Axios                          | 1.7.x（最新稳定版）       | 前后端数据交互           |
| 代码检查         | ESLint                         | 9.x（最新稳定版）         | 代码质量规范             |
| 代码格式化       | Prettier                       | 3.x（最新稳定版）         | 团队代码风格统一         |
| Git提交规范      | Husky + lint-staged + Commitlint | 全最新稳定版            | 提交前检查+信息规范      |
| CSS方案          | PostCSS + Less/Sass            | 全最新稳定版              | 兼容处理+预编译需求      |
| 工具函数库       | lodash-es                      | 最新稳定版                | 按需导入，轻量高效       |
| 时间处理         | dayjs                          | 最新稳定版                | 轻量替代Moment.js        |
| Cookie操作       | js-cookie                      | 最新稳定版                | 前端Cookie管理           |
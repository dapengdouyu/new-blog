---
title: Deep Agents教程
description: LangChain 官方 Deep Agents 框架，从入门到生产部署的完整学习路径
---

# Deep Agents 教程

Deep Agents 是 LangChain 官方推出的 **Agent 开发框架**（agent harness），提供开箱即用的深度 Agent 能力。它受 Claude Code 启发，将规划、文件系统、子代理、上下文管理等能力整合为一个"电池全含"的 Agent 解决方案。

## 为什么选择 Deep Agents？

- **开箱即用**：`pip install deepagents` 即可获得一个功能完整的 Agent
- **规划能力**：内置 Todo 规划工具，支持复杂任务分解与进度追踪
- **文件系统**：内置读写文件、搜索、编辑等工具，Agent 可管理自己的工作空间
- **子代理**：支持任务委派，将工作拆分到独立的子 Agent 执行
- **上下文管理**：自动摘要、大输出存文件，解决长对话上下文溢出问题
- **模型无关**：支持 OpenAI、Anthropic、Google 等任意支持 Tool Calling 的 LLM
- **LangGraph 原生**：基于 LangGraph 构建，可使用流式、持久化、Studio 等全部特性

## 教程目录

### 入门篇

1. [认识深度 Agent](./1.DeepAgents入门：认识深度Agent) - 什么是深度 Agent、核心架构与安装

### 基础篇

2. [快速构建你的第一个 Agent](./2.DeepAgents基础：快速构建你的第一个Agent) - 使用 create_deep_agent 创建并运行 Agent
3. [内置工具详解](./3.DeepAgents基础：内置工具详解) - 文件系统、Shell、Todo 规划等内置工具

### 进阶篇

4. [自定义工具与提示词](./4.DeepAgents进阶：自定义工具与提示词) - 扩展 Agent 能力，定制系统提示词
5. [子代理与任务委派](./5.DeepAgents进阶：子代理与任务委派) - 使用 task 工具拆分复杂任务
6. [上下文管理与记忆](./6.DeepAgents进阶：上下文管理与记忆) - 虚拟文件系统、自动摘要与长对话管理

### 高级篇

7. [Deep Research 实战](./7.DeepAgents高级：Deep%20Research实战) - 构建深度研究 Agent 完整案例
8. [生产部署与最佳实践](./8.DeepAgents高级：生产部署与最佳实践) - LangGraph 集成、流式输出、CLI 与监控

## 前置知识

- Python 基础（函数、类、类型注解）
- 了解 LLM 基本概念（Prompt、Token、Tool Calling）
- 建议先学习 [LangGraph 教程](../langgraph/)（非必须，但有助于理解底层原理）

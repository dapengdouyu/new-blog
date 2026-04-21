---
title: LangGraph教程
description: LangGraph 从入门到精通，使用 Python 构建有状态的多步骤 AI 应用
---

# LangGraph 教程

LangGraph 是 LangChain 团队开发的一个框架，用于构建**有状态的、多步骤的 AI 应用**。它基于图（Graph）的概念，将复杂的 LLM 工作流建模为节点和边的组合，使得构建 Agent、多轮对话、多 Agent 协作等场景变得清晰可控。

## 为什么选择 LangGraph？

- **状态管理**：内置状态持久化，轻松管理多轮对话和长时间运行的任务
- **图结构建模**：用节点和边直观表达复杂的工作流逻辑
- **条件路由**：根据运行时状态动态决定执行路径
- **人机协作**：支持在关键节点暂停，等待人工审核后继续
- **多 Agent 协作**：可以组合多个 Agent 协同完成复杂任务

## 教程目录

### 入门篇

1. [快速开始](./1.LangGraph入门：快速开始) - 环境搭建与第一个 LangGraph 应用

### 基础篇

2. [状态与图结构](./2.LangGraph基础：状态与图结构) - 理解 StateGraph、状态定义与图的生命周期
3. [节点与边](./3.LangGraph基础：节点与边) - 掌握节点函数、普通边和条件边

### 进阶篇

4. [工具调用与 Agent](./4.LangGraph进阶：工具调用与Agent) - 构建能使用工具的智能 Agent
5. [持久化与检查点](./5.LangGraph进阶：持久化与检查点) - 状态持久化、对话记忆与断点恢复
6. [人机协作](./6.LangGraph进阶：人机协作) - 中断节点、人工审批与动态修改状态

### 高级篇

7. [子图与多 Agent 系统](./7.LangGraph高级：子图与多Agent系统) - 子图嵌套、多 Agent 协作架构
8. [流式输出与生产部署](./8.LangGraph高级：流式输出与生产部署) - 流式响应、错误处理与 LangGraph Platform

## 前置知识

- Python 基础（函数、类、类型注解）
- 了解 LLM 基本概念（Prompt、Token、Chat Model）
- 建议了解 LangChain 基础用法（非必须）

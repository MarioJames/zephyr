# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 构建的保险客户管理系统，采用 TypeScript 开发，使用现代化的技术栈构建智能对话和客户管理功能。

## 开发命令

### 基本开发命令
- `npm run dev` - 启动开发服务器 (http://localhost:3000)
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行代码检查

### 包管理器
项目同时支持多个包管理器，推荐使用 pnpm：
- 使用 `pnpm install` 安装依赖
- 也支持 npm、yarn、bun

### 数据库相关
- 使用 Drizzle ORM 管理数据库
- 配置文件：`drizzle.config.ts`
- 数据库迁移文件位于：`src/database/migrations/`
- 数据库模式定义：`src/database/schemas/`
- 支持 PostgreSQL (生产) 和 PGLite (开发/测试)

## 核心架构

### 技术栈
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **UI 库**: Ant Design + @lobehub/ui
- **样式**: Tailwind CSS + Antd Style
- **状态管理**: Zustand (多个独立 store)
- **数据库**: Drizzle ORM + PostgreSQL/PGLite
- **认证**: NextAuth.js + Clerk (支持 OIDC)
- **HTTP 客户端**: Axios (带自动 token 刷新)

### 目录结构

```
src/
├── app/                    # Next.js App Router 路由
│   ├── (main)/            # 主应用页面
│   │   ├── chat/          # 聊天/对话功能
│   │   ├── customer/      # 客户管理
│   │   └── employee/      # 员工管理
│   ├── api/               # API 路由定义
│   ├── oneapi/            # OneAPI 接口封装
│   └── mock/              # Mock 数据
├── components/            # 通用组件
├── config/                # 配置文件
│   ├── aiModels/          # AI 模型配置
│   └── modelProviders/    # AI 提供商配置
├── database/              # 数据库相关
├── features/              # 功能模块
├── hooks/                 # 自定义 Hooks
├── libs/                  # 核心库
│   ├── model-runtime/     # AI 模型运行时
│   ├── aliyun-mail.ts     # 阿里云邮件推送服务
│   ├── clerk-backend.ts   # Clerk 后端集成
│   └── swr.ts            # SWR 配置
├── store/                 # Zustand 状态管理
├── types/                 # TypeScript 类型定义
└── utils/                 # 工具函数
```

### 状态管理架构

使用 Zustand 实现模块化状态管理：
- `store/global/` - 全局状态
- `store/chat/` - 聊天相关状态
- `store/user/` - 用户相关状态
- `store/session/` - 会话管理状态
- `store/agent/` - AI 智能体状态

每个 store 包含：
- `store.ts` - store 主文件
- `initialState.ts` - 初始状态
- `selectors.ts` - 状态选择器
- `slices/` - 功能切片

### API 架构

1. **Services API 集成**: `/src/services/`
   - 提供标准化的 API 接口
   - 包含用户、角色、智能体、会话、话题、消息、邮件等模块
   - 支持完整的 TypeScript 类型定义
   - 邮件服务支持单发、批量发送和系统通知

2. **多 AI 提供商支持**: `/src/libs/model-runtime/`
   - 支持 OpenAI、Anthropic、Google、Azure 等多家提供商
   - 统一的模型运行时接口
   - 自动错误处理和重试机制

### 认证架构

支持多种认证方式：
- NextAuth.js (OAuth, JWT)
- Clerk (第三方认证服务)
- OIDC Provider (自建 OIDC 服务)
- 支持 ACCESS_CODE 访问控制

## 开发指南

### 添加新页面
1. 在 `src/app/(main)/` 下创建路由目录
2. 创建 `page.tsx` 文件
3. 如需布局，创建 `layout.tsx`

### 添加新 API 接口
1. 在 `src/app/api/` 下定义接口
2. 在 `src/services/` 中封装调用
3. 更新 TypeScript 类型定义

### 状态管理
1. 在相应的 store 中添加状态和操作
2. 使用 selectors 进行状态选择
3. 在组件中使用 useStore hook

### 样式开发
- 优先使用 Tailwind CSS 类名
- 复杂样式使用 antd-style
- 遵循 Ant Design 设计规范

## 重要配置

### 环境变量
- `DATABASE_URL` - 数据库连接字符串
- `NEXTAUTH_SECRET` - NextAuth 密钥
- `APP_URL` - 应用访问地址
- `ACCESS_CODE` - 访问控制码
- AI 提供商 API 密钥

#### 邮件服务配置
支持阿里云邮件推送服务（DirectMail），提供 SMTP 和 API 两种集成方式：

**SMTP 方式配置（推荐）：**
- `ALIYUN_MAIL_SMTP_HOST` - SMTP 服务器地址（默认：smtpdm.aliyun.com）
- `ALIYUN_MAIL_SMTP_PORT` - SMTP 端口（默认：25）
- `ALIYUN_MAIL_SMTP_SECURE` - 是否使用 SSL/TLS（默认：false）
- `ALIYUN_MAIL_SMTP_USER` - SMTP 用户名（发信邮箱）
- `ALIYUN_MAIL_SMTP_PASS` - SMTP 密码

**API 方式配置（可选）：**
- `ALIYUN_ACCESS_KEY_ID` - 阿里云 Access Key ID
- `ALIYUN_ACCESS_KEY_SECRET` - 阿里云 Access Key Secret
- `ALIYUN_MAIL_ENDPOINT` - API 端点（默认：https://dm.aliyuncs.com）

**其他配置：**
- `ALIYUN_MAIL_DEFAULT_FROM` - 默认发信邮箱
- `APP_NAME` - 应用名称（用于邮件模板）

### 特殊注意事项
1. 项目使用中文作为主要界面语言
2. 支持多种 AI 模型和提供商
3. 具有完整的权限管理系统
4. 支持实时聊天和消息翻译功能
5. 使用服务器端渲染 (SSR) 和客户端状态管理相结合的架构
# OneAPI 接口文档

## 概述

本项目基于 API 文档创建了完整的 TypeScript 接口定义，包含以下模块：

- **用户管理** (`user`) - 用户信息相关接口
- **角色管理** (`roles`) - 角色信息相关接口  
- **智能体管理** (`agents`) - Agent 相关接口
- **会话管理** (`sessions`) - 会话（客户）相关接口
- **话题管理** (`topics`) - 话题相关接口
- **消息管理** (`messages`) - 消息相关接口
- **翻译管理** (`message_translates`) - 消息翻译相关接口

## 使用方法

### 1. 导入 API 模块

```typescript
import { 
  userAPI, 
  rolesAPI, 
  agentsAPI, 
  sessionsAPI, 
  topicsAPI, 
  messagesAPI, 
  messageTranslatesAPI 
} from '@/services';
```

### 2. 导入类型定义

```typescript
import type {
  UserItem,
  RoleItem,
  AgentItem,
  SessionItem,
  TopicItem,
  MessageItem,
  MessageTranslateItem
} from '@/services';
```

## 接口示例

### 用户相关接口

```typescript
// 获取当前登录用户信息
const userInfo = await userAPI.getUserInfo();

// 获取所有用户列表
const userList = await userAPI.getUserList();
```

### 角色相关接口

```typescript
// 获取所有角色列表
const roleList = await rolesAPI.getRoleList();
```

### 智能体相关接口

```typescript
// 获取所有智能体列表
const agentList = await agentsAPI.getAgentList();

// 创建智能体
const newAgent = await agentsAPI.createAgent({
  title: "客服助手",
  description: "专业的客服智能体",
  model: "gpt-3.5-turbo",
  provider: "openai"
});
```

### 会话相关接口

```typescript
// 获取会话列表
const sessionList = await sessionsAPI.getSessionList({ userId: "user123" });

// 创建会话
const newSession = await sessionsAPI.createSession({
  config: {
    title: "客服助手",
    model: "gpt-3.5-turbo"
  },
  session: {
    title: "客户张三",
    model: "gpt-3.5-turbo",
    type: "agent"
  }
});

// 更新会话
const updatedSession = await sessionsAPI.updateSession({
  config: { /* 配置信息 */ },
  session: { /* 会话信息 */ }
});
```

### 话题相关接口

```typescript
// 获取指定会话的话题列表
const topicList = await topicsAPI.getTopicList({ sessionId: "session123" });

// 创建新话题
const newTopic = await topicsAPI.createTopic({
  sessionId: "session123",
  title: "产品咨询"
});

// 总结话题
const summaryTopic = await topicsAPI.summaryTopic("topic123");
```

### 消息相关接口

```typescript
// 获取指定话题的消息列表
const messageList = await messagesAPI.queryByTopic({ topicId: "topic123" });

// 创建新消息
const messageId = await messagesAPI.createMessage({
  content: "您好，有什么可以帮助您的吗？",
  role: "assistant",
  sessionId: "session123",
  topic: "topic123",
  fromModel: "gpt-3.5-turbo",
  fromProvider: "openai"
});
```

### 翻译相关接口

```typescript
// 查询消息翻译
const translate = await messageTranslatesAPI.queryTranslate({ 
  messageId: "message123" 
});

// 触发消息翻译
await messageTranslatesAPI.triggerTranslate({
  messageId: "message123",
  from: "zh",
  to: "en"
});
```

## 类型定义

所有接口都包含完整的 TypeScript 类型定义，包括：

- **请求参数类型** - 如 `SessionListRequest`、`TopicCreateRequest` 等
- **响应数据类型** - 如 `SessionItem`、`TopicItem` 等
- **枚举类型** - 如消息角色 `"user" | "assistant" | "system" | "tool"`

## 错误处理

所有接口都基于 axios 实例，包含：

- 自动 token 管理
- 请求/响应拦截器
- 错误处理和重试机制
- 统一的错误响应格式

## 注意事项

1. 所有接口都需要用户登录状态
2. 接口会自动处理 token 刷新
3. 响应数据包含完整的数据库字段信息
4. 支持 TypeScript 类型检查和自动补全 
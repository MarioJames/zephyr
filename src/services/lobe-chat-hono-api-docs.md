# Lobe Chat Hono API 接口文档

## 概述

Lobe Chat 基于 Hono 框架构建的 RESTful API 系统，提供完整的聊天应用后端服务。所有接口都使用 `/api/v1` 作为基础路径。

## 认证机制

- **认证方式**: 支持 OIDC 和 API Key 两种认证方式
- **权限控制**: 基于 RBAC 的权限管理系统
- **作用域**: 支持 ALL、WORKSPACE、OWNER 三种权限作用域

## 全局配置

- **基础路径**: `/api/v1`
- **CORS**: 已启用跨域支持
- **日志**: 集成请求日志记录
- **错误处理**: 统一错误响应格式
- **健康检查**: `GET /api/v1/health`

---

## 1. 智能体管理 (Agents)

### 1.1 获取所有智能体

**接口**: `GET /api/v1/agents`

**权限**: 需要 AGENT_READ 权限 (ALL, WORKSPACE)

**响应**:
```typescript
AgentListItem[] // 智能体列表，包含关联的会话信息
```

### 1.2 创建智能体

**接口**: `POST /api/v1/agents`

**权限**: 需要 AGENT_CREATE_ALL 权限（仅管理员）

**请求参数**:
```typescript
{
  title: string;                    // 必填，智能体标题
  avatar?: string;                  // 头像URL
  description?: string;             // 描述
  model?: string;                   // 模型名称
  provider?: string;                // 提供商
  systemRole?: string;              // 系统角色
  params?: Record<string, unknown>; // 自定义参数
  chatConfig?: {                    // 聊天配置
    autoCreateTopicThreshold: number;
    enableAutoCreateTopic?: boolean;
    enableCompressHistory?: boolean;
    enableHistoryCount?: boolean;
    enableMaxTokens?: boolean;
    enableReasoning?: boolean;
    historyCount?: number;
    temperature?: number;
    // ... 更多配置项
  };
}
```

### 1.3 更新智能体

**接口**: `PUT /api/v1/agents/:id`

**权限**: 需要 AGENT_UPDATE_ALL 权限（仅管理员）

**路径参数**: `id` - 智能体ID

**请求参数**: 与创建智能体相同，加上 `id` 字段

### 1.4 删除智能体

**接口**: `DELETE /api/v1/agents/:id`

**权限**: 需要 AGENT_DELETE_ALL 权限（仅管理员）

**路径参数**: `id` - 智能体ID

### 1.5 获取智能体详情

**接口**: `GET /api/v1/agents/:id`

**权限**: 需要 AGENT_READ 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 智能体ID

**响应**:
```typescript
{
  // 智能体基本信息
  id: string;
  title: string;
  avatar?: string;
  description?: string;
  model?: string;
  provider?: string;
  systemRole?: string;
  
  // 关联信息
  agentsFiles?: Array<{
    file: {
      id: string;
      name: string;
      fileType: string;
      size: number;
    };
  }>;
  agentsKnowledgeBases?: Array<{
    knowledgeBase: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  agentsToSessions?: Array<{
    session: {
      id: string;
      title?: string;
      avatar?: string;
      description?: string;
      updatedAt: Date;
    };
  }>;
}
```

---

## 2. 聊天服务 (Chat)

### 2.1 通用聊天接口

**接口**: `POST /api/v1/chat`

**权限**: 无特殊权限要求

**请求参数**:
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  provider?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
```

**响应**:
```typescript
{
  content: string;
  model?: string;
  provider?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}
```

### 2.2 翻译接口

**接口**: `POST /api/v1/chat/translate`

**请求参数**:
```typescript
{
  text: string;           // 必填，待翻译文本
  toLanguage: string;     // 必填，目标语言
  fromLanguage?: string;  // 源语言
  model?: string;
  provider?: string;
}
```

### 2.3 生成回复接口

**接口**: `POST /api/v1/chat/generate-reply`

**请求参数**:
```typescript
{
  userMessage: string;              // 必填，用户消息
  sessionId: string | null;         // 会话ID
  agentId?: string;                 // 智能体ID
  conversationHistory: Array<{      // 对话历史
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  provider?: string;
}
```

### 2.4 健康检查

**接口**: `GET /api/v1/chat/health`

---

## 3. 文件管理 (Files)

### 3.1 单文件上传

**接口**: `POST /api/v1/files/upload`

**权限**: 需要认证

**请求类型**: `multipart/form-data`

**表单字段**:
- `file`: File (必填) - 要上传的文件
- `knowledgeBaseId`: string (可选) - 知识库ID
- `skipCheckFileType`: boolean (可选) - 是否跳过文件类型检查
- `directory`: string (可选) - 上传目录

**响应**:
```typescript
{
  id: string;
  filename: string;
  fileType: string;
  size: number;
  hash: string;
  url: string;
  uploadedAt: string;
  metadata: FileMetadata;
}
```

### 3.2 批量文件上传

**接口**: `POST /api/v1/files/batch-upload`

**权限**: 需要认证

**请求类型**: `multipart/form-data`

**表单字段**:
- `files`: File[] (必填) - 要上传的文件列表
- `knowledgeBaseId`: string (可选) - 知识库ID
- `skipCheckFileType`: boolean (可选) - 是否跳过文件类型检查
- `directory`: string (可选) - 上传目录

**响应**:
```typescript
{
  successful: FileUploadResponse[];
  failed: Array<{
    filename: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}
```

### 3.3 获取文件列表

**接口**: `GET /api/v1/files`

**权限**: 需要认证

**查询参数**:
- `page`: number (可选) - 页码，默认1
- `pageSize`: number (可选) - 每页数量，默认20，最大100
- `fileType`: string (可选) - 文件类型过滤
- `knowledgeBaseId`: string (可选) - 知识库ID过滤
- `search`: string (可选) - 搜索关键词

**响应**:
```typescript
{
  files: FileUploadResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

### 3.4 获取文件详情

**接口**: `GET /api/v1/files/:id`

**权限**: 需要认证

**路径参数**: `id` - 文件ID

### 3.5 删除文件

**接口**: `DELETE /api/v1/files/:id`

**权限**: 需要认证

**路径参数**: `id` - 文件ID

---

## 4. 消息管理 (Messages)

### 4.1 获取示例数据

**接口**: `GET /api/v1/messages`

**权限**: 需要 MESSAGE_READ 权限 (ALL, WORKSPACE, OWNER)

### 4.2 根据话题统计消息数量

**接口**: `POST /api/v1/messages/count/by-topics`

**权限**: 需要 MESSAGE_READ 权限

**请求参数**:
```typescript
{
  topicIds: string[]; // 话题ID数组
}
```

### 4.3 根据用户统计消息数量

**接口**: `POST /api/v1/messages/count/by-user`

**权限**: 需要 MESSAGE_READ_ALL 权限（仅管理员）

**请求参数**:
```typescript
{
  userId: string; // 用户ID
}
```

### 4.4 根据话题获取消息列表

**接口**: `GET /api/v1/messages/queryByTopic`

**权限**: 需要 MESSAGE_READ 权限 (ALL, WORKSPACE, OWNER)

**查询参数**:
```typescript
{
  topicId: string; // 话题ID
}
```

### 4.5 创建消息

**接口**: `POST /api/v1/messages`

**权限**: 需要 MESSAGE_CREATE 权限 (ALL, WORKSPACE, OWNER)

**请求参数**:
```typescript
{
  content: string;
  role: 'user' | 'assistant' | 'system';
  topicId: string;
  // ... 其他消息字段
}
```

### 4.6 创建消息并生成AI回复

**接口**: `POST /api/v1/messages/reply`

**权限**: 需要 MESSAGE_CREATE 权限 (ALL, WORKSPACE, OWNER)

**请求参数**: 与创建消息相同

---

## 5. 消息翻译 (Message Translates)

### 5.1 获取消息翻译

**接口**: `GET /api/v1/message-translates`

**权限**: 需要 MESSAGE_READ 权限 (ALL, WORKSPACE, OWNER)

**查询参数**:
```typescript
{
  messageId: string; // 消息ID
}
```

### 5.2 翻译消息

**接口**: `POST /api/v1/message-translates`

**权限**: 需要 MESSAGE_UPDATE 权限 (ALL, WORKSPACE, OWNER)

**请求参数**:
```typescript
{
  messageId: string;    // 消息ID
  targetLanguage: string; // 目标语言
}
```

---

## 6. 角色管理 (Roles)

### 6.1 获取所有角色

**接口**: `GET /api/v1/roles`

**权限**: 需要 RBAC_ROLE_READ 权限 (ALL, WORKSPACE)

### 6.2 获取活跃角色

**接口**: `GET /api/v1/roles/active`

**权限**: 需要 RBAC_ROLE_READ 权限 (ALL, WORKSPACE)

### 6.3 根据ID获取角色

**接口**: `GET /api/v1/roles/:id`

**权限**: 需要 RBAC_ROLE_READ 权限 (ALL, WORKSPACE)

**路径参数**: `id` - 角色ID

### 6.4 获取角色权限

**接口**: `GET /api/v1/roles/:id/permissions`

**权限**: 需要 RBAC_ROLE_READ 权限 (ALL, WORKSPACE)

**路径参数**: `id` - 角色ID

---

## 7. 会话管理 (Sessions)

### 7.1 获取会话列表

**接口**: `GET /api/v1/sessions`

**权限**: 需要 SESSION_READ 权限 (ALL, WORKSPACE, OWNER)

**查询参数**:
```typescript
{
  page?: number;
  pageSize?: number;
  groupId?: string;
}
```

### 7.2 获取分组会话列表

**接口**: `GET /api/v1/sessions/grouped`

**权限**: 需要 SESSION_READ 权限 (ALL, WORKSPACE, OWNER)

### 7.3 搜索会话

**接口**: `GET /api/v1/sessions/search`

**权限**: 需要 SESSION_READ 权限 (ALL, WORKSPACE, OWNER)

**查询参数**:
```typescript
{
  q: string;        // 搜索关键词
  limit?: number;   // 结果限制
}
```

### 7.4 创建会话

**接口**: `POST /api/v1/sessions`

**权限**: 需要 SESSION_CREATE 权限 (ALL, WORKSPACE)

**请求参数**:
```typescript
{
  title: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  groupId?: string;
  agentId?: string;
}
```

### 7.5 获取会话详情

**接口**: `GET /api/v1/sessions/:id`

**权限**: 需要 SESSION_READ 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 会话ID

### 7.6 更新会话

**接口**: `PUT /api/v1/sessions/:id`

**权限**: 需要 SESSION_UPDATE 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 会话ID

**请求参数**: 与创建会话相同

### 7.7 删除会话

**接口**: `DELETE /api/v1/sessions/:id`

**权限**: 需要 SESSION_DELETE 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 会话ID

### 7.8 克隆会话

**接口**: `POST /api/v1/sessions/:id/clone`

**权限**: 需要 SESSION_CREATE 权限 (ALL, WORKSPACE)

**路径参数**: `id` - 会话ID

**请求参数**:
```typescript
{
  title?: string;
  includeMessages?: boolean;
}
```

---

## 8. 会话组管理 (Session Groups)

### 8.1 获取会话组列表

**接口**: `GET /api/v1/session-groups`

**权限**: 需要 SESSION_GROUP_READ 权限 (ALL, WORKSPACE, OWNER)

### 8.2 创建会话组

**接口**: `POST /api/v1/session-groups`

**权限**: 需要 SESSION_GROUP_CREATE 权限 (ALL, WORKSPACE)

**请求参数**:
```typescript
{
  name: string;
  description?: string;
  sort?: number;
}
```

### 8.3 更新会话组排序

**接口**: `PUT /api/v1/session-groups/order`

**权限**: 需要 SESSION_GROUP_UPDATE 权限 (ALL, WORKSPACE)

**请求参数**:
```typescript
{
  orders: Array<{
    id: string;
    sort: number;
  }>;
}
```

### 8.4 获取会话组详情

**接口**: `GET /api/v1/session-groups/:id`

**权限**: 需要 SESSION_GROUP_READ 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 会话组ID

### 8.5 更新会话组

**接口**: `PUT /api/v1/session-groups/:id`

**权限**: 需要 SESSION_GROUP_UPDATE 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 会话组ID

**请求参数**: 与创建会话组相同

### 8.6 删除会话组

**接口**: `DELETE /api/v1/session-groups/:id`

**权限**: 需要 SESSION_GROUP_DELETE 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 会话组ID

### 8.7 删除所有会话组

**接口**: `DELETE /api/v1/session-groups`

**权限**: 需要 SESSION_GROUP_DELETE 权限 (ALL, WORKSPACE)

---

## 9. 话题管理 (Topics)

### 9.1 获取会话的所有话题

**接口**: `GET /api/v1/topics`

**权限**: 需要 TOPIC_READ 权限 (ALL, WORKSPACE, OWNER)

**查询参数**:
```typescript
{
  sessionId: string; // 会话ID
}
```

### 9.2 创建话题

**接口**: `POST /api/v1/topics`

**权限**: 需要 TOPIC_CREATE 权限 (ALL, WORKSPACE, OWNER)

**请求参数**:
```typescript
{
  title: string;
  sessionId: string;
  favorite?: boolean;
}
```

### 9.3 话题总结

**接口**: `POST /api/v1/topics/:id/summary`

**权限**: 需要 TOPIC_UPDATE 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 话题ID

**请求参数**:
```typescript
{
  model?: string;
  provider?: string;
}
```

---

## 10. 用户管理 (Users)

### 10.1 获取当前用户信息

**接口**: `GET /api/v1/users/me`

**权限**: 需要认证

### 10.2 获取所有用户

**接口**: `GET /api/v1/users`

**权限**: 需要 USER_READ 权限 (ALL, WORKSPACE)

### 10.3 创建用户

**接口**: `POST /api/v1/users`

**权限**: 需要 USER_CREATE 权限 (ALL, WORKSPACE)

**请求参数**:
```typescript
{
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  roleId?: string;
}
```

### 10.4 获取用户详情

**接口**: `GET /api/v1/users/:id`

**权限**: 需要 USER_READ 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 用户ID

### 10.5 更新用户

**接口**: `PUT /api/v1/users/:id`

**权限**: 需要 USER_UPDATE 权限 (ALL, WORKSPACE, OWNER)

**路径参数**: `id` - 用户ID

**请求参数**: 与创建用户相同

### 10.6 删除用户

**接口**: `DELETE /api/v1/users/:id`

**权限**: 需要 USER_DELETE 权限 (ALL, WORKSPACE)

**路径参数**: `id` - 用户ID

---

## 权限系统说明

### 权限作用域

- **ALL**: 全局权限，可以操作所有资源
- **WORKSPACE**: 工作区权限，可以操作工作区内的资源
- **OWNER**: 所有者权限，只能操作自己创建的资源

### 常见权限类型

- **READ**: 读取权限
- **CREATE**: 创建权限
- **UPDATE**: 更新权限
- **DELETE**: 删除权限

### 权限命名规范

格式: `{RESOURCE}_{ACTION}_{SCOPE}`

例如:
- `AGENT_READ_ALL`: 读取所有智能体的权限
- `SESSION_CREATE_WORKSPACE`: 在工作区创建会话的权限
- `MESSAGE_UPDATE_OWNER`: 更新自己消息的权限

---

## 错误处理

所有接口都使用统一的错误响应格式:

```typescript
{
  error: string;    // 错误信息
  code?: string;    // 错误代码
  details?: any;    // 详细信息
}
```

常见HTTP状态码:
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 使用示例

### 创建智能体示例

```typescript
// 请求
POST /api/v1/agents
Content-Type: application/json
Authorization: Bearer your-token

{
  "title": "AI助手",
  "description": "通用AI助手",
  "model": "gpt-4",
  "provider": "openai",
  "systemRole": "你是一个有帮助的AI助手",
  "chatConfig": {
    "autoCreateTopicThreshold": 10,
    "enableAutoCreateTopic": true,
    "temperature": 0.7
  }
}
```

### 上传文件示例

```typescript
// 使用FormData上传文件
const formData = new FormData();
formData.append('file', fileObject);
formData.append('knowledgeBaseId', 'kb-123');
formData.append('directory', 'documents');

fetch('/api/v1/files/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-token'
  },
  body: formData
});
```

### 发起聊天示例

```typescript
// 请求
POST /api/v1/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "system",
      "content": "你是一个有帮助的AI助手"
    },
    {
      "role": "user", 
      "content": "你好，请介绍一下自己"
    }
  ],
  "model": "gpt-4",
  "provider": "openai",
  "temperature": 0.7,
  "stream": false
}
```

---

这份文档涵盖了 Lobe Chat Hono API 的所有主要接口，包括详细的请求参数、响应格式、权限要求等信息，方便在其他项目中使用 AI 来生成相关的接口调用代码。
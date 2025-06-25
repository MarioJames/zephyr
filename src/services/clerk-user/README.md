# Clerk 用户管理服务

这个模块提供了 Clerk 用户管理的后端 API 封装，包括用户创建、信息更新、密码重置等核心功能。

## 环境变量配置

在使用之前，请确保在 `.env` 文件中配置以下环境变量：

```env
# Clerk 配置
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 功能特性

- ✅ 用户创建
- ✅ 用户信息更新
- ✅ 用户信息查询
- ✅ 用户列表获取
- ✅ 密码重置（邮件方式）
- ✅ 根据邮箱查找用户
- ✅ 用户禁用/启用
- ✅ 用户删除
- ✅ 统一的错误处理
- ✅ TypeScript 类型支持

## 使用方法

### 基本使用

```typescript
import { clerkUserService } from '@/services/clerk-user';

// 创建用户
const createResult = await clerkUserService.createUser({
  emailAddress: ['user@example.com'],
  password: 'securePassword123',
  firstName: '张',
  lastName: '三',
  username: 'zhangsan'
});

if (createResult.success) {
  console.log('用户创建成功:', createResult.data);
} else {
  console.error('创建失败:', createResult.error);
}
```

### API 方法列表

#### 1. 创建用户
```typescript
async createUser(params: CreateUserParams): ServiceResult<User>
```

**参数说明:**
- `emailAddress: string[]` - 邮箱地址数组
- `password?: string` - 密码（可选）
- `firstName?: string` - 名字
- `lastName?: string` - 姓氏
- `username?: string` - 用户名

#### 2. 更新用户信息
```typescript
async updateUser(userId: string, params: UpdateUserParams): ServiceResult<User>
```

#### 3. 获取用户信息
```typescript
async getUser(userId: string): ServiceResult<User>
```

#### 4. 删除用户
```typescript
async deleteUser(userId: string): ServiceResult<User>
```

#### 5. 重置密码
```typescript
async resetPassword(userId: string): ServiceResult<boolean>
```

#### 6. 获取用户列表
```typescript
async getAllUsers(options?: UserQueryOptions): ServiceResult<UserListResponse>
```

**查询选项:**
- `limit?: number` - 每页数量，默认 10
- `offset?: number` - 偏移量，默认 0
- `orderBy?: string` - 排序字段，默认 '-created_at'
- `query?: string` - 搜索关键词

#### 7. 根据邮箱查找用户
```typescript
async getUserByEmail(emailAddress: string): ServiceResult<User | null>
```

#### 8. 禁用用户
```typescript
async banUser(userId: string): ServiceResult<User>
```

#### 9. 启用用户
```typescript
async unbanUser(userId: string): ServiceResult<User>
```

## 响应格式

所有方法都返回统一的响应格式：

```typescript
interface ClerkApiResponse<T> {
  data: T;                 // 返回数据
  success: boolean;        // 操作是否成功
  message?: string;        // 成功消息
  error?: string;          // 错误消息
}
```

## 使用示例

### 完整的用户管理流程

```typescript
import { clerkUserService } from '@/services/clerk-user';

// 1. 创建用户
const createResult = await clerkUserService.createUser({
  emailAddress: ['newuser@example.com'],
  password: 'securePassword123',
  firstName: '新',
  lastName: '用户'
});

if (createResult.success) {
  const userId = createResult.data.id;

  // 2. 更新用户信息
  const updateResult = await clerkUserService.updateUser(userId, {
    publicMetadata: {
      department: '技术部',
      role: '开发工程师'
    }
  });

  // 3. 获取更新后的用户信息
  const userResult = await clerkUserService.getUser(userId);

  // 4. 如果需要，重置密码
  const resetResult = await clerkUserService.resetPassword(userId);

  console.log('用户管理操作完成');
}
```

### 批量操作示例

```typescript
// 获取所有用户并进行批量操作
const userListResult = await clerkUserService.getAllUsers({
  limit: 100,
  orderBy: '-created_at'
});

if (userListResult.success) {
  for (const user of userListResult.data.data) {
    // 对每个用户执行操作
    console.log(`处理用户: ${user.firstName} ${user.lastName}`);
  }
}
```

## 错误处理

服务会自动捕获和处理错误，返回标准化的错误响应：

```typescript
const result = await clerkUserService.createUser(params);

if (!result.success) {
  console.error('操作失败:', result.error);
  // 根据错误信息进行相应处理
}
```

## 注意事项

1. **环境变量**: 确保正确配置 Clerk 的环境变量
2. **权限**: 确保 Clerk Secret Key 有足够的权限执行相应操作
3. **限流**: 注意 Clerk API 的调用频率限制
4. **错误处理**: 始终检查返回结果的 `success` 字段
5. **敏感信息**: 不要在客户端暴露 Secret Key

## 相关文件

- `src/libs/clerk-backend/index.ts` - Clerk 后端客户端配置
- `src/types/clerk.ts` - 类型定义
- `src/services/clerk-user/examples.ts` - 使用示例
- `src/services/clerk-user/index.ts` - 主服务文件

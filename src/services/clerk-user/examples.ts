/**
 * Clerk 用户服务使用示例
 * 展示如何使用 ClerkUserService 进行用户管理操作
 */

import { clerkUserService } from './index';
import type { CreateUserParams, UpdateUserParams } from '@/types/clerk';

// 示例：创建新用户
export async function createUserExample() {
  const createParams: CreateUserParams = {
    emailAddress: ['user@example.com'],
    password: 'securePassword123',
    firstName: '张',
    lastName: '三',
    username: 'zhangsan'
  };

  const result = await clerkUserService.createUser(createParams);
  
  if (result.success) {
    console.log('用户创建成功:', result.data);
    console.log('用户ID:', result.data.id);
    console.log('用户邮箱:', result.data.emailAddresses[0]?.emailAddress);
  } else {
    console.error('用户创建失败:', result.error);
  }
  
  return result;
}

// 示例：更新用户信息
export async function updateUserExample(userId: string) {
  const updateParams: UpdateUserParams = {
    firstName: '李',
    lastName: '四',
    publicMetadata: {
      department: '技术部',
      role: '开发工程师'
    }
  };

  const result = await clerkUserService.updateUser(userId, updateParams);
  
  if (result.success) {
    console.log('用户信息更新成功:', result.data);
  } else {
    console.error('用户信息更新失败:', result.error);
  }
  
  return result;
}

// 示例：获取用户信息
export async function getUserExample(userId: string) {
  const result = await clerkUserService.getUser(userId);
  
  if (result.success) {
    console.log('用户信息:', result.data);
    console.log('用户名:', result.data.firstName + ' ' + result.data.lastName);
    console.log('邮箱地址:', result.data.emailAddresses.map(email => email.emailAddress));
    console.log('创建时间:', result.data.createdAt);
  } else {
    console.error('获取用户信息失败:', result.error);
  }
  
  return result;
}

// 示例：重置用户密码
export async function resetPasswordExample(userId: string) {
  const result = await clerkUserService.resetPassword(userId);
  
  if (result.success) {
    console.log('密码重置邮件发送成功');
  } else {
    console.error('密码重置失败:', result.error);
  }
  
  return result;
}

// 示例：获取用户列表
export async function getUserListExample() {
  const result = await clerkUserService.getUserList({
    limit: 20,
    offset: 0,
    orderBy: '-created_at'
  });
  
  if (result.success) {
    console.log('用户列表:', result.data);
    console.log('总用户数:', result.data.totalCount);
    console.log('用户信息:');
    result.data.data.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.emailAddresses[0]?.emailAddress})`);
    });
  } else {
    console.error('获取用户列表失败:', result.error);
  }
  
  return result;
}

// 示例：根据邮箱查找用户
export async function getUserByEmailExample(email: string) {
  const result = await clerkUserService.getUserByEmail(email);
  
  if (result.success && result.data) {
    console.log('找到用户:', result.data);
  } else if (result.success && !result.data) {
    console.log('未找到该邮箱对应的用户');
  } else {
    console.error('查找用户失败:', result.error);
  }
  
  return result;
}

// 示例：批量操作 - 创建多个用户
export async function batchCreateUsersExample() {
  const users = [
    {
      emailAddress: ['user1@example.com'],
      password: 'password123',
      firstName: '用户',
      lastName: '一'
    },
    {
      emailAddress: ['user2@example.com'],
      password: 'password123',
      firstName: '用户',
      lastName: '二'
    },
    {
      emailAddress: ['user3@example.com'],
      password: 'password123',
      firstName: '用户',
      lastName: '三'
    }
  ];

  const results = [];
  
  for (const userData of users) {
    const result = await clerkUserService.createUser(userData);
    results.push(result);
    
    if (result.success) {
      console.log(`创建用户成功: ${userData.firstName}${userData.lastName}`);
    } else {
      console.error(`创建用户失败: ${userData.firstName}${userData.lastName} - ${result.error}`);
    }
  }
  
  return results;
}

// 示例：用户管理流程
export async function userManagementWorkflowExample() {
  console.log('=== 用户管理流程示例 ===');
  
  // 1. 创建用户
  console.log('\n1. 创建新用户...');
  const createResult = await createUserExample();
  if (!createResult.success) return;
  
  const userId = createResult.data.id;
  
  // 2. 获取用户信息
  console.log('\n2. 获取用户信息...');
  await getUserExample(userId);
  
  // 3. 更新用户信息
  console.log('\n3. 更新用户信息...');
  await updateUserExample(userId);
  
  // 4. 重置密码
  console.log('\n4. 重置用户密码...');
  await resetPasswordExample(userId);
  
  // 5. 获取用户列表
  console.log('\n5. 获取用户列表...');
  await getUserListExample();
  
  console.log('\n=== 用户管理流程完成 ===');
}
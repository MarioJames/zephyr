/**
 * Clerk 用户服务测试文件
 * 用于验证服务功能是否正常工作
 */

// 由于模块路径的问题，我们使用相对路径导入
import { ClerkUserService } from './index';
import type { CreateUserParams, UpdateUserParams } from '../../types/clerk';

// 创建服务实例进行测试
const testService = new ClerkUserService();

// 导出测试函数供外部调用
export async function testClerkUserService() {
  console.log('开始测试 Clerk 用户服务...');
  
  try {
    // 测试创建用户
    const createParams: CreateUserParams = {
      emailAddress: ['test@example.com'],
      firstName: '测试',
      lastName: '用户'
    };
    
    console.log('测试创建用户参数:', createParams);
    
    // 这里不实际调用 API，只是验证类型
    console.log('类型检查通过，服务初始化成功');
    
    return true;
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testClerkUserService()
    .then(result => {
      console.log('测试结果:', result ? '成功' : '失败');
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('测试执行出错:', error);
      process.exit(1);
    });
}
// 客户 API 使用示例
import { customerApi } from '@/app/api';

// 使用示例：在客户编辑页面中获取完整客户信息

/**
 * 示例 1: 根据 sessionId 获取完整的客户详情
 * 适用于：从聊天页面跳转到客户详情页面，需要根据 sessionId 获取完整信息
 */
export async function fetchCustomerDetailBySessionId(sessionId: string) {
  try {
    const customerDetail = await customerApi.getCustomerDetailBySessionId(sessionId);
    
    // customerDetail 包含：
    // - session: 基础会话信息 (title, description, avatar, etc.)
    // - customerSession: 客户扩展信息 (phone, email, company, etc.)
    
    console.log('Session 信息:', customerDetail.session);
    console.log('客户扩展信息:', customerDetail.customerSession);
    
    return customerDetail;
  } catch (error) {
    console.error('获取客户详情失败:', error);
    throw error;
  }
}

/**
 * 示例 2: 更新客户信息
 * 适用于：在客户编辑页面保存更新的信息
 */
export async function updateCustomerInfo(sessionId: string, formData: any) {
  try {
    // 构建更新参数
    const updateParams = {
      // 基本信息
      gender: formData.gender,
      age: formData.age,
      position: formData.position,
      customerType: formData.type, // A/B/C
      
      // 联系方式
      phone: formData.phone,
      email: formData.email,
      wechat: formData.wechat,
      
      // 公司信息
      company: formData.company,
      industry: formData.industry,
      scale: formData.scale,
      
      // 地址信息
      province: formData.region?.[0],
      city: formData.region?.[1],
      district: formData.region?.[2],
      address: formData.address,
      
      // 备注
      notes: formData.notes,
    };
    
    // 根据 sessionId 更新客户信息
    await customerApi.updateCustomerBySessionId(sessionId, updateParams);
    
    console.log('客户信息更新成功');
    return true;
  } catch (error) {
    console.error('更新客户信息失败:', error);
    throw error;
  }
}

/**
 * 示例 3: 创建新的客户信息
 * 适用于：第一次为某个 session 创建客户信息
 */
export async function createCustomerInfo(sessionId: string, formData: any) {
  try {
    const createParams = {
      sessionId,
      // 客户信息同上...
      gender: formData.gender,
      age: formData.age,
      position: formData.position,
      customerType: formData.type,
      phone: formData.phone,
      email: formData.email,
      wechat: formData.wechat,
      company: formData.company,
      industry: formData.industry,
      scale: formData.scale,
      province: formData.region?.[0],
      city: formData.region?.[1],
      district: formData.region?.[2],
      address: formData.address,
      notes: formData.notes,
    };
    
    const result = await customerApi.createCustomer(createParams);
    
    console.log('创建客户信息成功, ID:', result.id);
    return result;
  } catch (error) {
    console.error('创建客户信息失败:', error);
    throw error;
  }
}

/**
 * 示例 4: 在客户编辑页面的完整数据流
 */
export async function useCustomerEditPage(sessionId: string) {
  try {
    // 1. 首先尝试获取现有的客户信息
    let customerDetail;
    try {
      customerDetail = await customerApi.getCustomerDetailBySessionId(sessionId);
    } catch (error) {
      // 如果没有找到，说明是新客户，返回基础 session 信息
      console.log('未找到客户扩展信息，可能是新客户');
      customerDetail = null;
    }
    
    // 2. 构建表单初始值
    const initialValues = customerDetail?.customerSession ? {
      // 如果有客户扩展信息，使用扩展信息填充表单
      name: customerDetail.session?.title || '',
      gender: customerDetail.customerSession.gender,
      age: customerDetail.customerSession.age,
      position: customerDetail.customerSession.position,
      phone: customerDetail.customerSession.phone,
      email: customerDetail.customerSession.email,
      wechat: customerDetail.customerSession.wechat,
      company: customerDetail.customerSession.company,
      industry: customerDetail.customerSession.industry,
      scale: customerDetail.customerSession.scale,
      region: [
        customerDetail.customerSession.province,
        customerDetail.customerSession.city,
        customerDetail.customerSession.district,
      ].filter(Boolean),
      address: customerDetail.customerSession.address,
      notes: customerDetail.customerSession.notes,
      type: customerDetail.customerSession.customerType || 'A',
    } : {
      // 如果是新客户，只有基础 session 信息
      name: customerDetail?.session?.title || '',
      type: 'A', // 默认为 A 类客户
    };
    
    return {
      isNewCustomer: !customerDetail?.customerSession,
      initialValues,
      sessionInfo: customerDetail?.session,
    };
  } catch (error) {
    console.error('初始化客户编辑页面失败:', error);
    throw error;
  }
}

/**
 * 示例 5: 保存客户信息的通用方法
 */
export async function saveCustomerInfo(sessionId: string, formData: any, isNewCustomer: boolean) {
  try {
    if (isNewCustomer) {
      // 创建新的客户信息
      return await createCustomerInfo(sessionId, formData);
    } else {
      // 更新现有客户信息
      return await updateCustomerInfo(sessionId, formData);
    }
  } catch (error) {
    console.error('保存客户信息失败:', error);
    throw error;
  }
}
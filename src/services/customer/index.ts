import { http } from '../request';
import sessionsAPI, {
  SessionItem,
  SessionCreateRequest,
  SessionUpdateRequest,
  SessionListRequest,
} from '@/services/sessions';

// 客户相关类型定义
// 客户扩展信息类型
export interface CustomerExtendInfo {
  id: number;
  sessionId: string;
  gender?: string | null;
  age?: number | null;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  wechat?: string | null;
  company?: string | null;
  industry?: string | null;
  scale?: string | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 客户完整信息类型（包括 Session 和扩展信息）
export interface CustomerItem {
  // Session 基础信息
  session: SessionItem;
  // 客户扩展信息
  extend?: CustomerExtendInfo;
}

export interface CustomerListRequest {
  page?: number;
  pageSize?: number;
  keyword?: string;
  agentId?: string;
  userId?: string;
}

export interface CustomerListResponse {
  data: CustomerItem[];
  total: number;
}

// 客户创建请求类型（包括 Session 和扩展信息）
export interface CustomerCreateRequest {
  // 外部系统字段（sessions）
  title: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  groupId?: string;
  agentId?: string;

  // 内部扩展字段（customerSessions）
  gender?: string;
  age?: number;
  position?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  company?: string;
  industry?: string;
  scale?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  notes?: string;
}

// 客户扩展信息创建请求类型
export interface CustomerExtendCreateRequest {
  sessionId: string;
  gender?: string;
  age?: number;
  position?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  company?: string;
  industry?: string;
  scale?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  notes?: string;
}

// 客户扩展信息更新请求类型
export interface CustomerExtendUpdateRequest
  extends Partial<Omit<CustomerExtendCreateRequest, 'sessionId'>> {}

export interface CustomerUpdateRequest extends Partial<CustomerCreateRequest> {}

/**
 * 获取客户列表
 * @description 获取客户列表，支持分页、搜索等功能
 * @param params CustomerListRequest
 * @returns CustomerListResponse
 */
async function getCustomerList(
  params?: CustomerListRequest
): Promise<CustomerListResponse> {
  try {
    // 1. 获取符合条件的会话列表
    const sessionList = await sessionsAPI.getSessionList(params);

    if (sessionList.total === 0) {
      return {
        data: [],
        total: 0,
      };
    }

    // 2. 优化：一次性获取客户扩展信息和总数
    const sessionIds = sessionList.sessions.map((item) => item.id);

    const customerExtendList = await http.get<CustomerExtendInfo[]>(
      '/api/customer',
      {
        sessionIds: sessionIds.join(','),
      }
    );

    // 3. 合并数据
    const customerList: CustomerItem[] = sessionList.sessions.map((session) => {
      const extend = customerExtendList.find(
        (extend) => extend.sessionId === session.id
      );

      return {
        session,
        extend,
      };
    });

    // 4. 返回结果，总数优化处理
    return {
      data: customerList,
      total: sessionList.total,
    };
  } catch (error) {
    console.error('getCustomerList error:', error);
    throw error;
  }
}

/**
 * 获取客户详情
 * @description 通过 sessionId 获取客户详情
 * @param sessionId string
 * @returns CustomerItem
 */
async function getCustomerDetail(sessionId: string): Promise<CustomerItem> {
  try {
    // 1. 从sessions API获取基础会话信息
    const session = await sessionsAPI.getSessionDetail(sessionId);

    // 2. 获取客户扩展信息
    const extend = await http.get<CustomerExtendInfo>('/api/customer', {
      sessionId,
    });

    return {
      session,
      extend,
    };
  } catch (error) {
    console.error('getCustomerDetail error:', error);
    throw error;
  }
}

/**
 * 创建客户
 * @description 创建新客户，包括创建 Session 和扩展信息
 * @param data CustomerCreateRequest
 * @returns CustomerItem
 */
async function createCustomer(
  data: CustomerCreateRequest
): Promise<CustomerItem> {
  try {
    // 1. 在外部系统创建 Session
    const sessionData: SessionCreateRequest = {
      title: data.title,
      description: data.description,
      avatar: data.avatar,
      agentId: data.agentId,
    };

    const session = await sessionsAPI.createSession(sessionData);

    // 2. 创建客户扩展信息
    const extendData: CustomerExtendCreateRequest = {
      sessionId: session.id,
      gender: data.gender,
      age: data.age,
      position: data.position,
      phone: data.phone,
      email: data.email,
      wechat: data.wechat,
      company: data.company,
      industry: data.industry,
      scale: data.scale,
      province: data.province,
      city: data.city,
      district: data.district,
      address: data.address,
      notes: data.notes,
    };

    const extend = await http.post<CustomerExtendInfo>(
      '/api/customer',
      extendData
    );

    return {
      session,
      extend,
    };
  } catch (error) {
    console.error('createCustomer error:', error);
    throw error;
  }
}

/**
 * 更新客户
 * @description 更新客户信息，包括更新 Session 和扩展信息
 * @param sessionId string
 * @param data CustomerUpdateRequest
 * @returns CustomerItem
 */
async function updateCustomer(
  sessionId: string,
  data: CustomerUpdateRequest
): Promise<CustomerItem> {
  try {
    // 1. 更新外部系统的 Session 信息
    const sessionUpdateData: SessionUpdateRequest = {
      title: data.title,
      description: data.description,
      avatar: data.avatar,
      agentId: data.agentId,
    };

    const session = await sessionsAPI.updateSession(
      sessionId,
      sessionUpdateData
    );

    // 2. 更新客户扩展信息
    const extendUpdateData: CustomerExtendUpdateRequest = {
      gender: data.gender,
      age: data.age,
      position: data.position,
      phone: data.phone,
      email: data.email,
      wechat: data.wechat,
      company: data.company,
      industry: data.industry,
      scale: data.scale,
      province: data.province,
      city: data.city,
      district: data.district,
      address: data.address,
      notes: data.notes,
    };

    const extend = await http.put<CustomerExtendInfo>(
      `/api/customer?sessionId=${sessionId}`,
      extendUpdateData
    );

    return {
      session,
      extend,
    };
  } catch (error) {
    console.error('updateCustomer error:', error);
    throw error;
  }
}

/**
 * 删除客户
 * @description 删除客户，包括删除 Session 和扩展信息
 * @param sessionId string
 * @returns void
 */
async function deleteCustomer(sessionId: string): Promise<void> {
  try {
    // 1. 删除外部系统的 Session
    await sessionsAPI.deleteSession(sessionId);

    // 2. 删除客户扩展信息
    await http.delete<void>(`/api/customer?sessionId=${sessionId}`);
  } catch (error) {
    console.error('deleteCustomer error:', error);
    throw error;
  }
}

// 客户管理 API
const customerAPI = {
  getCustomerList,
  getCustomerDetail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default customerAPI;

import { http } from '../request';
import sessionsAPI, { SessionItem } from '@/services/sessions';
import { CustomerExtend } from '@/types/customer';

// 客户完整信息类型（包括 Session 和扩展信息）
export interface CustomerItem {
  // Session 基础信息
  session: SessionItem;
  // 客户扩展信息
  extend?: CustomerExtend;
}

export interface CustomerListRequest {
  page?: number;
  pageSize?: number;
  keyword?: string;
  agentId?: string;
}

export interface CustomerListResponse {
  data: CustomerItem[];
  total: number;
}

// 客户创建请求类型（包括 Session 和扩展信息）
export type CustomerCreateRequest = {
  extend: Omit<CustomerExtend, 'id' | 'sessionId' | 'createdAt' | 'updatedAt' | 'accessedAt'>;
  session: Omit<SessionItem, 'id' | 'sessionId'>;
};

// 客户更新请求类型（包括 Session 和扩展信息）
export type CustomerUpdateRequest = {
  extend: Partial<Omit<CustomerExtend, 'id'>>;
  session: Partial<Omit<SessionItem, 'id' | 'sessionId'>>;
};

// 客户扩展信息更新请求类型
export type CustomerExtendUpdateRequest = Partial<Omit<CustomerExtend, 'sessionId'>>

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
    const sessionList = await sessionsAPI.getSessionList({...params, targetUserId:'ALL'});

    if (sessionList.total === 0) {
      return {
        data: [],
        total: 0,
      };
    }

    // 2. 优化：一次性获取客户扩展信息和总数
    const sessionIds = sessionList.sessions.map((item) => item.id);

    const customerExtendList = await http.get<CustomerExtend[]>(
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
    const extend = await http.get<CustomerExtend>('/api/customer', {
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
 * 获取客户拓展配置
 * @description 通过 sessionId 获取客户拓展配置
 * @param sessionId string
 * @returns CustomerExtend
 */
async function getCustomerExtend(sessionId: string): Promise<CustomerExtend> {
  try {
    return await http.get<CustomerExtend>(
      `/api/customer?sessionId=${sessionId}`
    );
  } catch (error) {
    console.error('getCustomerExtend error:', error);
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
    const { session, extend } = data;

    // 1. 在外部系统创建 Session
    const createdSession = await sessionsAPI.createSession(session);

    // 2. 创建客户扩展信息
    const createdExtend = await http.post<CustomerExtend>('/api/customer', {
      sessionId: createdSession.id,
      ...extend,
    });

    return {
      session: createdSession,
      extend: createdExtend,
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
  data: CustomerCreateRequest
): Promise<CustomerItem> {
  try {
    const { session, extend } = data;

    // 1. 更新外部系统的 Session 信息
    const updatedSession = await sessionsAPI.updateSession(sessionId, session);

    // 2. 更新客户扩展信息
    const updatedExtend = await http.put<CustomerExtend>(
      `/api/customer?sessionId=${sessionId}`,
      extend
    );

    return {
      session: updatedSession,
      extend: updatedExtend,
    };
  } catch (error) {
    console.error('updateCustomer error:', error);
    throw error;
  }
}

/**
 * 更新客户扩展信息
 * @param sessionId string
 * @param data AgentChatConfig
 * @returns void
 */
async function updateCustomerExtend(
  sessionId: string,
  data: Partial<CustomerExtend>
): Promise<CustomerExtend> {
  try {
    return await http.put<CustomerExtend>(
      `/api/customer?sessionId=${sessionId}`,
      data
    );
  } catch (error) {
    console.error('updateCustomerExtend error:', error);
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
  getCustomerExtend,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateCustomerExtend,
};

export default customerAPI;

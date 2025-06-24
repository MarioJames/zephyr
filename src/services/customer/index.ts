import {
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from '../../app/api/customer/route';
import qs from 'query-string';

export interface GetCustomerListRequest {
  page?: number;
  pageSize?: number;
  search?: string;
}

/**
 * 获取客户详情
 * @param sessionId 会话ID
 * @returns 客户详情
 */
async function getCustomerDetail(sessionId: string) {
  return fetch(`/api/customer?sessionId=${sessionId}`, {
    method: 'GET',
  });
}

/**
 * 获取客户列表
 * @param params 请求参数
 * @returns 客户列表
 */
async function getCustomerList(params: GetCustomerListRequest) {
  return fetch(`/api/customer?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

/**
 * 创建客户
 * @param params 请求参数
 * @returns 创建结果
 */
async function createCustomer(params: CustomerCreateRequest) {
  return fetch(`/api/customer`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 更新客户
 * @param params 请求参数
 * @returns 更新结果
 */
async function updateCustomer(params: CustomerUpdateRequest) {
  return fetch(`/api/customer`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export default {
  getCustomerDetail,
  getCustomerList,
  createCustomer,
  updateCustomer,
};

import { http } from "../request";
import { SessionItem } from "../sessions";

// 客户会话相关类型定义
export interface CustomerSessionItem {
  id: number;
  sessionId: string;
  customerId: number;
  // 基本信息
  gender?: string;
  age?: number;
  position?: string;
  customerType?: 'A' | 'B' | 'C';
  // 联系方式
  phone?: string;
  email?: string;
  wechat?: string;
  // 公司信息
  company?: string;
  industry?: string;
  scale?: string;
  // 地址信息
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  // 备注
  notes?: string;
  // 系统字段
  createdAt: string;
  updatedAt: string;
  accessedAt: string;
}

// 完整的客户详情，包含 session 和扩展信息
export interface CustomerDetailItem {
  // Session 基础信息
  session?: SessionItem;
  
  // 客户扩展信息
  customerSession?: CustomerSessionItem;
}

export interface CustomerListRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  customerType?: 'A' | 'B' | 'C';
  sortBy?: 'createdAt' | 'updatedAt' | 'phone' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerListResponse {
  data: CustomerDetailItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CustomerCreateRequest {
  sessionId: string;
  customerId?: number;
  // 基本信息
  gender?: string;
  age?: number;
  position?: string;
  customerType?: 'A' | 'B' | 'C';
  // 联系方式
  phone?: string;
  email?: string;
  wechat?: string;
  // 公司信息
  company?: string;
  industry?: string;
  scale?: string;
  // 地址信息
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  // 备注
  notes?: string;
}

export interface CustomerUpdateRequest extends Partial<CustomerCreateRequest> {
  id?: number;
}

export interface CustomerSearchRequest {
  phone?: string;
  email?: string;
  company?: string;
  industry?: string;
  province?: string;
  city?: string;
}

export interface CustomerStatsResponse {
  total: number;
  typeA: number;
  typeB: number;
  typeC: number;
}

export interface BatchUpdateTypeRequest {
  ids: number[];
  customerType: 'A' | 'B' | 'C';
}

/**
 * 根据 sessionId 获取完整的客户详情
 * @description 获取包含 session 基础信息和客户扩展信息的完整详情
 * @param sessionId string
 * @returns CustomerDetailItem
 */
function getCustomerDetailBySessionId(sessionId: string) {
  return http.get<CustomerDetailItem>(`/api/v1/customers/detail/${sessionId}`);
}

/**
 * 根据客户ID获取客户详情
 * @description 根据客户会话记录ID获取详情
 * @param id number
 * @returns CustomerDetailItem
 */
function getCustomerDetailById(id: number) {
  return http.get<CustomerDetailItem>(`/api/v1/customers/${id}`);
}

/**
 * 获取客户列表
 * @description 获取客户列表，支持分页、搜索和过滤
 * @param params CustomerListRequest
 * @returns CustomerListResponse
 */
function getCustomerList(params?: CustomerListRequest) {
  return http.get<CustomerListResponse>('/api/v1/customers', params);
}

/**
 * 创建客户信息
 * @description 创建新的客户会话关联记录
 * @param data CustomerCreateRequest
 * @returns { id: number }
 */
function createCustomer(data: CustomerCreateRequest) {
  return http.post<{ id: number }>('/api/v1/customers', data);
}

/**
 * 更新客户信息
 * @description 根据ID更新客户信息
 * @param id number
 * @param data CustomerUpdateRequest
 * @returns CustomerDetailItem
 */
function updateCustomer(id: number, data: CustomerUpdateRequest) {
  return http.put<CustomerDetailItem>(`/api/v1/customers/${id}`, data);
}

/**
 * 根据 sessionId 更新客户信息
 * @description 根据会话ID更新客户信息
 * @param sessionId string
 * @param data CustomerUpdateRequest
 * @returns CustomerDetailItem
 */
function updateCustomerBySessionId(sessionId: string, data: CustomerUpdateRequest) {
  return http.put<CustomerDetailItem>(`/api/v1/customers/session/${sessionId}`, data);
}

/**
 * 删除客户信息
 * @description 根据ID删除客户记录
 * @param id number
 * @returns void
 */
function deleteCustomer(id: number) {
  return http.delete<void>(`/api/v1/customers/${id}`);
}

/**
 * 根据 sessionId 删除客户信息
 * @description 根据会话ID删除客户记录
 * @param sessionId string
 * @returns void
 */
function deleteCustomerBySessionId(sessionId: string) {
  return http.delete<void>(`/api/v1/customers/session/${sessionId}`);
}

/**
 * 根据手机号查找客户
 * @description 根据手机号精确查找客户
 * @param phone string
 * @returns CustomerDetailItem | null
 */
function findCustomerByPhone(phone: string) {
  return http.get<CustomerDetailItem | null>(`/api/v1/customers/phone/${phone}`);
}

/**
 * 根据邮箱查找客户
 * @description 根据邮箱精确查找客户
 * @param email string
 * @returns CustomerDetailItem | null
 */
function findCustomerByEmail(email: string) {
  return http.get<CustomerDetailItem | null>(`/api/v1/customers/email/${email}`);
}

/**
 * 搜索客户
 * @description 根据多个条件搜索客户
 * @param params CustomerSearchRequest
 * @returns CustomerDetailItem[]
 */
function searchCustomers(params: CustomerSearchRequest) {
  return http.get<CustomerDetailItem[]>('/api/v1/customers/search', params);
}

/**
 * 获取客户统计信息
 * @description 获取客户按类型分布的统计信息
 * @returns CustomerStatsResponse
 */
function getCustomerStats() {
  return http.get<CustomerStatsResponse>('/api/v1/customers/stats');
}

/**
 * 获取最近的客户列表
 * @description 获取最近更新的客户列表
 * @param limit number
 * @returns CustomerDetailItem[]
 */
function getRecentCustomers(limit: number = 10) {
  return http.get<CustomerDetailItem[]>('/api/v1/customers/recent', { limit });
}

/**
 * 根据公司名称搜索客户
 * @description 根据公司名称模糊搜索客户
 * @param company string
 * @returns CustomerDetailItem[]
 */
function searchCustomersByCompany(company: string) {
  return http.get<CustomerDetailItem[]>('/api/v1/customers/search/company', { company });
}

/**
 * 根据行业搜索客户
 * @description 根据行业精确搜索客户
 * @param industry string
 * @returns CustomerDetailItem[]
 */
function searchCustomersByIndustry(industry: string) {
  return http.get<CustomerDetailItem[]>('/api/v1/customers/search/industry', { industry });
}

/**
 * 根据地区搜索客户
 * @description 根据省份和城市搜索客户
 * @param province string
 * @param city string
 * @returns CustomerDetailItem[]
 */
function searchCustomersByRegion(province?: string, city?: string) {
  return http.get<CustomerDetailItem[]>('/api/v1/customers/search/region', { province, city });
}

/**
 * 批量更新客户类型
 * @description 批量更新多个客户的类型
 * @param data BatchUpdateTypeRequest
 * @returns void
 */
function batchUpdateCustomerType(data: BatchUpdateTypeRequest) {
  return http.post<void>('/api/v1/customers/batch/update-type', data);
}

export default {
  getCustomerDetailBySessionId,
  getCustomerDetailById,
  getCustomerList,
  createCustomer,
  updateCustomer,
  updateCustomerBySessionId,
  deleteCustomer,
  deleteCustomerBySessionId,
  findCustomerByPhone,
  findCustomerByEmail,
  searchCustomers,
  getCustomerStats,
  getRecentCustomers,
  searchCustomersByCompany,
  searchCustomersByIndustry,
  searchCustomersByRegion,
  batchUpdateCustomerType,
};
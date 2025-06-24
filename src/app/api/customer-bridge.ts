// 客户 API 桥接 - 重定向到 services
import { customersAPI } from '@/services';
import type {
  CustomerDetailItem,
  CustomerListRequest,
  CustomerListResponse,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  CustomerStatsResponse,
} from '@/services';

// 重新导出类型，保持兼容性
export type CustomerDetail = CustomerDetailItem;
export type CustomerListParams = CustomerListRequest;
export type CreateCustomerParams = CustomerCreateRequest;
export type UpdateCustomerParams = CustomerUpdateRequest;
export type CustomerStats = CustomerStatsResponse;

// 客户 API 接口
export const customerApi = {
  // 重定向所有方法到新的 services API
  ...customersAPI,
  
  // 保持旧的方法名兼容性
  getCustomerDetailBySessionId: customersAPI.getCustomerDetailBySessionId,
  getCustomerDetailById: customersAPI.getCustomerDetailById,
  getCustomerList: customersAPI.getCustomerList,
  createCustomer: customersAPI.createCustomer,
  updateCustomer: customersAPI.updateCustomer,
  updateCustomerBySessionId: customersAPI.updateCustomerBySessionId,
  deleteCustomer: customersAPI.deleteCustomer,
  deleteCustomerBySessionId: customersAPI.deleteCustomerBySessionId,
  findCustomerByPhone: customersAPI.findCustomerByPhone,
  findCustomerByEmail: customersAPI.findCustomerByEmail,
  getCustomerStats: customersAPI.getCustomerStats,
  getRecentCustomers: customersAPI.getRecentCustomers,
  searchCustomersByCompany: customersAPI.searchCustomersByCompany,
  searchCustomersByIndustry: customersAPI.searchCustomersByIndustry,
  searchCustomersByRegion: customersAPI.searchCustomersByRegion,
  batchUpdateCustomerType: customersAPI.batchUpdateCustomerType,
};

export default customerApi;
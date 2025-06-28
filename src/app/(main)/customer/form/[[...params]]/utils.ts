import {
  CustomerItem,
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from '@/services/customer';
import { CustomerFormData } from './CustomerForm';
import { AgentItem } from '@/services/agents';

/**
 * 将CustomerItem转换为表单数据
 */
export function customerItemToFormData(
  customer: CustomerItem
): CustomerFormData {
  const { session, extend } = customer;

  // 构建地区数组
  const region: string[] = [];
  if (extend?.province) region.push(extend.province);
  if (extend?.city) region.push(extend.city);
  if (extend?.district) region.push(extend.district);

  return {
    ...session,
    ...extend,
    region: region.length > 0 ? region : undefined,
  };
}

/**
 * 将表单数据转换为创建请求
 */
export function formDataToCreateRequest(
  formData: CustomerFormData
): CustomerCreateRequest {
  return {
    // Session字段
    title: formData.title || '',
    description: formData.description,
    avatar: formData.avatar,
    agentId: undefined, // 可以根据type映射到具体的agentId

    // 扩展字段
    gender: formData.gender || undefined,
    age: formData.age || undefined,
    position: formData.position || undefined,
    phone: formData.phone || undefined,
    email: formData.email || undefined,
    wechat: formData.wechat || undefined,
    company: formData.company || undefined,
    industry: formData.industry || undefined,
    scale: formData.scale || undefined,
    province: formData.region?.[0],
    city: formData.region?.[1],
    district: formData.region?.[2],
    address: formData.address || undefined,
    notes: formData.notes || undefined,
  };
}

/**
 * 将表单数据转换为更新请求
 */
export function formDataToUpdateRequest(
  formData: CustomerFormData
): CustomerUpdateRequest {
  // 更新请求和创建请求结构相同，都是Partial类型
  return formDataToCreateRequest(formData);
}

/**
 * 根据客户类型获取agentId映射
 * 现在客户类型就是agentId，所以直接返回
 */
export function getAgentIdByType(
  type: string,
  agents: AgentItem[]
): string | undefined {
  // 验证 agentId 是否存在于 agents 列表中
  const agent = agents.find((a) => a.id === type);
  return agent ? agent.id : agents.length > 0 ? agents[0].id : undefined;
}

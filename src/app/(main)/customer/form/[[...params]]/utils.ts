import { CustomerCreateRequest, CustomerItem } from '@/services/customer';
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

  return {
    ...session,
    ...extend,
    agentId: session.agent.id,
    description: session.description || '',
    sessionId: session.id,
    extendId: extend?.id,
    region: region.length > 0 ? region : undefined,
  };
}

/**
 * 将表单数据转换为创建请求
 */
export function formDataToCreateRequest(
  formData: CustomerFormData
): CustomerCreateRequest {
  // 提取extend字段，剩下的是session字段
  const {
    sessionId,
    age,
    gender,
    position,
    phone,
    email,
    wechat,
    company,
    industry,
    scale,
    address,
    ...session
  } = formData;

  return {
    extend: {
      gender,
      age,
      position,
      phone,
      email,
      wechat,
      company,
      industry,
      scale,
      address,
    },
    session,
  };
}

/**
 * 将表单数据转换为更新请求
 */
export function formDataToUpdateRequest(
  formData: CustomerFormData
): CustomerCreateRequest {
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

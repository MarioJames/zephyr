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
    // Session 字段
    slug: session.slug,
    title: session.title,
    description: session.description,
    avatar: session.avatar,
    backgroundColor: session.backgroundColor,
    type: session.type,
    userId: session.userId,
    groupId: session.groupId,
    clientId: session.clientId,
    pinned: session.pinned,
    messageCount: session.messageCount,
    agentsToSessions: session.agentsToSessions,

    // Extend 字段
    gender: extend?.gender ?? null,
    age: extend?.age ?? null,
    work: extend?.work ?? null,
    isSingle:
      typeof extend?.isSingle === 'boolean'
        ? JSON.stringify(extend.isSingle)
        : null,
    familySituation: extend?.familySituation ?? null,
    hobby: extend?.hobby ?? null,
    chatConfig: extend?.chatConfig,

    // 表单专用字段
    agentId: session?.agent?.id,
    sessionId: session.id,
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
    age,
    gender,
    work,
    isSingle,
    familySituation,
    hobby,
    chatConfig,
    ...session
  } = formData;

  return {
    extend: {
      gender,
      age,
      work,
      isSingle: isSingle ? JSON.parse(isSingle) : null,
      familySituation,
      hobby,
      chatConfig,
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

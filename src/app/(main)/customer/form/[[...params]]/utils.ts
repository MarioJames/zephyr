import { CustomerItem, CustomerCreateRequest, CustomerUpdateRequest } from '@/services/customer';
import { CustomerFormData } from '@/types/customer-form';

/**
 * 将CustomerItem转换为表单数据
 */
export function customerItemToFormData(customer: CustomerItem): CustomerFormData {
  const { session, extend } = customer;

  // 构建地区数组
  const region: string[] = [];
  if (extend?.province) region.push(extend.province);
  if (extend?.city) region.push(extend.city);
  if (extend?.district) region.push(extend.district);

  return {
    name: session.title || '',
    gender: extend?.gender || undefined,
    age: extend?.age?.toString() || undefined,
    position: extend?.position || undefined,
    phone: extend?.phone || '',
    email: extend?.email || undefined,
    wechat: extend?.wechat || undefined,
    company: extend?.company || undefined,
    industry: extend?.industry || undefined,
    scale: extend?.scale || undefined,
    region: region.length > 0 ? region : undefined,
    address: extend?.address || undefined,
    notes: extend?.notes || undefined,
    avatar: session.avatar || undefined,
  };
}

/**
 * 将表单数据转换为创建请求
 */
export function formDataToCreateRequest(
  formData: CustomerFormData & { type: string; avatar?: string }
): CustomerCreateRequest {
  return {
    // Session字段
    title: formData.name,
    description: `${formData.type}类客户`,
    avatar: formData.avatar,
    agentId: undefined, // 可以根据type映射到具体的agentId

    // 扩展字段
    gender: formData.gender,
    age: formData.age ? parseInt(formData.age) : undefined,
    position: formData.position,
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
}

/**
 * 将表单数据转换为更新请求
 */
export function formDataToUpdateRequest(
  formData: CustomerFormData & { type: string; avatar?: string }
): CustomerUpdateRequest {
  // 更新请求和创建请求结构相同，都是Partial类型
  return formDataToCreateRequest(formData);
}

/**
 * 根据客户类型获取agentId映射
 */
export function getAgentIdByType(type: string, agents: any[]): string | undefined {
  // 这里可以根据业务需求实现类型到agentId的映射
  // 目前返回第一个agent的ID作为默认值
  return agents.length > 0 ? agents[0].id : undefined;
}

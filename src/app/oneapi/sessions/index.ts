import { http } from "../request";
import { CreateAgentRequest } from "../agents";

// 会话相关类型定义
export interface SessionItem {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  type?: "agent" | "group";
  userId: string;
  groupId?: string;
  clientId?: string;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionListRequest {
  userId?: string; // 会话所属的员工 ID，没有则查询全部
}

export interface SessionCreateRequest {
  config: CreateAgentRequest; // 将 Agent 的配置传进来
  session?: {
    title: string; // 对话标题 - 客户名称
    model: string; // 模型名称，与 agent.model 一致
    type: "agent";
  };
}

const API = {
  /**
   * 获取所有会话列表
   * @description 用户进入系统时，获取所有的会话（客户）列表，并在对话页面左侧展示
   * @param params SessionListRequest
   * @returns SessionItem[]
   */
  getSessionList: (params?: SessionListRequest) => http.get<SessionItem[]>("/api/v1/sessions/list", params),

  /**
   * 创建会话(客户)
   * @description 用户进入系统时，获取所有的 Agent 列表，管理系统中 Agent 将作为 「客户模板」的概念使用
   * @param data SessionCreateRequest
   * @returns SessionItem
   */
  createSession: (data: SessionCreateRequest) => http.post<SessionItem>("/api/v1/sessions/create", data),

  /**
   * 编辑会话(客户)
   * @description 管理员的客户管理列表页面对客户信息进行编辑
   * @param data SessionCreateRequest
   * @returns SessionItem
   */
  updateSession: (data: SessionCreateRequest) => http.post<SessionItem>("/api/v1/sessions/update", data),
};

export default API; 
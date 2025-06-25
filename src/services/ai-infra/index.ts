import { http } from '../request';

/**
 * 获取模型详情请求参数 Schema
 */
export interface ModelDetailRequest {
  model: string;
  provider: string;
}

/**
 * 模型详情响应数据结构
 */
export interface ModelDetailsResponse {
  /** 模型上下文窗口token数量 */
  contextWindowTokens?: number;
  /** 是否有上下文窗口token */
  hasContextWindowToken: boolean;
  /** 模型ID */
  model: string;
  /** 提供商ID */
  provider: string;
  /** 是否支持文件 */
  supportFiles: boolean;
  /** 是否支持推理 */
  supportReasoning: boolean;
  /** 是否支持工具使用 */
  supportToolUse: boolean;
  /** 是否支持视觉 */
  supportVision: boolean;
}

function getModelDetails(data: ModelDetailRequest) {
  return http.get<ModelDetailsResponse>(`/api/v1/ai-infra/model-details`, {
    params: data,
  });
}

export default {
  getModelDetails,
};

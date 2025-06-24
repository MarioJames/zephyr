// 保留实际使用的类型定义

export type ModelSearchImplementType = 'tool' | 'params' | 'internal';

export interface ModelAbilities {
  /**
   * whether model supports file upload
   */
  files?: boolean;
  /**
   * whether model supports function call
   */
  functionCall?: boolean;
  /**
   * whether model supports image output
   */
  imageOutput?: boolean;
  /**
   * whether model supports reasoning
   */
  reasoning?: boolean;
  /**
   * whether model supports search web
   */
  search?: boolean;
  /**
   *  whether model supports vision
   */
  vision?: boolean;
}

export interface ChatModelPricing {
  audioInput?: number;
  audioOutput?: number;
  cachedAudioInput?: number;
  cachedInput?: number;
  /**
   * the input pricing, e.g. $1 / 1M tokens
   */
  input?: number;
  /**
   * the output pricing, e.g. $2 / 1M tokens
   */
  output?: number;
  writeCacheInput?: number;
}

export interface AiModelForSelect {
  abilities: ModelAbilities;
  contextWindowTokens?: number;
  displayName?: string;
  id: string;
}

export interface EnabledAiModel {
  abilities: ModelAbilities;
  contextWindowTokens?: number;
  displayName?: string;
  enabled?: boolean;
  id: string;
  providerId: string;
  sort?: number;
}

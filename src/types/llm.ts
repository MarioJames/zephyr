import { ReactNode } from 'react';

import { ChatModelPricing } from '@/types/aiModel';
import { AiProviderSettings } from '@/types/aiProvider';

export type ModelPriceCurrency = 'CNY' | 'USD';

export interface ChatModelCard {
  /**
   * the context window (or input + output tokens limit)
   */
  contextWindowTokens?: number;
  /**
   * only used in azure
   */
  deploymentName?: string;
  description?: string;
  /**
   * the name show for end user
   */
  displayName?: string;
  /**
   * whether model is enabled by default
   */
  enabled?: boolean;
  /**
   * whether model supports file upload
   */
  files?: boolean;
  /**
   * whether model supports function call
   */
  functionCall?: boolean;
  id: string;
  /**
   * whether model is custom
   */
  isCustom?: boolean;
  /**
   * whether model is legacy (deprecated but not removed yet)
   */
  legacy?: boolean;
  maxOutput?: number;
  pricing?: ChatModelPricing;

  /**
   *  whether model supports reasoning
   */
  reasoning?: boolean;

  /**
   * the date when model is released
   */
  releasedAt?: string;

  /**
   *  whether model supports vision
   */
  vision?: boolean;
}

export interface SmoothingParams {
  text?: boolean;
  toolsCalling?: boolean;
}

export type LLMRoleType = 'user' | 'system' | 'assistant' | 'tool';

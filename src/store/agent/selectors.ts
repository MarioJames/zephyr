import { agentCoreSelectors } from './slices/core/selectors';
import { agentConfigSelectors } from './slices/config/selectors';

// 智能体选择器导出
export const agentSelectors = {
  ...agentCoreSelectors,
  ...agentConfigSelectors,
};

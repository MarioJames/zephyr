import type { LobeAgentConfig } from '@/types/agent';

export const mockAgentConfig: LobeAgentConfig = {
  id: 'agent-001',
  model: 'gpt-4o-mini',
  systemRole: '助手',
  params: {
    temperature: 0.7,
    max_tokens: 2048,
  },
  chatConfig: {
    historyCount: 10,
    compressThreshold: 1000,
    maxTokens: 2048,
    systemPrompt: '你是一个智能助手',
    userPrefix: '用户',
    assistantPrefix: '助手',
  },
  files: [],
  knowledgeBases: [],
};

export default {
  '/agent/createAgentKnowledgeBase': () => ({ success: true }),
  '/agent/deleteAgentKnowledgeBase': () => ({ success: true }),
  '/agent/toggleKnowledgeBase': () => ({ success: true }),
  '/agent/createAgentFiles': () => ({ success: true }),
  '/agent/deleteAgentFile': () => ({ success: true }),
  '/agent/toggleFile': () => ({ success: true }),
  '/agent/getFilesAndKnowledgeBases': () => mockAgentConfig,
}; 
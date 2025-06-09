import type { LobeAgentConfig } from '@/types/agent';
import { mockAgentConfig } from './agent';

export default {
  '/session/getSessionConfig': () => mockAgentConfig,
  '/session/updateSessionConfig': () => ({ success: true }),
}; 
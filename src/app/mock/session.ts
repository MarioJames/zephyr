import type { LobeAgentConfig } from '@/types/agent';
import { mockAgentConfig } from './agent';

export default {
  '/session/getSessionConfig': () => ({
    config: {
      sessionTimeout: 3600,
      allowGuest: true,
      defaultGroup: 'default',
    },
  }),
  '/session/updateSessionConfig': () => ({ success: true }),
}; 
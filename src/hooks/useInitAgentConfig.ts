import { useAgentStore } from '@/store/agent';
import { useChatStore } from '@/store/chat';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

export const useInitAgentConfig = () => {
  const isLogin = useUserStore(authSelectors.isLogin);
  const sessionId = useChatStore((s) => s.activeId);
  const agentConfig = useAgentStore((s) => s.agentConfig);
  const isAgentConfigLoading = useAgentStore((s) => s.isAgentConfigLoading);

  return { agentConfig, isLoading: isAgentConfigLoading && isLogin, sessionId };
};

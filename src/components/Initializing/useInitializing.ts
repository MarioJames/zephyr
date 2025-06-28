import { useOIDC } from '@/hooks/useOIDC';
import { useAgentStore } from '@/store/agent';

export const useInitializing = () => {
  const { isAuthenticated, isLoading } = useOIDC();

  const { agentsInit } = useAgentStore();

  return {
    initializing: !isAuthenticated || !agentsInit,
    authLoading: isLoading,
    agentsLoading: !agentsInit,
  };
};

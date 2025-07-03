import { useOIDC } from '@/hooks/useOIDC';
import { useAgentStore } from '@/store/agent';
import { useModelStore } from '@/store/model';

export const useInitializing = () => {
  const { isAuthenticated, isLoading } = useOIDC();

  const { agentsInit } = useAgentStore();
  const { modelsInit } = useModelStore();

  return {
    initializing: !isAuthenticated || !agentsInit || !modelsInit,
    authLoading: isLoading,
    agentsLoading: !agentsInit,
    modelsLoading: !modelsInit,
  };
};

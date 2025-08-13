import { useAgentStore } from '@/store/agent';
import { useGlobalStore } from '@/store/global';
import { useModelStore } from '@/store/model';

export const useInitializing = () => {
  const { agentsInit } = useAgentStore();
  const { modelsInit } = useModelStore();
  const { userInit, userVirtualKeyInit } = useGlobalStore();

  return {
    initializing: !agentsInit || !modelsInit || !userInit || !userVirtualKeyInit,
    agentsLoading: !agentsInit,
    modelsLoading: !modelsInit,
    userLoading: !userInit,
    userCredentialsLoading: !userVirtualKeyInit,
  };
};

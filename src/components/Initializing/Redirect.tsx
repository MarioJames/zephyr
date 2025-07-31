'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { AppLoadingStage } from './stage';
import { useAgentStore } from '@/store/agent';
import { useRoleStore } from '@/store/role';
import { useModelStore } from '@/store/model';
import { useGlobalStore } from '@/store/global';

interface RedirectProps {
  setLoadingStage: (value: AppLoadingStage) => void;
}

const Redirect = memo<RedirectProps>(({ setLoadingStage }) => {
  const router = useRouter();
  const { userInit, loadCurrentUser } = useGlobalStore();
  const { agentsInit, fetchAgents } = useAgentStore();
  const { rolesInit, initRoles } = useRoleStore();
  const { modelsInit, initModels } = useModelStore();

  const navToChat = () => {
    setLoadingStage(AppLoadingStage.GoToChat);

    if (location.pathname === '/') {
      router.replace('/chat');
    }
  };

  useEffect(() => {
    // if user state not init, wait for loading
    if (!userInit) {
      setLoadingStage(AppLoadingStage.Initializing);
      loadCurrentUser();
      return;
    }

    if (!rolesInit) {
      setLoadingStage(AppLoadingStage.InitializingRoles);
      initRoles();
      return;
    }

    if (!agentsInit) {
      setLoadingStage(AppLoadingStage.InitializingAgents);
      fetchAgents();
      return;
    }

    if (!modelsInit) {
      setLoadingStage(AppLoadingStage.InitializingModels);
      initModels();
      return;
    }

    // finally go to chat
    navToChat();
  }, [userInit, agentsInit, rolesInit, modelsInit]);

  return null;
});

export default Redirect;

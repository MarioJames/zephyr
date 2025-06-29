'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { useOIDCStore } from '@/store/oidc';

import { AppLoadingStage } from './stage';
import { useAgentStore } from '@/store/agent';
import { useRoleStore } from '@/store/role';

interface RedirectProps {
  setLoadingStage: (value: AppLoadingStage) => void;
}

const Redirect = memo<RedirectProps>(({ setLoadingStage }) => {
  const router = useRouter();
  const [isAuthenticated] = useOIDCStore((s) => [s.isAuthenticated]);
  const { agentsInit, fetchAgents } = useAgentStore();
  const { rolesInit, initRoles } = useRoleStore();

  const navToChat = () => {
    setLoadingStage(AppLoadingStage.GoToChat);
    router.replace('/chat');
  };

  useEffect(() => {
    // if user state not init, wait for loading
    if (!isAuthenticated) {
      setLoadingStage(AppLoadingStage.Initializing);
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

    // finally go to chat
    navToChat();
  }, [isAuthenticated, agentsInit, rolesInit]);

  return null;
});

export default Redirect;

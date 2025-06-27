'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { useOIDCStore } from '@/store/oidc';

import { AppLoadingStage } from './stage';

interface RedirectProps {
  setLoadingStage: (value: AppLoadingStage) => void;
}

const Redirect = memo<RedirectProps>(({ setLoadingStage }) => {
  const router = useRouter();
  const [isAuthenticated] = useOIDCStore((s) => [s.isAuthenticated]);

  const navToChat = () => {
    setLoadingStage(AppLoadingStage.GoToChat);
    router.replace('/chat');
  };

  useEffect(() => {
    // if user state not init, wait for loading
    if (!isAuthenticated) {
      setLoadingStage(AppLoadingStage.InitUser);
      return;
    }

    // finally go to chat
    navToChat();
  }, [isAuthenticated]);

  return null;
});

export default Redirect;

import { useTimeout } from 'ahooks';
import { memo } from 'react';

import { useUserStore } from '@/store/user';

const RedirectLogin = memo<{ timeout: number }>(({ timeout = 2000 }) => {
  const signIn = useUserStore((s) => s.openLogin);

  useTimeout(() => {
    signIn();
  }, timeout);

  return <div style={{ cursor: 'pointer', fontSize: 12 }}>{'登录状态已失效，请重新登录'}</div>;
});

export default RedirectLogin;

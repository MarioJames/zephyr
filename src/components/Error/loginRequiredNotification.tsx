import { FluentEmoji } from '@lobehub/ui';

import { notification } from '@/components/AntdStaticMethods';

import RedirectLogin from './RedirectLogin';

export const loginRequired = {
  redirect: ({ timeout = 2000 }: { timeout?: number } = {}) => {
    notification.error({
      description: <RedirectLogin timeout={timeout} />,
      duration: timeout / 1000,
      icon: <FluentEmoji emoji={'🫡'} size={24} />,
      message: '请先登录',
      showProgress: true,
      type: 'warning',
    });
  },
};

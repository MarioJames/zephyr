import { FluentEmoji } from '@lobehub/ui';

import { notification } from '@/components/AntdStaticMethods';

import Description from './Description';

export const fetchErrorNotification = {
  error: ({ status, errorMessage }: { errorMessage: string; status: number }) => {
    notification.error({
      description: <Description message={errorMessage} status={status} />,
      icon: <FluentEmoji emoji={'🤧'} size={24} />,
      message: '请求失败',
      type: 'error',
    });
  },
};

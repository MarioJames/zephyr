import { Alert, Highlighter } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatMessageError, ChatPluginPayload } from '@/types/message';

interface ErrorResponseProps extends ChatMessageError {
  id: string;
  plugin?: ChatPluginPayload;
}

const ErrorResponse = memo<ErrorResponseProps>(({ id, type, body, message, plugin }) => {

  return (
    <Alert
      extra={
        <Flexbox>
          <Highlighter actionIconSize={'small'} language={'json'} variant={'borderless'}>
            {JSON.stringify(body || { message, type }, null, 2)}
          </Highlighter>
        </Flexbox>
      }
      message={'插件服务端请求返回出错，请检查根据下面的报错信息检查你的插件描述文件、插件配置或服务端实现'}
      showIcon
      type={'error'}
    />
  );
});
export default ErrorResponse;

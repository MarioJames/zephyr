import { Highlighter } from '@lobehub/ui';
import { Tabs } from 'antd';
import { memo } from 'react';

import PluginResult from './PluginResultJSON';
import PluginState from './PluginState';

interface DebugProps {
  payload: object;
  requestArgs?: string;
  toolCallId: string;
}

const Debug = memo<DebugProps>(({ payload, requestArgs, toolCallId }) => {
  let params;
  try {
    params = JSON.stringify(JSON.parse(requestArgs || ''), null, 2);
  } catch {
    params = '';
  }

  return (
    <Tabs
      items={[
        {
          children: <Highlighter language={'json'}>{params}</Highlighter>,
          key: 'arguments',
          label: '参数',
        },
        {
          children: <PluginResult toolCallId={toolCallId} />,
          key: 'response',
          label: '响应',
        },
        {
          children: <Highlighter language={'json'}>{JSON.stringify(payload, null, 2)}</Highlighter>,
          key: 'function_call',
          label: '函数调用',
        },
        {
          children: <PluginState toolCallId={toolCallId} />,
          key: 'pluginState',
          label: '插件状态',
        },
      ]}
      style={{ display: 'grid', maxWidth: 800, minWidth: 400 }}
    />
  );
});
export default Debug;

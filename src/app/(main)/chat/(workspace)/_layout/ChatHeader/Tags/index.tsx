import { Skeleton } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useAgentStore } from '@/store/agent';
import { agentChatConfigSelectors, agentSelectors } from '@/store/agent/selectors';
import { useOIDCStore } from '@/store/oidc';
import { oidcAuthSelectors } from '@/store/oidc/selectors';

import HistoryLimitTags from './HistoryLimitTags';

const TitleTags = memo(() => {
  const [model, isLoading] = useAgentStore((s) => [
    agentSelectors.currentAgentModel(s),
    agentSelectors.isAgentConfigLoading(s),
  ]);

  const enableHistoryCount = useAgentStore(agentChatConfigSelectors.enableHistoryCount);

  const isLogin = useOIDCStore(oidcAuthSelectors.isAuthenticated);

  return isLoading && isLogin ? (
    <Skeleton.Button active size={'small'} style={{ height: 20 }} />
  ) : (
    <Flexbox align={'center'} gap={4} horizontal>
      {enableHistoryCount && <HistoryLimitTags />}
    </Flexbox>
  );
});

export default TitleTags;

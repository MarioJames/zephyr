import { ModelTag } from '@lobehub/icons';
import { Skeleton } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ModelSwitchPanel from '@/features/ModelSwitchPanel';
import { useAgentStore } from '@/store/agent';
import { agentChatConfigSelectors, agentSelectors } from '@/store/agent/selectors';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

import HistoryLimitTags from './HistoryLimitTags';

const TitleTags = memo(() => {
  const [model, isLoading] = useAgentStore((s) => [
    agentSelectors.currentAgentModel(s),
    agentSelectors.isAgentConfigLoading(s),
  ]);

  const enableHistoryCount = useAgentStore(agentChatConfigSelectors.enableHistoryCount);

  const isLogin = useUserStore(authSelectors.isLogin);

  return isLoading && isLogin ? (
    <Skeleton.Button active size={'small'} style={{ height: 20 }} />
  ) : (
    <Flexbox align={'center'} gap={4} horizontal>
      <ModelSwitchPanel>
        <ModelTag model={model} />
      </ModelSwitchPanel>
      {enableHistoryCount && <HistoryLimitTags />}
    </Flexbox>
  );
});

export default TitleTags;

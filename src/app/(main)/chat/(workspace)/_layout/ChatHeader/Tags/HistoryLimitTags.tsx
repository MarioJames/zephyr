import { Icon, Tag, Tooltip } from '@lobehub/ui';
import { HistoryIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useAgentStore } from '@/store/agent';
import { agentChatConfigSelectors } from '@/store/agent/selectors';

const SearchTag = memo(() => {
  const historyCount = useAgentStore(agentChatConfigSelectors.historyCount);

  return (
    <Tooltip title={`助手将只记住最后${historyCount}条消息`}>
      <Flexbox height={22}>
        <Tag>
          <Icon icon={HistoryIcon} />
          <span>{historyCount}</span>
        </Tag>
      </Flexbox>
    </Tooltip>
  );
});

export default SearchTag;

import { Timer } from 'lucide-react';
import { memo } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

import Action from '../components/Action';
import Controls from './Controls';

const History = memo(() => {
  const [isLoading] = useAgentStore((s) => [agentSelectors.isLoading(s)]);

  return (
    <Action
      icon={Timer}
      loading={isLoading}
      popover={{
        content: <Controls updating={isLoading} />,
        minWidth: 240,
      }}
      showTooltip={false}
    />
  );
});

export default History;

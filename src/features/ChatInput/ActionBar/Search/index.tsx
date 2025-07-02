import { GlobeOffIcon } from '@lobehub/ui/icons';
import { useTheme } from 'antd-style';
import { Globe } from 'lucide-react';
import { memo } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

import Action from '../components/Action';
import Controls from './Controls';
import { customerSelectors, useCustomerStore } from '@/store/customer';

const Search = memo(() => {
  const [isLoading] = useAgentStore((s) => [agentSelectors.isLoading(s)]);

  const [enableSearch] = useCustomerStore((s) => [
    customerSelectors.currentCustomerChatConfigSearchMode(s) === 'auto',
  ]);

  const theme = useTheme();

  if (isLoading) return <Action disabled icon={GlobeOffIcon} />;

  return (
    <Action
      color={enableSearch ? theme.colorInfo : undefined}
      icon={enableSearch ? Globe : GlobeOffIcon}
      popover={{
        content: <Controls />,
        maxWidth: 320,
        minWidth: 320,
        placement: 'topLeft',
        styles: {
          body: {
            padding: 4,
          },
        },
      }}
      showTooltip={false}
      title={'联网搜索'}
    />
  );
});

Search.displayName = 'Search';

export default Search;

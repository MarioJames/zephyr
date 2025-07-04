import { TokenTag } from '@lobehub/ui/chat';
import { useTheme } from 'antd-style';
import { memo, useMemo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useTokenCount } from '@/hooks/useTokenCount';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { topicSelectors } from '@/store/chat/selectors';

import ActionPopover from '../components/ActionPopover';
import TokenProgress from './TokenProgress';
import { mainAIChatsWithHistoryConfig } from '@/store/chat/slices/message/selectors';
import numeral from 'numeral';
import { Tooltip } from '@lobehub/ui';
import { useModelStore } from '@/store/model';
import { modelCoreSelectors } from '@/store/model';

interface TokenTagProps {
  total: string;
}
const Token = memo<TokenTagProps>(({ total: messageString }) => {
  const theme = useTheme();

  const [input, historySummary] = useChatStore((s) => [
    s.inputMessage,
    topicSelectors.currentActiveTopic(s)?.historySummary || '',
  ]);

  const [systemRole, historyCount, enableHistoryCount] = useAgentStore((s) => [
    agentSelectors.currentAgentSystemRole(s),
    agentSelectors.historyCount(s),
    agentSelectors.enableHistoryCount(s),
  ]);

  const [maxTokens] = useModelStore((s) => [
    modelCoreSelectors.currentModelContextWindowTokens(s) || 0,
  ]);

  // Chat usage token
  const inputTokenCount = useTokenCount(input);

  const chatsString = useMemo(() => {
    const chats = mainAIChatsWithHistoryConfig(useChatStore.getState());
    return chats.map((chat) => chat.content).join('');
  }, [messageString, historyCount, enableHistoryCount]);

  const chatsToken = useTokenCount(chatsString) + inputTokenCount;

  // SystemRole token
  const systemRoleToken = useTokenCount(systemRole);
  const historySummaryToken = useTokenCount(historySummary);

  // Total token
  const totalToken = systemRoleToken + historySummaryToken + chatsToken;

  const content = (
    <Flexbox gap={12} style={{ minWidth: 200 }}>
      <Flexbox
        align={'center'}
        gap={4}
        horizontal
        justify={'space-between'}
        width={'100%'}
      >
        <div style={{ color: theme.colorTextDescription }}>Token 详情</div>
        <Tooltip
          styles={{ root: { maxWidth: 'unset', pointerEvents: 'none' } }}
          title={`最大 Token 数：${numeral(maxTokens).format('0,0')}`}
        >
          <Center
            height={20}
            paddingInline={4}
            style={{
              background: theme.colorFillTertiary,
              borderRadius: 4,
              color: theme.colorTextSecondary,
              fontFamily: theme.fontFamilyCode,
              fontSize: 11,
            }}
          >
            TOKEN
          </Center>
        </Tooltip>
      </Flexbox>
      <TokenProgress
        data={[
          {
            color: theme.magenta,
            id: 'systemRole',
            title: '系统角色',
            value: systemRoleToken,
          },
          {
            color: theme.orange,
            id: 'historySummary',
            title: '历史摘要',
            value: historySummaryToken,
          },
          {
            color: theme.gold,
            id: 'chats',
            title: '聊天内容',
            value: chatsToken,
          },
        ]}
        showIcon
      />
      <TokenProgress
        data={[
          {
            color: theme.colorSuccess,
            id: 'used',
            title: '已用 Token',
            value: totalToken,
          },
          {
            color: theme.colorFill,
            id: 'rest',
            title: '剩余 Token',
            value: maxTokens - totalToken,
          },
        ]}
        showIcon
        showTotal={'总计'}
      />
    </Flexbox>
  );

  return (
    <ActionPopover content={content}>
      <TokenTag
        maxValue={maxTokens}
        mode={'used'}
        style={{ marginLeft: 8 }}
        text={{
          overload: '超出上限',
          remained: '剩余',
          used: '已用',
        }}
        value={totalToken}
      />
    </ActionPopover>
  );
});

export default Token;

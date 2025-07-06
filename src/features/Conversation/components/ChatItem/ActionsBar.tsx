'use client';

import {
  ActionIconGroup,
  type ActionIconGroupEvent,
  type ActionIconGroupProps,
} from '@lobehub/ui';
import { App } from 'antd';
import { memo, useCallback } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { MessageRoleType } from '@/types/message';

import { renderActions } from '../../Actions';
import { useChatListActionsBar } from '../../hooks/useChatListActionsBar';

export type ActionsBarProps = ActionIconGroupProps;

const ActionsBar = memo<ActionsBarProps>((props) => {
  const { copy } = useChatListActionsBar();

  return <ActionIconGroup items={[copy]} {...props} />;
});

interface ActionsProps {
  id: string;
}

const Actions = memo<ActionsProps>(({ id }) => {
  const { message } = App.useApp();

  const item = useChatStore(chatSelectors.getMessageById(id));

  const [copyMessage, autoTranslateMessage, regenerateMessage] = useChatStore(
    (s) => [s.copyMessage, s.autoTranslateMessage, s.generateAISuggestion]
  );

  const handleActionClick = useCallback(
    async (action: ActionIconGroupEvent) => {
      if (!item) return;

      if (action.key === 'copy') {
        await copyMessage(id, item.content);
        message.success('复制成功');
        return;
      }

      if (action.key === 'regenerate') {
        const suggestion = await regenerateMessage(item.id);

        if (!suggestion) {
          message.error('AI 建议生成失败，请稍后再试');
          return;
        }

        message.success('重新生成成功');
        return;
      }

      if (action.keyPath.at(-1) === 'translate') {
        autoTranslateMessage(id);
      }
    },
    [item]
  );

  const RenderFunction =
    renderActions[(item?.role || '') as MessageRoleType] ?? ActionsBar;

  if (!item) return null;

  return (
    <>
      <RenderFunction {...item} onActionClick={handleActionClick} />
    </>
  );
});

export default Actions;

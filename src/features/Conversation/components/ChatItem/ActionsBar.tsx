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
  index: number;
}

const Actions = memo<ActionsProps>(({ id, index }) => {
  const item = useChatStore(chatSelectors.getMessageById(id));

  const [translateMessage, copyMessage] = useChatStore((s) => [
    s.translateMessage,
    s.copyMessage,
  ]);

  const { message } = App.useApp();

  const handleActionClick = useCallback(
    async (action: ActionIconGroupEvent) => {
      if (!item) return;

      if (action.key === 'copy') {
        await copyMessage(id, item.content);
        message.success('复制成功');
        return;
      }

      if (action.keyPath.at(-1) === 'translate') {
        // click the menu item with translate item, the result is:
        // key: 'en-US'
        // keyPath: ['en-US','translate']
        const lang = action.keyPath[0];
        translateMessage(id, lang);
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

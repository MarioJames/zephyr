'use client';

import { ActionIconGroup } from '@lobehub/ui';
import { memo } from 'react';

import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../types';
import { useCustomActions } from './customAction';

export const AssistantActionsBar: RenderAction = memo(({ onActionClick }) => {
  const { copy } = useChatListActionsBar();

  const { translate } = useCustomActions();

  return (
    <ActionIconGroup items={[copy, translate]} onActionClick={onActionClick} />
  );
});

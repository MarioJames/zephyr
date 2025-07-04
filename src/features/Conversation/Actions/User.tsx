'use client';

import { ActionIconGroup } from '@lobehub/ui';
import { memo } from 'react';

import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../types';
import { useCustomActions } from './customAction';

export const UserActionsBar: RenderAction = memo(({ onActionClick }) => {
  const { copy, regenerate } = useChatListActionsBar();
  const { translate } = useCustomActions();

  return (
    <ActionIconGroup
      items={[copy, regenerate, translate]}
      onActionClick={onActionClick}
    />
  );
});

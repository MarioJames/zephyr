"use client";

import { ActionIconGroup } from '@lobehub/ui';
import { ActionIconGroupItemType } from '@lobehub/ui/es/ActionIconGroup';
import { memo, useMemo } from 'react';

import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../types';
import { useCustomActions } from './customAction';

export const UserActionsBar: RenderAction = memo(({ onActionClick }) => {
  const { regenerate, edit, copy, divider, del } = useChatListActionsBar();
  const { translate } = useCustomActions();

  const items = useMemo(
    () => [regenerate, edit] as ActionIconGroupItemType[],
    [],
  );

  return (
    <ActionIconGroup
      items={items}
      menu={{
        items: [edit, copy, divider, translate, divider, regenerate, del],
      }}
      onActionClick={onActionClick}
    />
  );
});

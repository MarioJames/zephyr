'use client';

import { ActionIconGroup } from '@lobehub/ui';
import { memo } from 'react';

import { RenderAction } from '../types';
import { useCustomActions } from './customAction';

export const AssistantActionsBar: RenderAction = memo(({ onActionClick }) => {
  const { translate } = useCustomActions();

  return (
    <ActionIconGroup items={[translate]} onActionClick={onActionClick} />
  );
});

'use client';

import { ActionIconGroup } from '@lobehub/ui';
import type { ActionIconGroupItemType } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../types';
import { ErrorActionsBar } from './Error';
import { useCustomActions } from './customAction';

export const AssistantActionsBar: RenderAction = memo(
  ({ onActionClick, error }) => {
    const { regenerate, edit, delAndRegenerate, copy, divider, del, share } =
      useChatListActionsBar();

    const { translate } = useCustomActions();

    if (error) return <ErrorActionsBar onActionClick={onActionClick} />;

    return (
      <ActionIconGroup
        items={[copy]}
        menu={{
          items: [
            edit,
            copy,
            divider,
            translate,
            divider,
            share,
            divider,
            regenerate,
            delAndRegenerate,
            del,
          ],
        }}
        onActionClick={onActionClick}
      />
    );
  }
);

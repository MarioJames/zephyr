"use client";

import { ActionIconGroup } from '@lobehub/ui';
import type { ActionIconGroupItemType } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import { useChatListActionsBar } from '../hooks/useChatListActionsBar';
import { RenderAction } from '../types';
import { ErrorActionsBar } from './Error';
import { useCustomActions } from './customAction';

export const AssistantActionsBar: RenderAction = memo(({ onActionClick, error, tools }) => {
  const {
    regenerate,
    edit,
    delAndRegenerate,
    copy,
    divider,
    del,
    share,
  } = useChatListActionsBar();

  const { translate } = useCustomActions();
  const hasTools = !!tools;

  const items = useMemo(() => {
    if (hasTools) return [delAndRegenerate, copy];

    return [edit, copy] as ActionIconGroupItemType[];
  }, [hasTools]);

  if (error) return <ErrorActionsBar onActionClick={onActionClick} />;

  return (
    <ActionIconGroup
      items={items}
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
});

import type { ActionIconGroupItemType } from '@lobehub/ui';
import { Copy, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';

interface ChatListActionsBar {
  copy: ActionIconGroupItemType;
  divider: { type: 'divider' };
  regenerate: ActionIconGroupItemType;
}

export const useChatListActionsBar = (): ChatListActionsBar => {
  return useMemo(
    () => ({
      copy: {
        icon: Copy,
        key: 'copy',
        label: '复制',
      },
      divider: {
        type: 'divider',
      },
      regenerate: {
        icon: RotateCcw,
        key: 'regenerate',
        label: '重新生成AI建议',
      },
    }),
    []
  );
};

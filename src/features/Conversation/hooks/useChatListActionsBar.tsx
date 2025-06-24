import type { ActionIconGroupItemType } from '@lobehub/ui';
import {
  Copy,
  DownloadIcon,
  Edit,
  ListRestart,
  RotateCcw,
  Share2,
  Trash,
} from 'lucide-react';
import { useMemo } from 'react';

interface ChatListActionsBar {
  copy: ActionIconGroupItemType;
  del: ActionIconGroupItemType;
  delAndRegenerate: ActionIconGroupItemType;
  divider: { type: 'divider' };
  edit: ActionIconGroupItemType;
  export: ActionIconGroupItemType;
  regenerate: ActionIconGroupItemType;
  share: ActionIconGroupItemType;
}

export const useChatListActionsBar = (): ChatListActionsBar => {
  return useMemo(
    () => ({
      copy: {
        icon: Copy,
        key: 'copy',
        label: '复制',
      },
      del: {
        danger: true,
        icon: Trash,
        key: 'del',
        label: '删除',
      },
      delAndRegenerate: {
        icon: ListRestart,
        key: 'delAndRegenerate',
        label: '删除并重新生成',
      },
      divider: {
        type: 'divider',
      },
      edit: {
        icon: Edit,
        key: 'edit',
        label: '编辑',
      },
      export: {
        icon: DownloadIcon,
        key: 'export',
        label: '导出为 PDF',
      },
      regenerate: {
        icon: RotateCcw,
        key: 'regenerate',
        label: '重新生成',
      },
      share: {
        icon: Share2,
        key: 'share',
        label: '分享',
      },
    }),
    []
  );
};

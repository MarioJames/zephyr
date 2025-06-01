import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { UsersRound, BookUser, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useGlobalStore,SidebarTabKey } from '@/store/global';
import { useSessionStore } from '@/store/session';

const ICON_SIZE: ActionIconProps['size'] = {
  blockSize: 40,
  size: 24,
  strokeWidth: 2,
};

export interface TopActionProps {
  isPinned?: boolean | null;
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab, isPinned }) => {
  const switchBackToChat = useGlobalStore((s) => s.switchBackToChat);

  const isChatActive = tab === SidebarTabKey.Chat && !isPinned;
  const isCustomerManagementActive = tab === SidebarTabKey.CustomerManagement;
  const isEmployeeManagementActive = tab === SidebarTabKey.EmployeeManagement;

  return (
    <Flexbox gap={8}>
      <Link
        aria-label={"会话"}
        href={'/chat'}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) {
            return;
          }
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={isChatActive}
          icon={MessageSquare}
          size={ICON_SIZE}
          title={"会话"}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link
        aria-label={"客户管理"}
        href={'/customer'}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) {
            return;
          }
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={isChatActive}
          icon={BookUser}
          size={ICON_SIZE}
          title={"客户管理"}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link
        aria-label={"员工管理"}
        href={'/employee'}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) {
            return;
          }
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={isChatActive}
          icon={UsersRound}
          size={ICON_SIZE}
          title={"员工管理"}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
    </Flexbox>
  );
});

export default TopActions;

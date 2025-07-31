import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import {
  UsersRound,
  BookUser,
  MessageSquare,
  FolderClosed,
} from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { SidebarTabKey } from '@/store/global/initialState';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

const ICON_SIZE: ActionIconProps['size'] = {
  blockSize: 40,
  size: 24,
  strokeWidth: 2,
};

export interface TopActionProps {
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab }) => {
  const isChatActive = tab === SidebarTabKey.Chat;
  const isFileActive = tab === SidebarTabKey.File;
  const isCustomerManagementActive = tab === SidebarTabKey.CustomerManagement;
  const isEmployeeManagementActive = tab === SidebarTabKey.EmployeeManagement;
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  return (
    <Flexbox gap={8}>
      <Link aria-label={'会话'} href={'/chat'}>
        <ActionIcon
          active={isChatActive}
          icon={MessageSquare}
          size={ICON_SIZE}
          title={'会话'}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      {isAdmin && (
        <Link aria-label={'客户管理'} href={'/customer'}>
          <ActionIcon
            active={isCustomerManagementActive}
            icon={BookUser}
            size={ICON_SIZE}
            title={'客户管理'}
            tooltipProps={{ placement: 'right' }}
          />
        </Link>
      )}
      {isAdmin && (
        <Link aria-label={'员工管理'} href={'/employee'}>
          <ActionIcon
            active={isEmployeeManagementActive}
            icon={UsersRound}
            size={ICON_SIZE}
            title={'员工管理'}
            tooltipProps={{ placement: 'right' }}
          />
        </Link>
      )}
      <Link aria-label={'文件管理'} href={'/file'}>
        <ActionIcon
          active={isFileActive}
          icon={FolderClosed}
          size={ICON_SIZE}
          title={'文件管理'}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
    </Flexbox>
  );
});

export default TopActions;

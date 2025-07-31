'use client';

import React, { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Button } from '@lobehub/ui';
import { Plus } from 'lucide-react';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import { Empty } from 'antd';

import { sessionSelectors, useSessionStore } from '@/store/session';
import { useChatStore } from '@/store/chat';
import EmployeeSelector from '@/components/EmployeeSelector';

import { SkeletonList } from '../SkeletonList';
import ShowMode from './ShowMode';
import SearchResult from './SearchResult';
import { UserItem } from '@/services';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

const useStyles = createStyles(({ css, token }) => ({
  button: css`
    display: flex;
    height: 32px;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 6px;
    border: 1px solid ${token.colorBorder};
    background: inherit;
    color: ${token.colorText};
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  `,
  flexbox: css`
    padding: 0 8px;
    gap: 8px;
    flex-wrap: nowrap;
  `,
}));

const SessionListContent = memo(() => {
  const router = useRouter();
  const { styles } = useStyles();
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  const [
    // state
    sessions,
    isLoading,
    inSearchMode,
    isInitialized,
    targetUserId,
    targetUser,

    // actions
    fetchSessions,
    initFromUrlParams,
    resetActiveState,
    setTargetUserId,
    setTargetUser,
  ] = useSessionStore((s) => [
    sessionSelectors.sessions(s),
    sessionSelectors.isLoading(s),
    sessionSelectors.inSearchMode(s),
    sessionSelectors.isInitialized(s),
    sessionSelectors.targetUserId(s),
    sessionSelectors.targetUser(s),

    s.fetchSessions,
    s.initFromUrlParams,
    s.resetActiveState,
    s.setTargetUserId,
    s.setTargetUser,
  ]);

  const [resetChatState] = useChatStore((s) => [s.resetChatState]);

  useEffect(() => {
    if (!isInitialized) {
      fetchSessions();
      initFromUrlParams();
    }
  }, [isInitialized, fetchSessions, initFromUrlParams]);

  const handleAddCustomer = () => {
    router.push('/customer/form');
  };

  const handleEmployeeSelect = async (userId: string, user: UserItem) => {
    // 设置当前选中的员工ID
    setTargetUserId(userId);
    setTargetUser(user);

    // 清空激活的session和topic
    resetActiveState();

    // 清空聊天状态
    resetChatState();

    // 重新获取该员工的会话列表，但不自动选择第一个会话
    await fetchSessions({ targetUserId: userId, autoSelectFirst: false });
  };

  const handleEmployeeClear = async () => {
    // 清空选中的员工
    setTargetUserId(undefined);
    setTargetUser(undefined);

    // 清空激活的session和topic
    resetActiveState();

    // 清空聊天状态
    resetChatState();

    // 重新获取当前登录用户的会话列表，但不自动选择第一个会话
    await fetchSessions({ autoSelectFirst: false });
  };

  if (inSearchMode) return <SearchResult />;
  if (isLoading) return <SkeletonList />;

  return (
    <>
      <Flexbox
        align='center'
        className={styles.flexbox}
        horizontal
        justify='space-between'
      >
        {isAdmin && (
          <div style={{ flex: 1 }}>
            <EmployeeSelector
              onChange={handleEmployeeSelect}
              onClear={handleEmployeeClear}
              placeholder='全部员工'
              selectedUser={targetUser}
              value={targetUserId}
            />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <Button
            className={styles.button}
            icon={<Plus size={16} />}
            onClick={handleAddCustomer}
            type='default'
          >
            创建客户
          </Button>
        </div>
      </Flexbox>
      {isInitialized && sessions.length === 0 ? (
        <Empty
          description='暂无会话'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{
            marginTop: 120,
          }}
        />
      ) : (
        <ShowMode />
      )}
    </>
  );
});

SessionListContent.displayName = 'SessionListContent';

export default SessionListContent;

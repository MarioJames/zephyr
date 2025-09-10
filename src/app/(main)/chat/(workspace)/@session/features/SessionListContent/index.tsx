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
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';
import { userSelectors } from '@/store/global/slices/user/selectors';

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
  const currentUser = useGlobalStore(userSelectors.currentUser);

  const [
    // state
    sessions,
    isLoading,
    inSearchMode,
    isInitialized,
    targetUserId,
    needsRefresh,

    // actions
    fetchSessions,
    forceRefreshSessions,
    initFromUrlParams,
    resetActiveState,
    setTargetUserId,
    setNeedsRefresh,
  ] = useSessionStore((s) => [
    sessionSelectors.sessions(s),
    sessionSelectors.isLoading(s),
    sessionSelectors.inSearchMode(s),
    sessionSelectors.isInitialized(s),
    sessionSelectors.targetUserId(s),
    sessionSelectors.needsRefresh(s),

    s.fetchSessions,
    s.forceRefreshSessions,
    s.initFromUrlParams,
    s.resetActiveState,
    s.setTargetUserId,
    s.setNeedsRefresh,
  ]);

  const [resetChatState] = useChatStore((s) => [s.resetChatState]);

  useEffect(() => {
    (async () => {
      if (!isInitialized) {
        await fetchSessions();
      }
      initFromUrlParams();
    })();
  }, [isInitialized, fetchSessions, initFromUrlParams]);

  // 检测是否需要刷新session数据（从客户管理页面返回时）
  useEffect(() => {
    if (needsRefresh && isInitialized) {
      forceRefreshSessions({ targetUserId });
      setNeedsRefresh(false);
    }
  }, [
    needsRefresh,
    isInitialized,
    forceRefreshSessions,
    targetUserId,
    setNeedsRefresh,
  ]);

  // 监听页面可见性变化，当用户返回聊天页面时检查是否需要刷新
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && needsRefresh && isInitialized) {
        forceRefreshSessions({ targetUserId });
        setNeedsRefresh(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    needsRefresh,
    isInitialized,
    forceRefreshSessions,
    targetUserId,
    setNeedsRefresh,
  ]);

  const handleAddCustomer = () => {
    router.push('/customer/form');
  };

  const handleEmployeeSelect = async (userId: string) => {
    // 设置当前选中的员工ID
    setTargetUserId(userId);

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
              placeholder={currentUser?.fullName || currentUser?.username || '切换员工'}
              value={targetUserId}
              selectedLabel={
                (() => {
                  const session = sessions.find((s) => s.userId === targetUserId);
                  return session?.user?.fullName || session?.user?.username;
                })()
              }
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

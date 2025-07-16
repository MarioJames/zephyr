"use client";

import React, { memo, useEffect } from "react";
import { Flexbox } from "react-layout-kit";
import { Button } from "@lobehub/ui";
import { Plus } from "lucide-react";
import { createStyles } from "antd-style";
import { useRouter } from "next/navigation";
import { Empty } from "antd";

import { sessionSelectors, useSessionStore } from "@/store/session";
import { useOIDCStore } from "@/store/oidc";
import { oidcSelectors } from "@/store/oidc/selectors";
import { useChatStore } from "@/store/chat";
import EmployeeSelector from "@/components/EmployeeSelector";

import { SkeletonList } from "../SkeletonList";
import ShowMode from "./ShowMode";
import SearchResult from "./SearchResult";

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
  const isAdmin = useOIDCStore(oidcSelectors.isCurrentUserAdmin);

  const [
    // state
    sessions,
    isLoading,
    inSearchMode,
    isInitialized,

    // actions
    fetchSessions,
    initFromUrlParams,
    setActiveSession,
    setActiveTopic,
    resetActiveState,
    setTargetUserId,
  ] = useSessionStore((s) => [
    sessionSelectors.sessions(s),
    sessionSelectors.isLoading(s),
    sessionSelectors.inSearchMode(s),
    sessionSelectors.isInitialized(s),

    s.fetchSessions,
    s.initFromUrlParams,
    s.setActiveSession,
    s.setActiveTopic,
    s.resetActiveState,
    s.setTargetUserId,
  ]);

  const [resetChatState] = useChatStore((s) => [s.resetChatState]);

  useEffect(() => {
    if (!isInitialized) {
      fetchSessions();
      initFromUrlParams();
    }
  }, [isInitialized, fetchSessions, initFromUrlParams]);

  const handleAddCustomer = () => {
    router.push("/customer/form");
  };

  const handleEmployeeSelect = async (userId: string) => {
    // 设置当前选中的员工ID
    setTargetUserId(userId);

    // 清空激活的session和topic
    resetActiveState();

    // 清空聊天状态
    resetChatState();

    // 重新获取该员工的会话列表
    await fetchSessions({ targetUserId:userId });
  };

  if (inSearchMode) return <SearchResult />;
  if (isLoading) return <SkeletonList />;

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        justify="space-between"
        className={styles.flexbox}
      >
        {isAdmin && (
          <div style={{ flex: 1 }}>
            <EmployeeSelector
              onChange={handleEmployeeSelect}
              placeholder="全部员工"
            />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <Button
            type="default"
            icon={<Plus size={16} />}
            className={styles.button}
            onClick={handleAddCustomer}
          >
            创建客户
          </Button>
        </div>
      </Flexbox>
      {isInitialized && sessions.length === 0 ? (
        <Empty
          description="暂无会话"
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

SessionListContent.displayName = "SessionListContent";

export default SessionListContent;

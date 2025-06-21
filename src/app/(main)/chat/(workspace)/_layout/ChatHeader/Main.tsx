"use client";

// import { Avatar } from '@lobehub/ui';
import { Skeleton } from "antd";
import { createStyles } from "antd-style";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Suspense, memo } from "react";
import { Flexbox } from "react-layout-kit";

import { useInitAgentConfig } from "@/hooks/useInitAgentConfig";
import { useOpenChatSettings } from "@/hooks/useInterceptingRoutes";
import { useGlobalStore } from "@/store/global";
import { systemStatusSelectors } from "@/store/global/selectors";

import TogglePanelButton from "@/app/(main)/chat/features/TogglePanelButton";
import Tags from "./Tags";

const useStyles = createStyles(({ css }) => ({
  container: css`
    position: relative;
    overflow: hidden;
    flex: 1;
    max-width: 100%;
  `,
  tag: css`
    flex: none;
    align-items: baseline;
  `,
  title: css`
    overflow: hidden;

    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  avatar: css`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #d9d9d9;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    cursor: pointer;
  `,
}));

const Main = memo<{ className?: string }>(({ className }) => {
  const { styles } = useStyles();
  useInitAgentConfig();
  const [isPinned] = useQueryState("pinned", parseAsBoolean);

  const showSessionPanel = useGlobalStore(
    systemStatusSelectors.showSessionPanel
  );

  return (
    <Flexbox align={"center"} className={className} gap={12} horizontal>
      {!isPinned && !showSessionPanel && <TogglePanelButton />}
      {/* <Avatar
        avatar={avatar}
        background={backgroundColor}
        onClick={() => openChatSettings()}
        size={32}
        title={title}
      /> */}
      <div className={styles.avatar}>{"客"}</div>
      <Flexbox align={"center"} className={styles.container} gap={8} horizontal>
        <div className={styles.title}>客户名称</div>
        <Tags />
      </Flexbox>
    </Flexbox>
  );
});

export default memo<{ className?: string }>(({ className }) => (
  <Suspense
    fallback={
      <Skeleton
        active
        avatar={{ shape: "circle", size: "default" }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    }
  >
    <Main className={className} />
  </Suspense>
));

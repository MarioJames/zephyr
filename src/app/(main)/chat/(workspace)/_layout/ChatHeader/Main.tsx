"use client";

// import { Avatar } from '@lobehub/ui';
import { Skeleton, Popover } from "antd";
import { createStyles } from "antd-style";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Suspense, memo } from "react";
import { Flexbox } from "react-layout-kit";
import { ChevronDown, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";

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
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
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
  popoverItem: css`
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 400;
    
    &:hover {
      background-color: #f5f5f5;
    }
  `,
}));

const Main = memo<{ className?: string }>(({ className }) => {
  const { styles } = useStyles();
  const router = useRouter();
  useInitAgentConfig();
  const [isPinned] = useQueryState("pinned", parseAsBoolean);

  const showSessionPanel = useGlobalStore(
    systemStatusSelectors.showSessionPanel
  );

  const handleEditCustomer = () => {
    router.push(`/customer/edit?id=${id}`);
  };

  const popoverContent = (
      <div className={styles.popoverItem} onClick={handleEditCustomer}>
        <PencilLine size={16} />
        编辑客户信息
      </div>
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
        <Popover
          content={popoverContent}
          trigger="click"
          placement="bottomLeft"
          arrow={false}
          styles={{
            root:{
              padding: '8px',
              borderRadius: '8px'
            }
          }}
        >
          <div className={styles.title}>
            客户名称
            <ChevronDown size={14} />
          </div>
        </Popover>
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

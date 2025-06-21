"use client";

import { ActionIcon, Tooltip } from "@lobehub/ui";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { memo } from "react";
import { Flexbox } from "react-layout-kit";
import { FileClock, Search } from "lucide-react";

import { useGlobalStore } from "@/store/global";
import { systemStatusSelectors } from "@/store/global/selectors";
import { Input } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  search: css`
    display: flex;
    width: 279px;
    height: 36px;
    padding: 10px;
    align-items: center;
    gap: 8px;
    border-radius: 6px;
    background: #EAEAEA;
    border: none;
  `,
  searchInput: css`
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    font-size: 14px !important;
  `,
  historyButton: css`
    border-radius: 6px;
    padding: 8px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04) !important;
    }
  `,
}));

const HeaderAction = memo<{ className?: string }>(({ className }) => {
  const { styles } = useStyles();
  const [showAgentSettings, toggleConfig] = useGlobalStore((s) => [
    systemStatusSelectors.showChatSideBar(s),
    s.toggleChatSideBar,
  ]);
  const slotPanelType = useGlobalStore(
    (s) => s.status.slotPanelType || "aiHint"
  );
  const setSlotPanelType = useGlobalStore((s) => s.setSlotPanelType);

  const handleHistoryClick = () => {
    setSlotPanelType(slotPanelType === "history" ? "aiHint" : "history");
  };

  return (
    <Flexbox className={className} gap={4} horizontal align="center">
      <div className={styles.search}>
        <Search size={16} color="#666" />
        <Input
          placeholder="搜索历史消息"
          className={styles.searchInput}
          allowClear
        />
      </div>
      <div
        className={styles.historyButton}
        style={{
          background: slotPanelType === "history" ? "#AEBBFF" : undefined,
        }}
        onClick={handleHistoryClick}
      >
        <FileClock size={20} />
        历史会话
      </div>
      <Tooltip title={"显示/隐藏右侧面板"}>
        <ActionIcon
          icon={showAgentSettings ? PanelRightClose : PanelRightOpen}
          onClick={() => toggleConfig()}
          size={20}
          color="#000"
        />
      </Tooltip>
    </Flexbox>
  );
});

export default HeaderAction;

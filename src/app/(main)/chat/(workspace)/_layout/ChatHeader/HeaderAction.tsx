"use client";

import { ActionIcon, Tooltip } from "@lobehub/ui";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { memo } from "react";
import { Flexbox } from "react-layout-kit";
import { FileClock } from "lucide-react";

import { DESKTOP_HEADER_ICON_SIZE } from "@/const/layoutTokens";
import { useGlobalStore } from "@/store/global";
import { systemStatusSelectors } from "@/store/global/selectors";
import { Input } from "antd";

const HeaderAction = memo<{ className?: string }>(({ className }) => {
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
    <Flexbox className={className} gap={4} horizontal>
      <Input.Search
        placeholder="搜索历史消息"
        style={{ width: 200 }}
        allowClear
      />
      <Flexbox
        style={{
          background: slotPanelType === "history" ? "#AEBBFF" : undefined,
          borderRadius: 6,
          padding: 4,
          cursor: "pointer",
        }}
        horizontal
        onClick={handleHistoryClick}
      >
        <FileClock size={18} />
        历史会话
      </Flexbox>
      <Tooltip title={"显示/隐藏话题面板"}>
        <ActionIcon
          icon={showAgentSettings ? PanelRightClose : PanelRightOpen}
          onClick={() => toggleConfig()}
          size={DESKTOP_HEADER_ICON_SIZE}
        />
      </Tooltip>
    </Flexbox>
  );
});

export default HeaderAction;

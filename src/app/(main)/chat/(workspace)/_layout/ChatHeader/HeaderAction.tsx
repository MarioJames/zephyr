"use client";

import { ActionIcon, Tooltip } from "@lobehub/ui";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { memo } from "react";
import { Flexbox } from "react-layout-kit";
import { FileClock } from "lucide-react";

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
          padding: 10,
          cursor: "pointer",
        }}
        horizontal
        align="center"
        onClick={handleHistoryClick}
      >
        <FileClock size={20} />
        历史会话
      </Flexbox>
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

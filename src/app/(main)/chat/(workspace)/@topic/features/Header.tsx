"use client";

import { ActionIcon, Dropdown, Icon, type MenuProps } from "@lobehub/ui";
import { App } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { LucideCheck, MoreHorizontal, Search, Trash } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Flexbox } from "react-layout-kit";

import SidebarHeader from "@/components/SidebarHeader";
import { useChatStore } from "@/store/chat";
import { topicSelectors } from "@/store/chat/selectors";
import { useUserStore } from "@/store/user";
import { preferenceSelectors } from "@/store/user/selectors";
import { TopicDisplayMode } from "@/types/topic";

import TopicSearchBar from "./TopicSearchBar";

const Header = memo(() => {
  const [topicLength, removeUnstarredTopic, removeAllTopic] = useChatStore(
    (s) => [
      topicSelectors.currentTopicLength(s),
      s.removeUnstarredTopic,
      s.removeSessionTopics,
    ]
  );
  const [topicDisplayMode, updatePreference] = useUserStore((s) => [
    preferenceSelectors.topicDisplayMode(s),
    s.updatePreference,
  ]);
  const [showSearch, setShowSearch] = useState(false);
  const { modal } = App.useApp();

  const items = useMemo<MenuProps["items"]>(
    () => [
      ...(Object.values(TopicDisplayMode).map((mode) => ({
        icon: topicDisplayMode === mode ? <Icon icon={LucideCheck} /> : <div />,
        key: mode,
        label: mode === "byTime" ? "按时间分组" : "不分组",
        onClick: () => {
          updatePreference({ topicDisplayMode: mode });
        },
      })) as ItemType[]),
      {
        type: "divider",
      },
      {
        icon: <Icon icon={Trash} />,
        key: "deleteUnstarred",
        label: "删除未收藏话题",
        onClick: () => {
          modal.confirm({
            cancelText: "取消",
            centered: true,
            okButtonProps: { danger: true },
            okText: "确定",
            onOk: removeUnstarredTopic,
            title: "即将删除未收藏话题，删除后将不可恢复，请谨慎操作。",
          });
        },
      },
      {
        danger: true,
        icon: <Icon icon={Trash} />,
        key: "deleteAll",
        label: "删除全部话题",
        onClick: () => {
          modal.confirm({
            cancelText: "取消",
            centered: true,
            okButtonProps: { danger: true },
            okText: "确定",
            onOk: removeAllTopic,
            title: "即将删除全部话题，删除后将不可恢复，请谨慎操作。",
          });
        },
      },
    ],
    [topicDisplayMode]
  );

  return showSearch ? (
    <Flexbox padding={"12px 16px 4px"}>
      <TopicSearchBar onClear={() => setShowSearch(false)} />
    </Flexbox>
  ) : (
    <SidebarHeader
      actions={
        <>
          <ActionIcon
            icon={Search}
            onClick={() => setShowSearch(true)}
            size={"small"}
          />
          <Dropdown
            arrow={false}
            menu={{
              items: items,
              onClick: ({ domEvent }) => {
                domEvent.stopPropagation();
              },
            }}
            trigger={["click"]}
          >
            <ActionIcon icon={MoreHorizontal} size={"small"} />
          </Dropdown>
        </>
      }
      title={`话题 ${topicLength > 1 ? topicLength + 1 : ""}`}
    />
  );
});

export default Header;

"use client";

import { ActionIcon, Tooltip, Input } from "@lobehub/ui";
import { Spin } from "antd";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import React, { memo, useState, useEffect } from "react";
import { Flexbox } from "react-layout-kit";
import { FileClock, Search } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { useGlobalStore } from "@/store/global";
import { systemStatusSelectors } from "@/store/global/selectors";
import { createStyles } from "antd-style";
import dayjs from "dayjs";

const useStyles = createStyles(({ css, token }) => ({
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
    position: relative;
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
      background-color: ${token.colorSplit} !important;
    }
  `,
  historyButtonSelected: css`
    border-radius: 6px;
    padding: 8px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s ease;
    color: ${token.colorPrimary} !important;
    background-color: ${token.colorSplit} !important;
  `,
  searchResults: css`
    position: absolute;
    top: 100%;
    left: 0;
    width: 360px;
    max-height: 540px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 16px;
    overflow-y: auto;
    z-index: 1000;
    margin-top: 4px;
  `,
  searchItem: css`
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${token.colorBgTextHover};
    }
  `,
  itemTitle: css`
    font-size: 14px;
    color: ${token.colorText};
    margin-bottom: 4px;
  `,
  itemMeta: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,
  emptyState: css`
    text-align: center;
    padding: 24px 0;
    color: ${token.colorTextSecondary};
  `,
  spinContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  `
}));

const HeaderAction = memo<{ className?: string }>(({ className }) => {
  const { styles } = useStyles();
  const showSlotPanel = useGlobalStore(systemStatusSelectors.showSlotPanel);
  const toggleSlotPanel = useGlobalStore((s) => s.toggleSlotPanel);
  const slotPanelType = useGlobalStore(
    (s) => s.status.slotPanelType || "aiHint"
  );
  const setSlotPanelType = useGlobalStore((s) => s.setSlotPanelType);
  
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const { useSearchTopics, searchTopics, isSearchingTopic, clearTopicSearchResult, switchTopic } = useChatStore();

  const handleSearch = () => {
    if (searchValue.trim()) {
      useSearchTopics(searchValue + "@/topic", "current-session");
      setShowResults(true);
    }
  };

  useEffect(() => {
    if (searchValue.trim()) {
      handleSearch();
    } else {
      clearTopicSearchResult();
      setShowResults(false);
    }
  }, [searchValue]);

  const handleHistoryClick = () => {
    setSlotPanelType(slotPanelType === "history" ? "aiHint" : "history");
  };

  const handleTopicClick = (topicId: string) => {
    switchTopic(topicId);
    setSearchValue("");
    setShowResults(false);
  };

  return (
    <Flexbox className={className} gap={4} horizontal align="center">
      <div className={styles.search}>
        <Search size={16} color="#666" />
        <Input
          placeholder="搜索历史消息"
          className={styles.searchInput}
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowResults(true)}
          onPressEnter={handleSearch}
        />
        {showResults && (
          <div className={styles.searchResults}>
            {isSearchingTopic ? (
              <div className={styles.spinContainer}>
                <Spin />
              </div>
            ) : searchTopics.length > 0 ? (
              searchTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={styles.searchItem}
                  onClick={() => handleTopicClick(topic.id)}
                >
                  <div className={styles.itemTitle}>{topic.title}</div>
                  <div className={styles.itemMeta}>
                    @ {topic?.user?.fullName || '默认员工'} | {dayjs(topic.createdAt).format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                暂无搜索结果
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={slotPanelType === "history" ? styles.historyButtonSelected : styles.historyButton}
        onClick={handleHistoryClick}
      >
        <FileClock size={20} />
        历史会话
      </div>
      <Tooltip title={"显示/隐藏右侧面板"}>
        <ActionIcon
          icon={showSlotPanel ? PanelRightClose : PanelRightOpen}
          onClick={() => toggleSlotPanel()}
          size={20}
          color="#000"
        />
      </Tooltip>
    </Flexbox>
  );
});

export default HeaderAction;

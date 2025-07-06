"use client";

import { ActionIcon, Tooltip, Input } from "@lobehub/ui";
import { Spin, List, Popover } from "antd";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import React, { memo, useState, useEffect } from "react";
import { Flexbox } from "react-layout-kit";
import { FileClock, Search } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { useGlobalStore } from "@/store/global";
import { systemStatusSelectors } from "@/store/global/selectors";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import messageService, { MessageItem } from "@/services/messages";
import { useSessionStore } from "@/store/session";
import { sessionSelectors } from "@/store/session/selectors";

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
    width: 360px;
    max-height: 540px;
    overflow-y: auto;
  `,
  searchItem: css`
    padding: 12px;
    cursor: pointer;

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
    padding: 24px 0;
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
  const [searchResults, setSearchResults] = useState<MessageItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { switchTopic } = useChatStore();
  const activeSessionId = useSessionStore(sessionSelectors.activeSessionId);

  const handleSearch = async () => {
    if (searchValue.trim() && activeSessionId) {
      setIsSearching(true);
      setShowResults(true);
      try {
        const results = await messageService.searchMessages({
          keyword: searchValue,
          sessionId: activeSessionId
        });
        console.log('搜索结果', results);
        setSearchResults(results);
      } catch (error) {
        console.error('搜索失败:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchValue.trim() && activeSessionId) {
        handleSearch();
      } else {
        setSearchResults([]);
        if (!searchValue.trim()) {
          setShowResults(false);
        }
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchValue, activeSessionId]);

  const handleHistoryClick = () => {
    setSlotPanelType(slotPanelType === "history" ? "aiHint" : "history");
  };

  const handleMessageClick = (message: MessageItem) => {
    if (message.topicId) {
      switchTopic(message.topicId);
      setSearchValue("");
      setShowResults(false);
    }
  };

  const searchContent = (
    <div className={styles.searchResults}>
      {isSearching ? (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      ) : searchResults.length > 0 ? (
        <List
          dataSource={searchResults}
          renderItem={(message) => (
            <List.Item 
              className={styles.searchItem}
              onClick={() => handleMessageClick(message)}
            >
              <div>
                <div className={styles.itemTitle}>{message.content || searchValue}</div>
                <div className={styles.itemMeta}>
                  @ {message.user?.fullName || '默认员工'} | {dayjs(message.createdAt).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div className={styles.emptyState}>
          暂无搜索结果
        </div>
      )}
    </div>
  );

  return (
    <Flexbox className={className} gap={4} horizontal align="center">
      <div className={styles.search}>
        <Search size={16} color="#666" />
        <Popover
          open={showResults}
          content={searchContent}
          trigger="click"
          placement="bottomLeft"
          arrow={false}
          overlayInnerStyle={{
            padding: 0,
          }}
        >
          <Input
            placeholder="搜索历史消息"
            className={styles.searchInput}
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => {
              if (searchValue.trim()) {
                setShowResults(true);
              }
            }}
            onBlur={() => {
              // 给一个小延时，让点击事件能够触发
              setTimeout(() => {
                setShowResults(false);
              }, 200);
            }}
            onPressEnter={handleSearch}
          />
        </Popover>
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

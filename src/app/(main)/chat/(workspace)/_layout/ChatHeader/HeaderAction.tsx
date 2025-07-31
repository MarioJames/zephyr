'use client';

import { ActionIcon, Tooltip, Input } from '@lobehub/ui';
import { Spin, List, Popover } from 'antd';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import React, { memo, useState, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { FileClock, Search } from 'lucide-react';
import { useChatStore } from '@/store/chat';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';
import { createStyles, useTheme } from 'antd-style';
import dayjs from 'dayjs';
import messageService, { MessageItem } from '@/services/messages';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
import { removeSystemContext } from '@/utils/messageContentFilter';

const useStyles = createStyles(({ css, token }) => ({
  search: css`
    display: flex;
    width: 279px;
    height: 36px;
    padding: 10px;
    align-items: center;
    gap: 8px;
    border-radius: 6px;
    background: ${token.colorBgTextHover};
    border: ${token.colorSplit};
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
    padding: 7px 10px;
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
    padding: 7px 10px;
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
    padding: 16px;

    .ant-list-item {
      padding: 8px !important;
      border-radius: 6px;
      cursor: pointer;
      border-bottom: none !important;

      &:hover {
        background-color: ${token.colorBgTextHover};
      }
    }
  `,
  searchItem: css`
    width: 100%;
  `,
  itemTitle: css`
    font-size: 14px;
    color: ${token.colorText};
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  `,
  itemMeta: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,
  highlight: css`
    color: ${token.colorHighlight};
    font-weight: 500;
    background: ${token.colorHighlight}10;
    padding: 0 2px;
    border-radius: 2px;
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
  `,
  toggleSlotPanel: css`
    &:hover {
      background-color: ${token.colorSplit} !important;
    }
  `,
}));

// 处理文本截取和高亮
const processSearchContent = (
  content: string,
  keyword: string,
  styles: ReturnType<typeof useStyles>['styles']
) => {
  if (!content) return '';

  const index = content.toLowerCase().indexOf(keyword.toLowerCase());
  if (index === -1) return content;

  // 确定截取范围
  const contextLength = 20; // 关键词前后保留的字符数
  const start = Math.max(0, index - contextLength);
  const end = Math.min(content.length, index + keyword.length + contextLength);

  // 添加省略号
  let processedContent = content.slice(start, end);
  if (start > 0) processedContent = '...' + processedContent;
  if (end < content.length) processedContent = processedContent + '...';

  // 高亮关键词
  const keywordIndex = processedContent
    .toLowerCase()
    .indexOf(keyword.toLowerCase());
  if (keywordIndex === -1) return processedContent;

  const before = processedContent.slice(0, keywordIndex);
  const match = processedContent.slice(
    keywordIndex,
    keywordIndex + keyword.length
  );
  const after = processedContent.slice(keywordIndex + keyword.length);

  return (
    <>
      {before}
      <span className={styles.highlight}>{match}</span>
      {after}
    </>
  );
};

const HeaderAction = memo<{ className?: string }>(({ className }) => {
  const { styles } = useStyles();
  const showSlotPanel = useGlobalStore(globalSelectors.showSlotPanel);
  const toggleSlotPanel = useGlobalStore((s) => s.toggleSlotPanel);
  const slotPanelType = useGlobalStore(
    (s) => s.status.slotPanelType || 'aiHint'
  );
  const setSlotPanelType = useGlobalStore((s) => s.setSlotPanelType);

  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<MessageItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { switchTopic } = useChatStore();
  const activeSessionId = useSessionStore(sessionSelectors.activeSessionId);
  const theme = useTheme();

  const handleSearch = async () => {
    if (searchValue.trim() && activeSessionId) {
      setIsSearching(true);
      setShowResults(true);
      try {
        const results = await messageService.searchMessages({
          keyword: searchValue,
          sessionId: activeSessionId,
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
    setSlotPanelType(slotPanelType === 'history' ? 'aiHint' : 'history');
  };

  const handleMessageClick = (message: MessageItem) => {
    if (message.topicId) {
      switchTopic(message.topicId);
      setSearchValue('');
      setShowResults(false);
    }
    // TODO: 看看能不能跳转到指定消息
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
          renderItem={(message) => {
            const content = removeSystemContext(message.content || '');

            return (
              <List.Item
                className={styles.searchItem}
                onClick={() => handleMessageClick(message)}
              >
                <div>
                  <div className={styles.itemTitle}>
                    {processSearchContent(
                      content || searchValue,
                      searchValue,
                      styles
                    )}
                  </div>
                  <div className={styles.itemMeta}>
                    @ {message.user?.fullName || '默认员工'} |{' '}
                    {dayjs(message.createdAt).format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      ) : (
        <div className={styles.emptyState}>暂无搜索结果</div>
      )}
    </div>
  );

  return (
    <Flexbox className={className} gap={4} horizontal align='center'>
      <div className={styles.search}>
        <Search size={16} color={theme.colorText} />
        <Popover
          open={showResults}
          content={searchContent}
          trigger='click'
          placement='bottomLeft'
          arrow={false}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <Input
            placeholder='搜索历史消息'
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
              setTimeout(() => {
                setShowResults(false);
              }, 200);
            }}
            onPressEnter={handleSearch}
          />
        </Popover>
      </div>
      <div
        className={
          slotPanelType === 'history'
            ? styles.historyButtonSelected
            : styles.historyButton
        }
        onClick={handleHistoryClick}
      >
        <FileClock size={20} />
        历史会话
      </div>
      <Tooltip title={'显示/隐藏右侧面板'}>
        <ActionIcon
          icon={showSlotPanel ? PanelRightClose : PanelRightOpen}
          onClick={() => toggleSlotPanel()}
          size={20}
          className={styles.toggleSlotPanel}
        />
      </Tooltip>
    </Flexbox>
  );
});

HeaderAction.displayName = 'HeaderAction';

export default HeaderAction;

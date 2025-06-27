import React, { useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { FileClock, X } from 'lucide-react';
import { useGlobalStore } from '@/store/global';
import { useChatStore } from '@/store/chat';
import { topicSelectors } from '@/store/chat';
import { useHistoryStyles } from './style';
import dayjs from 'dayjs';

const HistoryPanel = () => {
  const setSlotPanelType = useGlobalStore((s) => s.setSlotPanelType);
  const { styles } = useHistoryStyles();

  // 获取当前 sessionId 和 fetchTopics action
  const sessionId = useChatStore((s) => s.activeId);
  const fetchTopics = useChatStore((s) => s.fetchTopics);
  // 获取话题列表
  const topics = useChatStore(topicSelectors.topics);

  useEffect(() => {
    if (sessionId) {
      fetchTopics(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <Flexbox height="100%" className={styles.panelBg}>
      {/* Header */}
      <Flexbox
        horizontal
        align="center"
        distribution="space-between"
        className={styles.header}
      >
        <Flexbox horizontal align="center" gap={8}>
          <FileClock size={20} />
          <span className={styles.headerTitle}>历史会话</span>
        </Flexbox>
        <X
          size={16}
          color='rgba(0, 0, 0, 0.45)'
          className={styles.closeBtn}
          onClick={() => setSlotPanelType('aiHint')}
        />
      </Flexbox>
      {/* List */}
      <Flexbox flex={1} className={styles.listWrap}>
        {topics.map((item) => (
          <Flexbox
            key={item.id}
            horizontal
            distribution="space-between"
            align="center"
            className={styles.historyItem}
          >
            <Flexbox>
              <div className={styles.historyTitle}>{item.title}</div>
              <div className={styles.historyMeta}>
                @{item.user?.username || item.user?.fullName || '未知员工'} | {item.updatedAt ? dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''}
              </div>
            </Flexbox>
            <div className={styles.historyCount}>{item.messageCount}</div>
          </Flexbox>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default HistoryPanel; 
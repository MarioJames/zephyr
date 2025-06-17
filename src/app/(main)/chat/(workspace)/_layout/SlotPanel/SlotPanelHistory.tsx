import React from 'react';
import { Flexbox } from 'react-layout-kit';
import { FileClock, X } from 'lucide-react';
import { useGlobalStore } from '@/store/global';
import { useHistoryStyles } from './style';

const mockData = [
  {
    id: 1,
    title: '客户沟通记录',
    staff: '张三',
    date: '2024-05-01 14:23:11',
    count: 3,
  },
  {
    id: 2,
    title: '项目进展同步',
    staff: '李四',
    date: '2024-05-02 09:10:45',
    count: 5,
  },
  {
    id: 3,
    title: '售后反馈',
    staff: '王五',
    date: '2024-05-03 16:55:20',
    count: 2,
  },
];

const HistoryPanel = () => {
  const setSlotPanelType = useGlobalStore((s) => s.setSlotPanelType);
  const { styles } = useHistoryStyles();
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
        {mockData.map((item) => (
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
                @{item.staff} | {item.date}
              </div>
            </Flexbox>
            <div className={styles.historyCount}>{item.count}</div>
          </Flexbox>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default HistoryPanel; 
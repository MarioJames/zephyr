import React from 'react';
import { Flexbox } from 'react-layout-kit';
import { FileClock, X } from 'lucide-react';
import { useGlobalStore } from '@/store/global';

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
  return (
    <Flexbox height="100%" style={{ background: '#fff' }}>
      {/* Header */}
      <Flexbox
        horizontal
        align="center"
        distribution="space-between"
        style={{ height: 56, padding: '0 20px', borderBottom: '1px solid #F0F0F0' }}
      >
        <Flexbox horizontal align="center" gap={8}>
          <FileClock size={20} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>历史会话</span>
        </Flexbox>
        <X
          size={20}
          style={{ cursor: 'pointer' }}
          onClick={() => setSlotPanelType('aiHint')}
        />
      </Flexbox>
      {/* List */}
      <Flexbox flex={1} style={{ overflowY: 'auto', padding: 16, gap: 12 }}>
        {mockData.map((item) => (
          <Flexbox
            key={item.id}
            horizontal
            distribution="space-between"
            align="center"
            style={{ background: '#F7F8FA', borderRadius: 8, padding: '12px 16px' }}
          >
            <Flexbox gap={4}>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{item.title}</div>
              <div style={{ color: '#888', fontSize: 13 }}>
                @{item.staff} | {item.date}
              </div>
            </Flexbox>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{item.count}</div>
          </Flexbox>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default HistoryPanel; 
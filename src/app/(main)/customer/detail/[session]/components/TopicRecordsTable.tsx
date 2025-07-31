import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import topicService, { TopicItem } from '@/services/topics';

const useStyles = createStyles(({ css }) => ({
  messagesTitle: css`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  `,
}));

export interface TopicRecordsTableProps {
  sessionId: string;
}

export const TopicRecordsTable: React.FC<TopicRecordsTableProps> = ({
  sessionId,
}) => {
  const { styles, theme } = useStyles();
  const router = useRouter();

  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // 加载话题列表
  const loadTopics = async (sessionId: string) => {
    setLoading(true);
    try {
      const topicList = await topicService.getTopicList(sessionId);
      setTopics(topicList);
    } catch (error) {
      console.error('加载话题失败:', error);
      message.error('加载话题列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadTopics(sessionId);
    }
  }, [sessionId]);

  const handleViewTopic = (topicId: string) => {
    router.push(`/chat?session=${sessionId}&topic=${topicId}`);
  };

  // 话题记录表格列定义
  const columns = [
    {
      title: '主题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '消息数量',
      dataIndex: 'messageCount',
      key: 'messageCount',
      render: (count: number, record: TopicItem) => (
        <a
          onClick={() => handleViewTopic(record.id)}
          style={{ color: theme.colorPrimary }}
        >
          {count}
        </a>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortField === 'createdAt' ? (sortOrder as any) : null,
      render: (date: string) =>
        date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) =>
        date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <a
          onClick={() => handleViewTopic(record.id)}
          style={{ color: theme.colorPrimary }}
        >
          查看
        </a>
      ),
    },
  ];

  // 处理表格变化
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  return (
    <>
      <div className={styles.messagesTitle}>话题记录</div>
      <Table
        columns={columns}
        dataSource={topics}
        loading={loading}
        locale={{
          triggerDesc: '点击降序排列',
          triggerAsc: '点击升序排列',
          cancelSort: '取消排序',
          emptyText: '暂无话题记录',
        }}
        onChange={handleTableChange}
        pagination={{
          pageSize: 5,
          showTotal: (total) => `共 ${total} 条记录`,
          locale: {
            items_per_page: '条/页',
            jump_to: '跳至',
            page: '页',
          },
        }}
        rowKey="id"
      />
    </>
  );
};

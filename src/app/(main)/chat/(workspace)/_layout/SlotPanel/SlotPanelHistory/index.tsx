import React, { useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { FileClock, X, MoreHorizontal, Edit3, Sparkles } from 'lucide-react';
import { Dropdown, Modal, Input, App, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { useGlobalStore } from '@/store/global';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useSessionStore , sessionSelectors } from '@/store/session';

import { useHistoryStyles } from '../style';
import dayjs from 'dayjs';
import SkeletonList from './SkeletonList';
import topicService from '@/services/topics';
import { topicsAPI } from '@/services';

const useStyles = createStyles(({ token, css }) => ({
  menuItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  dropdownTrigger: css`
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${token.colorBgTextHover};
    }
  `,
  historyItemWrapper: css`
    position: relative;

    &:hover .dropdown-trigger {
      opacity: 1;
    }
  `,
  dropdownTriggerHidden: css`
    opacity: 0;
    transition: opacity 0.2s;
  `,
}));

const HistoryPanel = () => {
  const setSlotPanelType = useGlobalStore((s) => s.setSlotPanelType);

  const { styles } = useHistoryStyles();
  const { styles: customStyles } = useStyles();
  const { message } = App.useApp();

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [loadingTopicIds, setLoadingTopicIds] = useState<Set<string>>(
    new Set()
  );

  // 获取当前 activeSessionId 和 fetchTopics action
  const [activeSessionId, activeTopicId] = useSessionStore((s) => [
    sessionSelectors.activeSessionId(s),
    sessionSelectors.activeTopicId(s),
  ]);

  // 获取话题列表和加载状态
  const [isLoading, topics, fetchTopics, switchTopic, updateTopic] =
    useChatStore((s) => [
      chatSelectors.fetchTopicLoading(s),
      chatSelectors.topics(s),
      s.fetchTopics,
      s.switchTopic,
      s.updateTopic,
    ]);

  useEffect(() => {
    if (activeSessionId) {
      fetchTopics(activeSessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  // 处理重命名
  const handleRename = (topic: { id: string; title: string }) => {
    setEditingTopic(topic);
    setNewTitle(topic.title || '');
    setIsRenameModalOpen(true);
  };

  // 处理AI重命名
  const handleAIRename = async (topicId: string) => {
    try {
      // 添加loading状态
      setLoadingTopicIds((prev) => new Set(prev).add(topicId));

      // 生成新标题
      const newTitle = await topicService.summaryTopicTitle({ id: topicId });
      
      // 更新话题标题
      const updatedTopic = await topicsAPI.updateTopic(topicId, {
        title: newTitle,
      });
      
      updateTopic(topicId, updatedTopic);

      message.success('AI 重命名成功');
    } catch (error) {
      console.error('AI重命名失败:', error);
      message.error('AI重命名失败');
    } finally {
      // 移除loading状态
      setLoadingTopicIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(topicId);
        return newSet;
      });
    }
  };

  // 确认重命名
  const handleConfirmRename = async () => {
    if (!editingTopic || !newTitle.trim()) {
      message.error('请输入话题名称');
      return;
    }

    try {
      // 添加loading状态
      setLoadingTopicIds((prev) => new Set(prev).add(editingTopic.id));

      const newTopic = await topicsAPI.updateTopic(editingTopic.id, {
        title: newTitle.trim(),
      });

      updateTopic(editingTopic.id, newTopic);

      message.success('重命名成功');

      setIsRenameModalOpen(false);
      setEditingTopic(null);
      setNewTitle('');
    } catch (error) {
      console.error('重命名失败:', error);
      message.error('重命名失败');
    } finally {
      // 移除loading状态
      setLoadingTopicIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(editingTopic.id);
        return newSet;
      });
    }
  };

  // 创建下拉菜单项
  const getDropdownItems = (topic: { id: string; title: string }) => [
    {
      key: 'rename',
      label: (
        <div className={customStyles.menuItem}>
          <Edit3 size={16} />
          重命名
        </div>
      ),
      onClick: (e: any) => {
        e?.domEvent?.stopPropagation();
        handleRename(topic);
      },
    },
    {
      key: 'ai-rename',
      label: (
        <div className={customStyles.menuItem}>
          <Sparkles size={16} />
          使用 AI 重命名
        </div>
      ),
      onClick: (e: any) => {
        e?.domEvent?.stopPropagation();
        handleAIRename(topic.id);
      },
    },
  ];

  return (
    <Flexbox className={styles.panelBg} height='100%'>
      {/* Header */}
      <Flexbox
        align='center'
        className={styles.header}
        distribution='space-between'
        horizontal
      >
        <Flexbox align='center' gap={8} horizontal>
          <FileClock size={20} />
          <span className={styles.headerTitle}>历史会话</span>
        </Flexbox>
        <X
          className={styles.closeBtn}
          color='rgba(0, 0, 0, 0.45)'
          onClick={() => setSlotPanelType('aiHint')}
          size={16}
        />
      </Flexbox>
      {/* List */}
      <Flexbox className={styles.listWrap} flex={1}>
        {isLoading ? (
          <SkeletonList />
        ) : topics.length === 0 ? (
          <Flexbox
            align='center'
            flex={1}
            justify='center'
            style={{ color: '#999', fontSize: 16 }}
          >
            暂无历史会话
          </Flexbox>
        ) : (
          topics.map((item) => {
            return (
              <Spin
                key={item.id}
                size='small'
                spinning={loadingTopicIds.has(item.id)}
              >
                <Flexbox
                  align='center'
                  className={`
                    ${styles.historyItem}
                    ${item.id === activeTopicId ? styles.activeHistoryItem : ''}
                    ${customStyles.historyItemWrapper}
                    `}
                  distribution='space-between'
                  horizontal
                  onClick={() => {
                    if (item.id === activeTopicId) return;

                    switchTopic(item.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Flexbox flex={1}>
                    <div className={styles.historyTitle}>{item.title}</div>
                    <div className={styles.historyMeta}>
                      @
                      {item.user?.fullName || item.user?.username || '未知员工'}{' '}
                      |{' '}
                      {item.updatedAt
                        ? dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
                        : ''}
                    </div>
                  </Flexbox>
                  <Flexbox align='center' gap={8} horizontal>
                    <div className={styles.historyCount}>
                      {item.messageCount}
                    </div>
                    <Dropdown
                      menu={{
                        items: getDropdownItems({
                          id: item.id,
                          title: item.title || '',
                        }),
                      }}
                    >
                      <div
                        className={`${customStyles.dropdownTrigger} ${customStyles.dropdownTriggerHidden} dropdown-trigger`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={16} />
                      </div>
                    </Dropdown>
                  </Flexbox>
                </Flexbox>
              </Spin>
            );
          })
        )}
      </Flexbox>

      {/* 重命名弹窗 */}
      <Modal
        cancelText='取消'
        confirmLoading={
          editingTopic ? loadingTopicIds.has(editingTopic.id) : false
        }
        okText='确认'
        onCancel={() => {
          setIsRenameModalOpen(false);
          setEditingTopic(null);
          setNewTitle('');
        }}
        onOk={handleConfirmRename}
        open={isRenameModalOpen}
        title='重命名话题'
      >
        <Input
          disabled={editingTopic ? loadingTopicIds.has(editingTopic.id) : false}
          maxLength={100}
          onChange={(e) => setNewTitle(e.target.value)}
          onPressEnter={handleConfirmRename}
          placeholder='请输入新的话题标题'
          value={newTitle}
        />
      </Modal>
    </Flexbox>
  );
};

export default HistoryPanel;

'use client';

import { App, Flex } from 'antd';
import { MessageCirclePlus } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useChatStore } from '@/store/chat';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
import { useRouter } from 'next/navigation';
import topicService from '@/services/topics';

import Action from '../components/Action';

const NewTopic = memo(() => {
  const { message } = App.useApp();
  const router = useRouter();

  const { createTopic, switchTopic } = useChatStore((s) => ({
    createTopic: s.createTopic,
    switchTopic: s.switchTopic,
  }));

  const activeSessionId = useSessionStore(sessionSelectors.activeSessionId);

  const handleCreateNewTopic = useCallback(async () => {
    if (!activeSessionId) {
      message.warning('请先选择会话');
      return;
    }

    try {
      message.loading('正在创建新话题...', 0);

      // 创建新话题
      const newTopic = await createTopic({
        title: '新的话题',
        sessionId: activeSessionId,
      });

      message.destroy();
      message.success('新话题创建成功');

      // 切换到新话题
      switchTopic(newTopic.id);

      // 跳转到新话题页面
      router.push(`/chat?session=${activeSessionId}&topic=${newTopic.id}`);

      // 异步调用总结话题接口（不需要等待）
      topicService.summaryTopic(newTopic.id).catch((error) => {
        console.warn('话题总结失败:', error);
      });
    } catch (error) {
      message.destroy();
      console.error('创建新话题失败:', error);
      message.error('创建新话题失败，请稍后重试');
    }
  }, [activeSessionId, createTopic, switchTopic, router, message]);

  return (
    <Flex align='center' style={{ cursor: 'pointer', width: 100 }}>
      <Action
        title='新开会话'
        icon={MessageCirclePlus}
        onClick={handleCreateNewTopic}
        disabled={!activeSessionId}
      />
      <span>新开会话</span>
    </Flex>
  );
});

export default NewTopic;

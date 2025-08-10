"use client";

import { App, Flex } from "antd";
import { MessageCirclePlus } from "lucide-react";
import { memo, useCallback, MouseEvent } from "react";
import { debounce } from "lodash-es";
import { useChatStore } from "@/store/chat";
import { useSessionStore } from "@/store/session";
import { sessionSelectors } from "@/store/session/selectors";
import { useRouter } from "next/navigation";
import topicService from "@/services/topics";
import { topicsAPI } from "@/services";
import { createStyles } from "antd-style";

import Action from "../components/Action";

const useStyles = createStyles(({ css, token }) => ({
  newTopic: css`
    cursor: pointer;
    width: 100px;
    border-radius: 6px;
    &:hover {
      background: ${token.colorSplit};
    }
  `,
  topicIcon: css`
    &:hover {
      background: none !important;
    }
  `,
}));

const NewTopic = memo(() => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const router = useRouter();

  const { createTopic, switchTopic, updateTopic } = useChatStore((s) => ({
    createTopic: s.createTopic,
    switchTopic: s.switchTopic,
    updateTopic: s.updateTopic,
  }));

  const [activeSessionId, activeTopicId] = useSessionStore((s) => [
    sessionSelectors.activeSessionId(s),
    sessionSelectors.activeTopicId(s),
  ]);

  const createNewTopic = async () => {
    if (!activeSessionId) {
      message.warning("请先选择会话");
      return;
    }

    try {
      // 如果有当前话题，异步调用总结话题接口为当前话题生成标题并更新
      if (activeTopicId) {
        (async () => {
          try {
            // 生成新标题
            const newTitle = await topicService.summaryTopicTitle({ id: activeTopicId });
            
            // 更新话题标题
            const updatedTopic = await topicsAPI.updateTopic(activeTopicId, {
              title: newTitle,
            });
            
            // 更新本地状态
            updateTopic(activeTopicId, updatedTopic);
          } catch (error) {
            console.warn("话题总结失败:", error);
          }
        })();
      }

      message.loading("正在创建新话题...", 0);

      // 创建新话题
      const newTopic = await createTopic({
        title: "新的话题",
        sessionId: activeSessionId,
      });

      message.destroy();
      message.success("新话题创建成功");

      // 切换到新话题
      switchTopic(newTopic.id);

      // 跳转到新话题页面
      router.push(`/chat?session=${activeSessionId}&topic=${newTopic.id}`);
    } catch (error) {
      message.destroy();
      console.error("创建新话题失败:", error);
      message.error("创建新话题失败，请稍后重试");
    }
  };

  const handleCreateNewTopic = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const debouncedCreate = debounce(createNewTopic, 300);
      debouncedCreate();
    },
    [activeSessionId, activeTopicId, createTopic, switchTopic, router, message]
  );

  return (
    <Flex
      align="center"
      className={styles.newTopic}
      onClick={handleCreateNewTopic}
    >
      <Action
        className={styles.topicIcon}
        disabled={!activeSessionId}
        icon={MessageCirclePlus}
        showTooltip={false}
      />
      <span>新开会话</span>
    </Flex>
  );
});

export default NewTopic;

"use client";

import { GuideCard } from "@lobehub/ui";
import { useThemeMode } from "antd-style";
import React, { memo } from "react";
import { Flexbox } from "react-layout-kit";
import { Button } from "antd";
import { ChevronDown, Plus } from "lucide-react";
import { createStyles } from "antd-style";

import { imageUrl } from "@/const/base";
import { useFetchTopics } from "@/hooks/useFetchTopics";
import { useChatStore } from "@/store/chat";
import { topicSelectors } from "@/store/chat/selectors";
import { useUserStore } from "@/store/user";

import { SkeletonList } from "../SkeletonList";
import ShowMode from "./ShowMode";
import SearchResult from "./SearchResult";

const useStyles = createStyles(({ css }) => ({
  button: css`
    display: flex;
    height: 32px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: inherit;
    color: #000;
    flex: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  `,
  flexbox: css`
    padding: 0 8px;
    gap: 8px;
  `,
}));

const TopicListContent = memo(() => {
  const { isDarkMode } = useThemeMode();
  const { styles } = useStyles();
  const [topicsInit, topicLength] = useChatStore((s) => [
    s.topicsInit,
    topicSelectors.currentTopicLength(s),
  ]);
  const [isUndefinedTopics, isInSearchMode] = useChatStore((s) => [
    topicSelectors.isUndefinedTopics(s),
    topicSelectors.isInSearchMode(s),
  ]);

  const [visible, updateGuideState] = useUserStore((s) => [
    s.preference.guide?.topic,
    s.updateGuideState,
  ]);

  useFetchTopics();

  if (isInSearchMode) return <SearchResult />;

  // first time loading or has no data
  if (!topicsInit || isUndefinedTopics) return <SkeletonList />;

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        justify="space-between"
        className={styles.flexbox}
      >
        <Button
          type="default"
          className={styles.button}
        >
          全部员工<ChevronDown size={16}/>
        </Button>
        <Button
          type="default"
          icon={<Plus size={16} />}
          className={`${styles.button}`}
        >
          创建客户
        </Button>
      </Flexbox>
      {topicLength === 0 && visible && (
        <Flexbox paddingInline={8}>
          <GuideCard
            alt={"点击发送左侧按钮可将当前会话保存为历史话题，并开启新一轮会话"}
            cover={imageUrl(
              `empty_topic_${isDarkMode ? "dark" : "light"}.webp`
            )}
            coverProps={{
              priority: true,
            }}
            desc={
              "点击发送左侧按钮可将当前会话保存为历史话题，并开启新一轮会话"
            }
            height={120}
            onClose={() => {
              updateGuideState({ topic: false });
            }}
            style={{ flex: "none", marginBottom: 12 }}
            title={"话题列表"}
            visible={visible}
            width={200}
          />
        </Flexbox>
      )}
      {<ShowMode />}
    </>
  );
});

TopicListContent.displayName = "TopicListContent";

export default TopicListContent;

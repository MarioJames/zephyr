"use client";
import React, { Suspense, lazy } from "react";

import { DynamicLayoutProps } from "@/types/next";

import Desktop from "./_layout/Desktop";
import SkeletonList from "./features/SkeletonList";
import { Flexbox } from "react-layout-kit";
import { createStyles } from "antd-style";

import { Button } from "antd";
import { ChevronDown, Plus } from "lucide-react";

const TopicContent = lazy(() => import("./features/TopicListContent"));

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
    &:hover {
      background: #f0f0f0;
      color: #1677ff;
      border-color: #1677ff;
    }
  `,
  buttonPrimary: css`
    &.ant-btn-primary {
      background: #1677ff;
      color: #fff;
      border-color: #1677ff;
      &:hover {
        background: #0958d9;
        color: #fff;
        border-color: #0958d9;
      }
    }
  `,
  flexbox: css`
    padding: 0 8px;
    gap: 8px;
  `,
}));

const Topic = async (props: DynamicLayoutProps) => {
  const Layout = Desktop;
  const { styles } = useStyles();

  return (
    <>
      <Layout>
        <Suspense fallback={<SkeletonList />}>
          <Flexbox
            horizontal
            align="center"
            justify="space-between"
            className={styles.flexbox}
          >
            <Button
              type="default"
              icon={<ChevronDown size={16} style={{ marginRight: 4 }} />}
              className={styles.button}
            >
              全部员工
            </Button>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              创建客户
            </Button>
          </Flexbox>
          <TopicContent />
        </Suspense>
      </Layout>
    </>
  );
};

Topic.displayName = "ChatTopic";

export default Topic;

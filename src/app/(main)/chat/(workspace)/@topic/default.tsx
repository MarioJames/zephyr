import React, { Suspense, lazy } from "react";

import { DynamicLayoutProps } from "@/types/next";

import Desktop from "./_layout/Desktop";
import SkeletonList from "./features/SkeletonList";

const TopicContent = lazy(() => import("./features/TopicListContent"));

const Topic = async (props: DynamicLayoutProps) => {
  const Layout = Desktop;

  return (
    <>
      <Layout>
        <Suspense fallback={<SkeletonList />}>
          <TopicContent />
        </Suspense>
      </Layout>
    </>
  );
};

Topic.displayName = "ChatTopic";

export default Topic;

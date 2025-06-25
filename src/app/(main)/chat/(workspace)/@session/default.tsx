import React, { Suspense, lazy } from "react";

import { DynamicLayoutProps } from "@/types/next";

import Desktop from "./_layout/Desktop";
import SkeletonList from "./features/SkeletonList";

const SessionContent = lazy(() => import("./features/SessionListContent"));

const Session = async (props: DynamicLayoutProps) => {
  const Layout = Desktop;

  return (
    <>
      <Layout>
        <Suspense fallback={<SkeletonList />}>
          <SessionContent />
        </Suspense>
      </Layout>
    </>
  );
};

Session.displayName = "ChatSession";

export default Session;

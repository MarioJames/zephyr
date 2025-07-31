import React, { Suspense, lazy } from "react";


import Desktop from "./_layout/Desktop";
import SkeletonList from "./features/SkeletonList";
import ChatHydration from '../@conversation/features/ChatHydration';

const SessionContent = lazy(() => import("./features/SessionListContent"));

const Session = async () => {
  const Layout = Desktop;

  return (
    <Layout>
        <Suspense fallback={<SkeletonList />}>
          <SessionContent />
        </Suspense>
        <ChatHydration />
      </Layout>
  );
};

Session.displayName = "ChatSession";

export default Session;

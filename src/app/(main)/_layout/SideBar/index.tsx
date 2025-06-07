"use client";

import { SideNav } from "@lobehub/ui";
import { Suspense, memo } from "react";

import Avatar from "./Avatar";
// import PinList from "./PinList";
import TopActions from "./TopActions";
import { SidebarTabKey } from "@/store/global/initialState";

const Top = () => {
  return <TopActions isPinned={true} tab={SidebarTabKey.Chat} />;
};

const Nav = memo(() => {
  const showPinList = false;

  return (
    <SideNav
      avatar={
          <Avatar />
      }
      style={{
        height: "100%",
        zIndex: 100,
        background: "#0000000F",
        borderInlineEnd: 0,
        paddingBlockStart: 8,
      }}
      topActions={
        <Suspense>
            <Top />
            {/* {showPinList && <PinList />} */}
        </Suspense>
      }
      bottomActions={<></>}
    />
  );
});

Nav.displayName = "DesktopNav";

export default Nav;

"use client";

import { SideNav } from "@lobehub/ui";
import { Suspense, memo } from "react";
import Avatar from "./Avatar";
// import PinList from "./PinList";
import TopActions from "./TopActions";
import { SidebarTabKey } from "@/store/global/initialState";
import { usePathname } from 'next/navigation';

const pathToTab = (pathname: string) => {
  if (pathname.startsWith('/customer')) return SidebarTabKey.CustomerManagement;
  if (pathname.startsWith('/employee')) return SidebarTabKey.EmployeeManagement;
  if (pathname.startsWith('/chat')) return SidebarTabKey.Chat;
  return SidebarTabKey.Chat;
};

const Top = () => {
  const pathname = usePathname();
  return <TopActions isPinned={true} tab={pathToTab(pathname)} />;
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

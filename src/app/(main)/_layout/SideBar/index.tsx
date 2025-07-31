"use client";

import { SideNav } from "@lobehub/ui";
import { Suspense, memo } from "react";
import Avatar from "./Avatar";
import TopActions from "./TopActions";
import { SidebarTabKey } from "@/store/global/initialState";
import { usePathname } from "next/navigation";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css, token }) => ({
  sideNav: css`
    height: 100%;
    z-index: 100;
    background: ${token.colorSplit};
    border-inline-end: 0;
    padding-block-start: 8px;
  `,
}));

const pathToTab = (pathname: string) => {
  if (pathname.startsWith("/customer")) return SidebarTabKey.CustomerManagement;
  if (pathname.startsWith("/employee")) return SidebarTabKey.EmployeeManagement;
  if (pathname.startsWith("/file")) return SidebarTabKey.File;
  if (pathname.startsWith("/chat")) return SidebarTabKey.Chat;
  return SidebarTabKey.Chat;
};

const Top = () => {
  const pathname = usePathname();
  return <TopActions tab={pathToTab(pathname)} />;
};

const Nav = memo(() => {
  const { styles } = useStyles();

  return (
    <SideNav
      avatar={<Avatar />}
      bottomActions={null}
      className={styles.sideNav}
      topActions={
        <Suspense>
          <Top />
        </Suspense>
      }
    />
  );
});

Nav.displayName = "DesktopNav";

export default Nav;

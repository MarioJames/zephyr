import React from "react";
import SideBar from "./_layout/SideBar";
import { Flexbox } from "react-layout-kit";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Flexbox
      height={"100%"}
      horizontal
      style={{
        position: "relative",
      }}
      width={"100%"}
    >
      <SideBar />
      {children}
    </Flexbox>
  );
}

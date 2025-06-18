"use client";

import { ActionIcon } from "@lobehub/ui";
import { Search } from "lucide-react";
import { memo, useState } from "react";
import { Flexbox } from "react-layout-kit";

import SidebarHeader from "@/components/SidebarHeader";

import TopicSearchBar from "./TopicSearchBar";

const Header = memo(() => {
  const [showSearch, setShowSearch] = useState(false);

  return showSearch ? (
    <Flexbox padding={"12px 16px 4px"}>
      <TopicSearchBar onClear={() => setShowSearch(false)} />
    </Flexbox>
  ) : (
    <SidebarHeader
      actions={
        <>
          <ActionIcon
            icon={Search}
            onClick={() => setShowSearch(true)}
            size={"small"}
          />
        </>
      }
      title={`对话`}
    />
  );
});

export default Header;

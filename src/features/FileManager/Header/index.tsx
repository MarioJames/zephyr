"use client";

import { ChatHeader } from "@lobehub/ui/chat";
import { memo } from "react";

import FilesSearchBar from "./FilesSearchBar";
import UploadFileButton from "./UploadFileButton";

const Header = memo(() => {
  return (
    <ChatHeader
      left={<FilesSearchBar />}
      right={<UploadFileButton />}
      styles={{
        left: { padding: 0 },
      }}
    />
  );
});

export default Header;

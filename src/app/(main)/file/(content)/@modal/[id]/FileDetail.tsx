"use client";

import { memo, useEffect, useState } from "react";
import { Spin } from "antd";

import { fileCoreSelectors, useFileStore } from "@/store/file";
import { filesAPI } from "@/services";

import Detail from "../../../features/FileDetail";

const FileDetail = memo<{ id: string }>(({ id }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(id));
  const setFiles = useFileStore((state) => state.setFiles);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 如果没有文件数据，则获取文件详情
    if (!file) {
      setIsLoading(true);
      filesAPI
        .getFileDetail(id)
        .then((fileData) => {
          setFiles([fileData]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [file, id, setFiles]);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Spin />
        <div>数据加载中...</div>
      </div>
    );
  }

  if (!file) return null;

  return <Detail {...file} />;
});

export default FileDetail;

'use client';

import { Button, Dropdown, Icon } from '@lobehub/ui';
import { Upload } from 'antd';
import { css, cx } from 'antd-style';
import { FileUp, FolderUp, UploadIcon } from 'lucide-react';
import { useMemo } from 'react';

import DragUpload from '@/components/DragUpload';
import { useFileStore } from '@/store/file';

const hotArea = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: transparent;
  }
`;

interface UploadFileButtonProps {
  knowledgeBaseId?: string;
}

const UploadFileButton = ({ knowledgeBaseId }: UploadFileButtonProps) => {
  const pushDockFileList = useFileStore((s) => s.pushDockFileList);
  const items = useMemo(
    () => [
      {
        icon: <Icon icon={FileUp} />,
        key: 'upload-file',
        label: (
          <Upload
            beforeUpload={async (file) => {
              await pushDockFileList([file], knowledgeBaseId);
              return false;
            }}
            multiple={true}
            showUploadList={false}
          >
            <div className={cx(hotArea)}>上传文件</div>
          </Upload>
        ),
      },
      {
        icon: <Icon icon={FolderUp} />,
        key: 'upload-folder',
        label: (
          <Upload
            beforeUpload={async (file) => {
              await pushDockFileList([file], knowledgeBaseId);
              return false;
            }}
            directory
            multiple={true}
            showUploadList={false}
          >
            <div className={cx(hotArea)}>上传文件夹</div>
          </Upload>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button icon={UploadIcon}>上传</Button>
      </Dropdown>
      <DragUpload
        enabledFiles
        onUploadFiles={(files) => pushDockFileList(files, knowledgeBaseId)}
      />
    </>
  );
};

export default UploadFileButton;

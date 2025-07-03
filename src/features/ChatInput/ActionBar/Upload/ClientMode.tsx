import { ActionIcon } from '@lobehub/ui';
import { Upload } from 'antd';
import { FileUp, LucideImage } from 'lucide-react';
import { memo } from 'react';

import { useChatStore } from '@/store/chat';
import { modelCoreSelectors, useModelStore } from '@/store/model';

const FileUpload = memo(() => {
  const upload = useChatStore((s) => s.uploadChatFiles);
  const isUploading = useChatStore((s) => s.isUploading);

  const [supportFiles, supportVision] = useModelStore((s) => [
    modelCoreSelectors.currentModelSupportFiles(s),
    modelCoreSelectors.currentModelSupportVision(s),
  ]);

  const canUpload = supportFiles || supportVision;

  let title = '上传已禁用';
  if (isUploading) {
    title = '正在上传...';
  } else if (canUpload) {
    if (supportFiles) {
      title = '上传文件';
    } else {
      title = '上传图片';
    }
  }

  return (
    <Upload
      accept={supportFiles ? undefined : 'image/*'}
      beforeUpload={async (file) => {
        await upload([file]);
        return false;
      }}
      disabled={!canUpload || isUploading}
      multiple={true}
      showUploadList={false}
    >
      <ActionIcon
        disabled={!canUpload}
        icon={supportFiles ? FileUp : LucideImage}
        loading={isUploading}
        title={title}
        tooltipProps={{
          placement: 'bottom',
        }}
      />
    </Upload>
  );
});

export default FileUpload;

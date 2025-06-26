import { ActionIcon } from '@lobehub/ui';
import { Upload } from 'antd';
import { FileUp, LucideImage } from 'lucide-react';
import { memo } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentModelSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';

const FileUpload = memo(() => {
  const upload = useChatStore((s) => s.uploadChatFiles);
  const isUploading = useChatStore((s) => s.isUploading);

  const modelDetails = useAgentStore(agentModelSelectors.currentModelDetails);
  const { supportFiles: enabledFiles, supportVision: supportVision } = modelDetails || {};

  const canUpload = enabledFiles || supportVision;

  let title = '上传已禁用';
  if (isUploading) {
    title = '正在上传...';
  } else if (canUpload) {
    if (enabledFiles) {
      title = '上传文件';
    } else {
      title = '上传图片';
    }
  }

  return (
    <Upload
      accept={enabledFiles ? undefined : 'image/*'}
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
        icon={enabledFiles ? FileUp : LucideImage}
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

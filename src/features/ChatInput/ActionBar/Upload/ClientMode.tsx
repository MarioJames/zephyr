import { ActionIcon } from '@lobehub/ui';
import { Upload } from 'antd';
import { FileUp, LucideImage } from 'lucide-react';
import { memo } from 'react';

import { useModelSupportFiles } from '@/hooks/useModelSupportFiles';
import { useModelSupportVision } from '@/hooks/useModelSupportVision';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/slices/chat';
import { useFileStore } from '@/store/file';

const FileUpload = memo(() => {
  const upload = useFileStore((s) => s.uploadChatFiles);

  const model = useAgentStore(agentSelectors.currentAgentModel);
  const provider = useAgentStore(agentSelectors.currentAgentModelProvider);

  const enabledFiles = useModelSupportFiles(model, provider);
  const supportVision = useModelSupportVision(model, provider);
  const canUpload = enabledFiles || supportVision;

  let title = '上传已禁用';
  if (canUpload) {
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
      disabled={!canUpload}
      multiple={true}
      showUploadList={false}
    >
      <ActionIcon
        disabled={!canUpload}
        icon={enabledFiles ? FileUp : LucideImage}
        title={title}
        tooltipProps={{
          placement: 'bottom',
        }}
      />
    </Upload>
  );
});

export default FileUpload;

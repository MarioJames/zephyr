import { MenuProps, Tooltip } from '@lobehub/ui';
import { Upload } from 'antd';
import { css, cx } from 'antd-style';
import { FileUp, FolderUp, ImageUp, Paperclip } from 'lucide-react';
import { memo } from 'react';
import { useModelSupportVision } from '@/hooks/useModelSupportVision';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/slices/chat';
import { useFileStore } from '@/store/file';
import Action from '../components/Action';

const hotArea = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: transparent;
  }
`;

const FileUpload = memo(() => {
  const upload = useFileStore((s) => s.uploadChatFiles);

  const model = useAgentStore(agentSelectors.currentAgentModel);
  const provider = useAgentStore(agentSelectors.currentAgentModelProvider);

  const canUploadImage = useModelSupportVision(model, provider);

  const items: MenuProps['items'] = [
    {
      disabled: !canUploadImage,
      icon: ImageUp,
      key: 'upload-image',
      label: canUploadImage ? (
        <Upload
          accept={'image/*'}
          beforeUpload={async (file) => {
            await upload([file]);
            return false;
          }}
          multiple
          showUploadList={false}
        >
          <div className={cx(hotArea)}>上传图片</div>
        </Upload>
      ) : (
        <Tooltip placement={'right'} title={'图片上传已禁用'}>
          <div className={cx(hotArea)}>上传图片</div>
        </Tooltip>
      ),
    },
    {
      icon: FileUp,
      key: 'upload-file',
      label: (
        <Upload
          beforeUpload={async (file) => {
            if (!canUploadImage && file.type.startsWith('image')) return false;
            await upload([file]);
            return false;
          }}
          multiple
          showUploadList={false}
        >
          <div className={cx(hotArea)}>上传文件</div>
        </Upload>
      ),
    },
    {
      icon: FolderUp,
      key: 'upload-folder',
      label: (
        <Upload
          beforeUpload={async (file) => {
            if (!canUploadImage && file.type.startsWith('image')) return false;
            await upload([file]);
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
  ];

  return (
    <Action
      dropdown={{
        menu: { items },
      }}
      icon={Paperclip}
      showTooltip={false}
      title={'上传'}
    />
  );
});

export default FileUpload;

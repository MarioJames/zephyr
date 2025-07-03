import { MenuProps, Tooltip } from '@lobehub/ui';
import { Upload } from 'antd';
import { css, cx } from 'antd-style';
import { FileUp, FolderUp, ImageUp, Paperclip } from 'lucide-react';
import { memo } from 'react';
import { useFileStore } from '@/store/file';

import Action from '../components/Action';
import { modelCoreSelectors, useModelStore } from '@/store/model';

const hotArea = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: transparent;
  }
`;

const FileUpload = memo(() => {
  const upload = useFileStore((s) => s.uploadFiles);

  const [canUploadImage] = useModelStore((s) => [
    modelCoreSelectors.currentModelSupportVision(s),
  ]);

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
        <Tooltip placement={'right'} title='当前模型不支持视觉识别'>
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
      title='上传'
      icon={Paperclip}
      dropdown={{
        menu: { items },
      }}
      showTooltip={false}
    />
  );
});

export default FileUpload;

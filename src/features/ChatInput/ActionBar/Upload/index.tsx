import { MenuProps, Tooltip } from '@lobehub/ui';
import { App, Upload } from 'antd';
import { css, cx } from 'antd-style';
import { FileUp, FolderUp, ImageUp, Paperclip } from 'lucide-react';
import { memo } from 'react';
import { useChatStore } from '@/store/chat';
import {
  isDocumentFile,
  isSupportedFileType,
} from '@/utils/fileContextFormatter';

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
  const { message } = App.useApp();

  const { uploadChatFiles, uploadChatFilesAndParse } = useChatStore((s) => ({
    uploadChatFiles: s.uploadChatFiles,
    uploadChatFilesAndParse: s.uploadChatFilesAndParse,
  }));

  const [canUploadImage] = useModelStore((s) => [
    modelCoreSelectors.currentModelSupportVision(s),
  ]);

  const handleFileUpload = async (file: File) => {
    try {
      // 检查文件类型是否支持
      if (!isSupportedFileType(file)) {
        message.error(`不支持的文件类型: ${file.type}`);
        return false;
      }

      if (isDocumentFile(file)) {
        // 对于文档文件，使用一体化上传和解析接口
        try {
          const response = await uploadChatFilesAndParse({ file });


          if (response.parseResult.parseStatus === 'completed') {
            message.success(`文档 "${file.name}" 上传并解析成功`);
          } else {
            message.warning(`文档 "${file.name}" 上传成功，但解析失败`);
          }
        } catch (error) {
          message.error(`文件上传失败，已自动移除`);
        }
      } else {
        // 对于图片等非文档文件，只需要上传
        await uploadChatFiles(file);

        message.success(`文件 "${file.name}" 上传成功`);
      }
    } catch (error) {
      console.error('文件上传失败:', error);
      message.error(
        `文件上传失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }

    return false; // 阻止默认上传行为
  };

  const items: MenuProps['items'] = [
    {
      disabled: !canUploadImage,
      icon: ImageUp,
      key: 'upload-image',
      label: canUploadImage ? (
        <Upload
          accept={'image/*'}
          beforeUpload={handleFileUpload}
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
          accept={'.pdf,.docx,.xlsx,.txt,.md,.csv'}
          beforeUpload={async (file) => {
            console.log('file', file);
            if (!canUploadImage && file.type.startsWith('image/')) {
              message.error('当前模型不支持图片文件');
              return false;
            }

            handleFileUpload(file);

            return false;
          }}
          multiple
          showUploadList={false}
        >
          <div className={cx(hotArea)}>上传文档</div>
        </Upload>
      ),
    },
    {
      icon: FolderUp,
      key: 'upload-folder',
      label: (
        <Upload
          beforeUpload={async (file) => {
            if (!canUploadImage && file.type.startsWith('image/')) {
              message.error('当前模型不支持图片文件');
              return false;
            }

            handleFileUpload(file);

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

import { MenuProps, Tooltip } from '@lobehub/ui';
import { App, Upload } from 'antd';
import { createStyles } from 'antd-style';
import { FileUp, FolderUp, ImageUp, Paperclip, Files } from 'lucide-react';
import { memo, useState } from 'react';
import { useChatStore } from '@/store/chat';
import { isDocumentFile, isSupportedFileType } from '@/utils/file';

import Action from '../components/Action';
import { modelCoreSelectors, useModelStore } from '@/store/model';
import FileSelectModal from './FileSelectModal';
import { structuredDataAPI } from '@/services';

const useStyles = createStyles(({ css }) => ({
  hotArea: css`
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: transparent;
    }
  `,
}));

const FileUpload = memo(() => {
  const { message } = App.useApp();
  const { styles } = useStyles();
  const [fileSelectModalOpen, setFileSelectModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    uploadChatFiles,
    uploadChatFilesAndParse,
    batchGetFileAndParseContent,
  } = useChatStore((s) => ({
    uploadChatFiles: s.uploadChatFiles,
    uploadChatFilesAndParse: s.uploadChatFilesAndParse,
    batchGetFileAndParseContent: s.batchGetFileAndParseContent,
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

            // 上传成功后，开始解析文件的结构化数据
            await structuredDataAPI.upsertStructuredData(response.fileItem.id);
          } else {
            message.warning(`文档 "${file.name}" 上传成功，但解析失败`);
          }
        } catch {
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

  const handleFileSelect = async (fileIds: string[]) => {
    try {
      setLoading(true);

      await batchGetFileAndParseContent(fileIds);

      setFileSelectModalOpen(false);

      message.success(`获取文件和解析内容成功`);
    } catch (error) {
      console.error('获取文件和解析内容失败:', error);

      message.error(`获取文件和内容失败`);
    } finally {
      setLoading(false);
    }
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
          <div className={styles.hotArea}>上传图片</div>
        </Upload>
      ) : (
        <Tooltip placement={'right'} title='当前模型不支持视觉识别'>
          <div className={styles.hotArea}>上传图片</div>
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
          <div className={styles.hotArea}>上传文档</div>
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
          <div className={styles.hotArea}>上传文件夹</div>
        </Upload>
      ),
    },
    {
      icon: Files,
      key: 'select-file',
      label: (
        <div
          className={styles.hotArea}
          onClick={() => setFileSelectModalOpen(true)}
        >
          选择文件
        </div>
      ),
    },
  ];

  return (
    <>
      <Action
        dropdown={{
          menu: { items },
        }}
        icon={Paperclip}
        showTooltip={false}
        title='上传'
      />
      <FileSelectModal
        onClose={() => setFileSelectModalOpen(false)}
        onConfirm={handleFileSelect}
        open={fileSelectModalOpen}
        submitLoading={loading}
      />
    </>
  );
});

export default FileUpload;

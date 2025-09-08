'use client';

import { memo } from 'react';
import { createStyles } from 'antd-style';
import { ChatFileItem } from '@/store/chat/slices/upload/action';
import { Trash } from 'lucide-react';
import { Button, Spin } from 'antd';
import FileIcon from '@/components/FileIcon';
import { Image } from '@lobehub/ui';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    border-radius: 8px 8px 0 0;
    background: ${token.colorPrimaryBg};
    border: 1px solid ${token.colorBorder};
    border-bottom: none;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  fileList: css`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  `,
  fileItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: ${token.colorFillAlter};
    border-radius: 6px;
    border: 1px solid ${token.colorBorder};
    position: relative;
    width: 180px;
    min-height: 48px;
  `,
  fileIcon: css`
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${token.colorTextSecondary};
  `,
  fileInfo: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  `,
  fileName: css`
    font-size: 13px;
    font-weight: 500;
    color: ${token.colorText};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  fileSize: css`
    font-size: 11px;
    color: ${token.colorTextSecondary};
  `,
  uploadingOverlay: css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${token.colorBgBlur};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    backdrop-filter: blur(2px);
  `,
  removeButton: css`
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    color: ${token.colorError};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: ${token.colorFillSecondary};
    }
  `,
  loadingContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: ${token.colorTextSecondary};
    font-size: 12px;
  `,
  empty: css`
    display: none;
  `,
}));

interface UploadedFileListProps {
  files: Partial<ChatFileItem>[];
  isUploading: boolean;
  onRemoveFile: (id: string) => void;
}

const UploadedFileList = memo<UploadedFileListProps>(
  ({ files, isUploading, onRemoveFile }) => {
    const { styles } = useStyles();

    // 如果没有文件且不在上传，不显示容器
    if (files.length === 0 && !isUploading) {
      return null;
    }

    const getFileIcon = (file?: Partial<ChatFileItem>) => {
      const { fileType, url } = file || {};

      if (fileType?.startsWith('image/') && url) {
        return <Image alt='file' height={54} src={url} width={54} />;
      }

      return <FileIcon fileName={file?.name || ''} fileType={file?.fileType} />;
    };

    return (
      <div className={styles.container}>
        {isUploading && files.length === 0 && (
          <div className={styles.loadingContainer}>
            <Spin size='small' />
            <span style={{ marginLeft: 8 }}>正在准备上传...</span>
          </div>
        )}

        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((file) => (
              <div className={styles.fileItem} key={file.id || file.name}>
                {getFileIcon(file)}

                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>
                    {formatFileSize(file.size || 0)}
                  </div>
                </div>

                {/* 上传中的遮罩层 */}
                {file.status === 'uploading' && (
                  <div className={styles.uploadingOverlay}>
                    <Spin size='small' />
                  </div>
                )}

                {/* 删除按钮 - 只在上传成功后显示 */}
                {file.status === 'success' && file.id && (
                  <Button
                    className={styles.removeButton}
                    icon={<Trash size={12} />}
                    onClick={() => onRemoveFile(file.id!)}
                    size='small'
                    type='text'
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

UploadedFileList.displayName = 'UploadedFileList';

export default UploadedFileList;

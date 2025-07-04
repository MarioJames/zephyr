'use client';

import { memo } from 'react';
import { createStyles } from 'antd-style';
import { FileItem } from '@/services/files';
import { X, FileText, Image, Video, Upload, AlertCircle } from 'lucide-react';
import { Button } from 'antd';
import { Spin } from 'antd';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    margin-bottom: 8px;
    border-radius: 8px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    padding: 8px;
    min-height: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  fileList: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  fileItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: ${token.colorFillAlter};
    border-radius: 6px;
    border: 1px solid ${token.colorBorder};
    position: relative;
  `,
  fileIcon: css`
    flex-shrink: 0;
    width: 16px;
    height: 16px;
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
  fileStatus: css`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  `,
  statusText: css`
    font-size: 11px;
    color: ${token.colorTextSecondary};
  `,
  statusUploading: css`
    color: ${token.colorPrimary};
  `,
  statusSuccess: css`
    color: ${token.colorSuccess};
  `,
  statusError: css`
    color: ${token.colorError};
  `,
  removeButton: css`
    position: absolute;
    top: -4px;
    right: -4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
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
  previewImage: css`
    width: 32px;
    height: 32px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid ${token.colorBorder};
  `,
}));

interface UploadedFileListProps {
  files: FileItem[];
  isUploading: boolean;
  onRemoveFile: (id: string) => void;
}

const UploadedFileList = memo<UploadedFileListProps>(({ 
  files, 
  isUploading, 
  onRemoveFile 
}) => {
  const { styles } = useStyles();

  // 如果没有文件且不在上传，不显示容器
  if (files.length === 0 && !isUploading) {
    return null;
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className={styles.fileIcon} />;
    }
    if (fileType.startsWith('video/')) {
      return <Video className={styles.fileIcon} />;
    }
    return <FileText className={styles.fileIcon} />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Spin size="small" />;
      case 'success':
        return null;
      case 'error':
        return <AlertCircle size={14} className={styles.statusError} />;
      default:
        return <Upload size={14} className={styles.statusText} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待上传';
      case 'uploading':
        return '上传中';
      case 'success':
        return '上传成功';
      case 'error':
        return '上传失败';
      default:
        return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      {isUploading && files.length === 0 && (
        <div className={styles.loadingContainer}>
          <Spin size="small" />
          <span style={{ marginLeft: 8 }}>正在准备上传...</span>
        </div>
      )}
      
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              {file.previewUrl && file.fileType.startsWith('image/') ? (
                <img
                  src={file.previewUrl}
                  alt={file.filename}
                  className={styles.previewImage}
                />
              ) : (
                getFileIcon(file.fileType)
              )}
              
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{file.filename}</div>
                <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
              </div>
              
              <div className={styles.fileStatus}>
                {getStatusIcon(file.status)}
                <span 
                  className={`${styles.statusText} ${
                    file.status === 'uploading' ? styles.statusUploading :
                    file.status === 'success' ? styles.statusSuccess :
                    file.status === 'error' ? styles.statusError : ''
                  }`}
                >
                  {getStatusText(file.status)}
                </span>
              </div>
              
              <Button
                type="text"
                size="small"
                className={styles.removeButton}
                onClick={() => onRemoveFile(file.id)}
                icon={<X size={12} />}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default UploadedFileList;
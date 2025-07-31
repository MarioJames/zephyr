import { Modal } from '@lobehub/ui';
import { Button, Checkbox, Empty, Input, Pagination, Spin, Tag } from 'antd';
import { createStyles, cx } from 'antd-style';
import { FileIcon, SearchIcon } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import filesService, { FileItem } from '@/services/files';
import { useChatStore } from '@/store/chat';

interface FileSelectModalProps {
  submitLoading?: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: (fileIds: string[]) => void;
}

const useStyles = createStyles(({ css, token }) => ({
  searchBox: css`
    margin-bottom: 16px;
  `,
  list: css`
    height: 400px;
    overflow-y: auto;
  `,
  fileItem: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid ${token.colorBorder};
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
  `,
  fileInfo: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  pagination: css`
    margin-top: 16px;
    text-align: center;
  `,
  fileItemSelected: css`
    border-color: ${token.colorPrimary};
    background-color: ${token.colorBgContainer};
  `,
  fileItemInfo: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-weight: 500;
  `,
}));

const FileSelectModal = memo<FileSelectModalProps>(
  ({ open, onClose, onConfirm, submitLoading }) => {
    const { styles } = useStyles();

    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [total, setTotal] = useState(0);

    const fetchFiles = useCallback(
      async (page = 1, search = '') => {
        try {
          setLoading(true);
          const response = await filesService.getFileList({
            page,
            pageSize,
            search: search || null,
          });
          setFiles(response.files);
          setTotal(response.total);
          setCurrentPage(page);
        } catch (error) {
          console.error('获取文件列表失败:', error);
        } finally {
          setLoading(false);
        }
      },
      [pageSize]
    );

    useEffect(() => {
      if (open) {
        fetchFiles(1, searchText);

        // 弹窗打开时，实时获取已添加的文件ID并设置为选中状态
        setSelectedFileIds(
          useChatStore
            .getState()
            .chatUploadFileList.filter((file) => file.id)
            .map((file) => file.id!) || []
        );
      }
    }, [open, fetchFiles, searchText]);

    const handleSearch = useCallback((value: string) => {
      setSearchText(value);
      setCurrentPage(1);
    }, []);

    const handleFileSelect = useCallback((fileId: string) => {
      setSelectedFileIds((prev) =>
        prev.includes(fileId)
          ? prev.filter((id) => id !== fileId)
          : [...prev, fileId]
      );
    }, []);

    const handleSelectAll = useCallback(
      (checked: boolean) => {
        if (checked) {
          setSelectedFileIds(files.map((file) => file.id));
        } else {
          setSelectedFileIds([]);
        }
      },
      [files]
    );

    const handlePageChange = useCallback(
      (page: number) => {
        fetchFiles(page, searchText);
      },
      [fetchFiles, searchText]
    );

    const handleConfirm = useCallback(() => {
      onConfirm(selectedFileIds);
    }, [selectedFileIds, onConfirm, onClose]);

    const handleCancel = useCallback(() => {
      setSelectedFileIds([]);
      setSearchText('');
      setCurrentPage(1);
      onClose();
    }, [onClose]);

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
      if (fileType.startsWith('image/')) {
        return <FileIcon size={20} style={{ color: '#52c41a' }} />;
      }
      if (fileType.includes('pdf')) {
        return <FileIcon size={20} style={{ color: '#ff4d4f' }} />;
      }
      if (fileType.includes('word') || fileType.includes('document')) {
        return <FileIcon size={20} style={{ color: '#1890ff' }} />;
      }
      if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
        return <FileIcon size={20} style={{ color: '#52c41a' }} />;
      }
      return <FileIcon size={20} style={{ color: '#8c8c8c' }} />;
    };

    const allSelected =
      files.length > 0 && selectedFileIds.length === files.length;
    const indeterminate =
      selectedFileIds.length > 0 && selectedFileIds.length < files.length;

    return (
      <Modal
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>已选择 {selectedFileIds.length} 个文件</div>
            <div>
              <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button
                disabled={selectedFileIds.length === 0}
                loading={submitLoading}
                onClick={handleConfirm}
                type='primary'
              >
                确定
              </Button>
            </div>
          </div>
        }
        onCancel={handleCancel}
        open={open}
        title='选择文件'
        width={800}
      >
        <div style={{ overflowY: 'hidden' }}>
          <Input.Search
            allowClear
            className={styles.searchBox}
            onSearch={handleSearch}
            placeholder='搜索文件名...'
            prefix={<SearchIcon size={16} />}
          />
          {files.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Checkbox
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                全选
              </Checkbox>
            </div>
          )}

          <Spin spinning={loading}>
            <div className={styles.list}>
              {files.length === 0 ? (
                <Empty
                  description='暂无文件'
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                files.map((file) => (
                  <div
                    className={cx(styles.fileItem, {
                      selected: selectedFileIds.includes(file.id),
                    })}
                    key={file.id}
                    onClick={() => handleFileSelect(file.id)}
                  >
                    <Checkbox
                      checked={selectedFileIds.includes(file.id)}
                      onChange={() => handleFileSelect(file.id)}
                    />
                    {getFileIcon(file.fileType)}
                    <div className={styles.fileInfo}>
                      <div style={{ fontWeight: 500 }}>{file.filename}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {formatFileSize(file.size)} •{' '}
                        {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Tag color='blue'>{file.fileType}</Tag>
                  </div>
                ))
              )}
            </div>
          </Spin>

          {total > pageSize && (
            <Pagination
              current={currentPage}
              onChange={handlePageChange}
              pageSize={pageSize}
              showQuickJumper
              showSizeChanger={false}
              showTotal={(total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }
              style={{ marginTop: 16, textAlign: 'center' }}
              total={total}
            />
          )}
        </div>
      </Modal>
    );
  }
);

export default FileSelectModal;

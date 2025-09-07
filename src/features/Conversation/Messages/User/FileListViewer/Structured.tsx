import React from 'react';
import { Modal } from '@lobehub/ui';
import {
  Button,
  Descriptions,
  Empty,
  Flex,
  Popconfirm,
  Typography,
} from 'antd';
import { createStyles } from 'antd-style';
import { useQuery } from '@tanstack/react-query';
import { structuredDataAPI } from '@/services';
import { FileItem as FileItemType } from '@/services/files';
import { downloadFile } from '@/utils/file';

export interface StructuredProps {
  file?: FileItemType;
  open: boolean;
  onClose: () => void;
}

const useStyles = createStyles(({ token }) => ({
  sketchLabel: {
    width: 80,
    height: 16,
    background: token.colorFill,
    borderRadius: 4,
  },
  sketchValue: {
    width: 190,
    height: 16,
    background: token.colorFill,
    borderRadius: 4,
  },

  alert: {
    marginTop: 16,
    color: token.colorTextDescription,
    fontSize: token.fontSizeSM,
  },
}));

const Structured = ({ file, open, onClose }: StructuredProps) => {
  const { styles } = useStyles();
  const { isLoading, data: structuredData } = useQuery({
    queryKey: ['structuredData', file?.id],
    queryFn: async () => {
      if (!file?.id) return null;

      const structuredData = await structuredDataAPI.getStructuredDataByFileId(
        file.id
      );

      return structuredData;
    },
  });

  const handleRegenerate = async () => {
    if (!file?.id) return;

    await structuredDataAPI.upsertStructuredData(file.id);
  };

  return (
    <Modal
      open={open}
      width={600}
      onCancel={onClose}
      closeIcon={false}
      title={'内容摘要'}
      footer={
        <Flex gap={16} justify='flex-end'>
          <Popconfirm
            title='确定重新生成内容摘要吗？'
            onConfirm={handleRegenerate}
          >
            <Button danger>重新生成</Button>
          </Popconfirm>
          <Button
            type='primary'
            onClick={() => downloadFile(file!.url, file!.name)}
          >
            下载文件
          </Button>
          <Button type='default' onClick={onClose}>
            关闭
          </Button>
        </Flex>
      }
    >
      <Descriptions column={2}>
        {/* 骨架屏占位符 */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Descriptions.Item
              key={index}
              label={<div className={styles.sketchLabel} />}
            >
              <div className={styles.sketchValue} />
            </Descriptions.Item>
          ))}
        {structuredData?.data?.length ? (
          structuredData?.data.map((item) => {
            const content = Array.isArray(item.value)
              ? item.value.join(',')
              : item.value;

            return (
              <Descriptions.Item key={item.label} label={item.label}>
                <Typography.Text ellipsis={{ tooltip: content }}>
                  {content}
                </Typography.Text>
              </Descriptions.Item>
            );
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无内容' />
        )}
      </Descriptions>
      <p className={styles.alert}>* 内容由程序自动生成，仅供参考</p>
    </Modal>
  );
};

export default Structured;

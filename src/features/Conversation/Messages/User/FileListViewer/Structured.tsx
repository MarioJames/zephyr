import React from 'react';
import { Modal } from '@lobehub/ui';
import { Button, Descriptions, Flex, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { structuredDataAPI } from '@/services';

export interface StructuredProps {
  fileId?: string;
  open: boolean;
  onClose: () => void;
}

const Structured = ({ fileId, open, onClose }: StructuredProps) => {
  const { isLoading, data: structuredData } = useQuery({
    queryKey: ['structuredData', fileId],
    queryFn: async () => {
      if (!fileId) return null;

      const structuredData =
        await structuredDataAPI.getStructuredDataByFileId(fileId);

      return structuredData;
    },
  });

  const handleRegenerate = async () => {
    if (!fileId) return;

    await structuredDataAPI.upsertStructuredData(fileId);
  };

  return (
    <Modal
      open={open}
      width={600}
      onCancel={onClose}
      title='结构化数据'
      footer={
        <Flex gap={16}>
          <Button danger onClick={handleRegenerate}>
            重新生成
          </Button>
          <Button type='primary' onClick={onClose}>
            关闭
          </Button>
        </Flex>
      }
    >
      <Spin spinning={isLoading}>
        <Descriptions column={2}>
          {structuredData?.data.map((item) => (
            <Descriptions.Item key={item.label} label={item.label}>
              {Array.isArray(item.value) ? item.value.join(',') : item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default Structured;

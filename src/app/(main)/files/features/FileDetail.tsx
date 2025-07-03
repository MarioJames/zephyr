'use client';

import { Icon, Tag } from '@lobehub/ui';
import { Descriptions, Divider } from 'antd';
import { useTheme } from 'antd-style';
import dayjs from 'dayjs';
import { BoltIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { FileListItem } from '@/types/files';
import { formatSize } from '@/utils/format';

export const DETAIL_PANEL_WIDTH = 300;

const embeddingStatusMap = {
  default: '暂未向量化',
  error: '失败',
  pending: '待启动',
  processing: '进行中',
  success: '已完成',
};

const FileDetail = memo<FileListItem>((props) => {
  const { name, embeddingStatus, size, createdAt, updatedAt, chunkCount } = props || {};
  const theme = useTheme();

  if (!props) return null;

  const items = [
    { children: name, key: 'name', label: '文件名' },
    { children: formatSize(size), key: 'size', label: '文件大小' },
    {
      children: name.split('.').pop()?.toUpperCase(),
      key: 'type',
      label: '格式',
    },

    {
      children: dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
      key: 'createdAt',
      label: '创建时间',
    },
    {
      children: dayjs(updatedAt).format('YYYY-MM-DD HH:mm'),
      key: 'updatedAt',
      label: '更新时间',
    },
  ];

  const dataItems = [
    {
      children: (
        <Tag bordered={false} icon={<Icon icon={BoltIcon} />}>
          {' '}
          {chunkCount}
        </Tag>
      ),
      key: 'chunkCount',
      label: '分块数',
    },
    {
      children: (
        <Tag bordered={false} color={embeddingStatus || 'default'}>
          {embeddingStatusMap[embeddingStatus || 'default']}
        </Tag>
      ),
      key: 'embeddingStatus',
      label: '向量化',
    },
  ];

  return (
    <Flexbox
      padding={16}
      style={{ borderInlineStart: `1px solid ${theme.colorSplit}` }}
      width={DETAIL_PANEL_WIDTH}
    >
      <Descriptions
        colon={false}
        column={1}
        items={items}
        labelStyle={{ width: 120 }}
        size={'small'}
        title={'基本信息'}
      />
      <Divider />
      <Descriptions
        colon={false}
        column={1}
        items={dataItems}
        labelStyle={{ width: 120 }}
        size={'small'}
      />
    </Flexbox>
  );
});

export default FileDetail;

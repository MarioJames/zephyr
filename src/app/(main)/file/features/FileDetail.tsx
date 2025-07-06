'use client';

import { Descriptions } from 'antd';
import { useTheme } from 'antd-style';
import dayjs from 'dayjs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { FileItem } from '@/services/files';
import { formatSize } from '@/utils/format';

export const DETAIL_PANEL_WIDTH = 300;

const FileDetail = memo<FileItem>((props) => {
  const { filename, size, createdAt, updatedAt } = props || {};
  console.log('FileDetail', props);
  const theme = useTheme();

  if (!props) return null;

  const items = [
    { children: filename, key: 'filename', label: '文件名' },
    { children: formatSize(size), key: 'size', label: '文件大小' },
    {
      children: filename.split('.').pop()?.toUpperCase(),
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
    </Flexbox>
  );
});

export default FileDetail;

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
  const { name, size, updatedAt } = props || {};
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
        size={'small'}
        styles={{
          label: { width: 120 },
        }}
        title={'基本信息'}
      />
    </Flexbox>
  );
});

export default FileDetail;

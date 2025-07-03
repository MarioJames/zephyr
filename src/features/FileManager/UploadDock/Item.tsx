'use client';

import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { ReactNode, memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileIcon from '@/components/FileIcon';
import { UploadFileItem } from '@/app/(main)/files/type';
import { formatSize, formatSpeed, formatTime } from '@/utils/format';

const useStyles = createStyles(({ css, token }) => {
  return {
    progress: css`
      position: absolute;
      inset-block: 0 0;
      inset-inline: 0 1%;

      height: 100%;
      border-block-end: 3px solid ${token.geekblue};

      background: ${token.colorFillTertiary};
    `,
    title: css`
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;

      font-size: 15px;
      text-overflow: ellipsis;
    `,
  };
});

type UploadItemProps = UploadFileItem;

const UploadItem = memo<UploadItemProps>(({ file, status, uploadState }) => {
  const { styles } = useStyles();
  const { type, name, size } = file;

  const desc: ReactNode = useMemo(() => {
    switch (status) {
      case 'uploading': {
        const textArray = [
          uploadState?.speed ? formatSpeed(uploadState.speed) : '',
          uploadState?.restTime ? `剩余 ${formatTime(uploadState?.restTime)}` : '',
        ].filter(Boolean);

        return (
          <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
            {uploadState?.progress ? formatSize(size * (uploadState.progress / 100)) : '-'}/
            {formatSize(size)}
            {textArray.length === 0 ? '' : ' · ' + textArray.join(' · ')}
          </Typography.Text>
        );
      }
      case 'pending': {
        return (
          <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
            {formatSize(size)} · 准备上传...
          </Typography.Text>
        );
      }

      case 'processing': {
        return (
          <Text style={{ fontSize: 12 }} type={'secondary'}>
            {formatSize(size)} · 文件处理中...
          </Text>
        );
      }

      case 'success': {
        return (
          <Text style={{ fontSize: 12 }} type={'secondary'}>
            {formatSize(size)} · 已上传
          </Text>
        );
      }
      case 'error': {
        return (
          <Text style={{ fontSize: 12 }} type={'danger'}>
            {formatSize(size)} · 上传失败，请重试
          </Text>
        );
      }
      default: {
        return '';
      }
    }
  }, [status, uploadState]);

  return (
    <Flexbox
      align={'center'}
      gap={4}
      horizontal
      key={name}
      paddingBlock={8}
      paddingInline={12}
      style={{ position: 'relative' }}
    >
      <FileIcon fileName={name} fileType={type} />
      <Flexbox style={{ overflow: 'hidden' }}>
        <div className={styles.title}>{name}</div>
        {desc}
      </Flexbox>

      {status === 'uploading' && !!uploadState && (
        <div
          className={styles.progress}
          style={{ insetInlineEnd: `${100 - uploadState.progress}%` }}
        />
      )}
    </Flexbox>
  );
});

export default UploadItem;

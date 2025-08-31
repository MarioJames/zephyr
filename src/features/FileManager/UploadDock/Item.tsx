'use client';

import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { ReactNode, memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileIcon from '@/components/FileIcon';
import { UploadFileItem } from '@/types/file';
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

const UploadItem = memo<UploadItemProps>((props: UploadItemProps) => {
  const { styles } = useStyles();

  const { fileType, name, size, status, uploadState } = props;

  const desc: ReactNode = useMemo(() => {
    switch (status) {
      case 'uploading': {
        const textArray = [
          uploadState?.speed ? formatSpeed(uploadState.speed) : '',
          uploadState?.restTime
            ? `剩余 ${formatTime(uploadState?.restTime)}`
            : '',
        ].filter(Boolean);

        return (
          <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
            {uploadState?.progress
              ? formatSize(size * (uploadState.progress / 100))
              : '-'}
            /{formatSize(size)}
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
          <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
            {formatSize(size)} · 文件处理中...
          </Typography.Text>
        );
      }

      case 'success': {
        return (
          <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
            {formatSize(size)} · 已上传
          </Typography.Text>
        );
      }
      case 'error': {
        return (
          <Typography.Text style={{ fontSize: 12 }} type={'danger'}>
            {formatSize(size)} · 上传失败，请重试
          </Typography.Text>
        );
      }
      default: {
        return '';
      }
    }
  }, [status, uploadState, size]);

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
      <FileIcon fileName={name} fileType={fileType} />
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

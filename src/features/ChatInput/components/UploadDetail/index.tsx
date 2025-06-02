import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileParsingStatus from '@/components/FileParsingStatus';
import { FileParsingTask } from '@/types/asyncTask';
import { FileUploadState, FileUploadStatus } from '@/types/files';

import UploadStatus from './UploadStatus';

const useStyles = createStyles(({ css }) => ({
  status: css`
    &.ant-tag {
      padding-inline: 0;
      background: none;
    }
  `,
}));

interface UploadDetailProps {
  size: number;
  status: FileUploadStatus;
  tasks?: FileParsingTask;
  uploadState?: FileUploadState;
}

const UploadDetail = memo<UploadDetailProps>(({ uploadState, status, size, tasks }) => {
  const { styles } = useStyles();

  return (
    <Flexbox align={'center'} gap={8} height={22} horizontal>
      <UploadStatus size={size} status={status} uploadState={uploadState} />
      {!!tasks && Object.keys(tasks).length === 0 ? (
        <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
          准备分块...
        </Typography.Text>
      ) : (
        <div>
          <FileParsingStatus {...tasks} className={styles.status} hideEmbeddingButton />
        </div>
      )}
    </Flexbox>
  );
});

export default UploadDetail;

import { Skeleton } from 'antd';
import { Flexbox } from 'react-layout-kit';

import { FILE_DATE_WIDTH, FILE_SIZE_WIDTH } from './FileListItem';

const FileSkeleton = () => (
  <Flexbox style={{ marginInline: 24,padding:'0 8px' }}>
    {Array.from({ length: 4 }).map((_, index) => (
      <Flexbox align={'center'} distribution={'space-between'} height={64} horizontal key={index}>
        <Flexbox align={'center'} flex={1} gap={12} horizontal>
          <Skeleton.Avatar active shape={'square'} size={48} />
          <Skeleton.Button active style={{ height: 20, width: 300 }} />
        </Flexbox>
        <Flexbox width={FILE_DATE_WIDTH}>
          <Skeleton.Button active style={{ height: 20 }} />
        </Flexbox>
        <Flexbox width={FILE_SIZE_WIDTH}>
          <Skeleton.Button active style={{ height: 20 }} />
        </Flexbox>
      </Flexbox>
    ))}
  </Flexbox>
);

export default FileSkeleton;

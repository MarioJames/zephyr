'use client';

import { createStyles } from 'antd-style';
import { useQueryState } from 'nuqs';
import { rgba } from 'polished';
import { memo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import { Virtuoso } from 'react-virtuoso';

import { useFileStore } from '@/store/file';

import EmptyStatus from './EmptyStatus';
import FileListItem, { FILE_DATE_WIDTH, FILE_SIZE_WIDTH } from './FileListItem';
import FileSkeleton from './FileSkeleton';

enum SortType {
  Asc = 'asc',
  Desc = 'desc',
}

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  header: css`
    height: 40px;
    min-height: 40px;
    border-block-end: 1px solid ${isDarkMode ? token.colorSplit : rgba(token.colorSplit, 0.06)};
    color: ${token.colorTextDescription};
  `,
  headerItem: css`
    padding-block: 0;
    padding-inline: 0 24px;
  `,
  total: css`
    padding-block-end: 12px;
    border-block-end: 1px solid ${isDarkMode ? token.colorSplit : rgba(token.colorSplit, 0.06)};
  `,
}));

interface FileListProps {
  category?: string;
}

const FileList = memo<FileListProps>(({ category }) => {
  const { styles } = useStyles();

  const [selectFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [viewConfig, setViewConfig] = useState({ showFilesInKnowledgeBase: false });

  const [query] = useQueryState('q', {
    clearOnDefault: true,
  });

  const [sorter] = useQueryState('sorter', {
    clearOnDefault: true,
    defaultValue: 'createdAt',
  });
  const [sortType] = useQueryState('sortType', {
    clearOnDefault: true,
    defaultValue: SortType.Desc,
  });

  const useFetchFileManage = useFileStore((s) => s.useFetchFileManage);

  const { data, isLoading } = useFetchFileManage({
    search: query,
    page: 1,
    pageSize: 20,
    fileType: 'all',
  });

  return !isLoading && data?.length === 0 ? (
    <EmptyStatus />
  ) : (
    <Flexbox height={'100%'}>
      <Flexbox style={{ fontSize: 12, marginInline: 24 }}>
        <Flexbox align={'center'} className={styles.header} horizontal paddingInline={8}>
          <Flexbox className={styles.headerItem} flex={1} style={{ paddingInline: 32 }}>
            文件
          </Flexbox>
          <Flexbox className={styles.headerItem} width={FILE_DATE_WIDTH}>
            创建时间
          </Flexbox>
          <Flexbox className={styles.headerItem} width={FILE_SIZE_WIDTH}>
            大小
          </Flexbox>
        </Flexbox>
      </Flexbox>
      {isLoading ? (
        <FileSkeleton />
      ) : (
        <Virtuoso
          components={{
            Footer: () => (
              <Center style={{ height: 64 }}>
                <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                  已经到底啦
                </div>
              </Center>
            ),
          }}
          data={data}
          itemContent={(index, item) => (
            <FileListItem
              index={index}
              key={item.id}
              onSelectedChange={(id, checked) => {
                setSelectedFileIds((prev) => {
                  if (checked) {
                    return [...prev, id];
                  }
                  return prev.filter((item) => item !== id);
                });
              }}
              selected={selectFileIds.includes(item.id)}
              {...item}
            />
          )}
          style={{ flex: 1 }}
        />
      )}
    </Flexbox>
  );
});

export default FileList;

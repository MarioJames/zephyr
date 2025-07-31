'use client';

import { createStyles } from 'antd-style';
import { useQueryState } from 'nuqs';
import { rgba } from 'polished';
import { memo, useState, useEffect, useCallback } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import { Virtuoso } from 'react-virtuoso';
import { Spin } from 'antd';

import { useFileStore } from '@/store/file';
import { FileItem } from '@/services/files';

import EmptyStatus from './EmptyStatus';
import FileListItem, { FILE_DATE_WIDTH, FILE_SIZE_WIDTH } from './FileListItem';
import FileSkeleton from './FileSkeleton';

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
  loadingMore: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    color: ${token.colorTextDescription};
    font-size: 12px;
  `,
}));

interface FileListProps {
  category?: string;
}

const FileList = memo<FileListProps>(({ category }) => {
  const { styles } = useStyles();

  const [query] = useQueryState('q', {
    clearOnDefault: true,
  });

  const fetchFileManage = useFileStore((s) => s.useFetchFileManage);
  const loading = useFileStore((s) => s.loading);
  const pagination = useFileStore((s) => s.pagination);
  const [fileData, setFileData] = useState<FileItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchData = useCallback(async (page: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setIsFirstLoad(true);
    }

    try {
      const result = await fetchFileManage({
        search: query,
        page,
        pageSize: pagination.pageSize,
        fileType: category === 'all' ? undefined : category,
      });

      if (append) {
        setFileData((prev) => [...prev, ...result.data]);
      } else {
        setFileData(result.data);
      }

      setHasMore(result.data.length === pagination.pageSize);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setIsFirstLoad(false);
      }
    }
  }, [fetchFileManage, query, category, pagination.pageSize]);

  // 监听查询条件变化
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return !loading && fileData.length === 0 ? (
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
      {loading && isFirstLoad ? (
        <FileSkeleton />
      ) : (
        <Virtuoso
          components={{
            Footer: () => (
              <Center style={{ height: 64 }}>
                {loadingMore ? (
                  <div className={styles.loadingMore}>
                    <Spin size="small" style={{ marginRight: 8 }} />
                    加载更多...
                  </div>
                ) : !hasMore ? (
                  <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                    已经到底啦
                  </div>
                ) : null}
              </Center>
            ),
          }}
          data={fileData}
          endReached={() => {
            if (!loadingMore && hasMore) {
              const nextPage = Math.floor(fileData.length / pagination.pageSize) + 1;
              fetchData(nextPage, true);
            }
          }}
          itemContent={(index, item) => {
            return (
              <FileListItem
                index={index}
                key={item.id}
                onDelete={() => fetchData(1)}
                {...item}
              />
            )
          }}
          style={{ flex: 1 }}
        />
      )}
    </Flexbox>
  );
});

export default FileList;

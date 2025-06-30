import { Skeleton } from 'antd';
import { Button } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';

const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0;
    width: 100%;
    min-height: 500px;
    background: transparent;
  `,
  listsWrapper: css`
    display: flex;
    flex-direction: row;
    gap: 32px;
    width: 100%;
    flex: 1;
  `,
  list: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 180px;
  `,
  buttonBar: css`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    width: 100%;
    background: transparent;
  `,
}));

const ListSkeleton = memo(() => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton
        key={i}
        active
        title={false}
        paragraph={{ rows: 1, width: '100%' }}
        style={{ height: 32, marginBottom: 0 }}
      />
    ))}
  </>
));

const SkeletonList = memo(() => {
  const { styles } = useStyles();
  return (
    <div className={styles.container}>
      <div className={styles.listsWrapper}>
        <div className={styles.list}>
          <ListSkeleton />
        </div>
        <div className={styles.list}>
          <ListSkeleton />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <Button shape="round" disabled style={{ width: 80 }} />
        <Button type="primary" shape="round" disabled style={{ width: 80 }} />
      </div>
    </div>
  );
});

export default SkeletonList;

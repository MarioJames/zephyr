import { Skeleton, Button } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';

const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: row;
    gap: 32px;
    width: 100%;
    min-height: 260px;
    position: relative;
    background: transparent;
  `,
  list: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 180px;
  `,
  buttonBar: css`
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 12px;
    padding: 16px 0 0 0;
    background: transparent;
  `,
}));

const ListSkeleton = memo(() => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton
        key={i}
        active
        title={false}
        paragraph={{ rows: 1, width: '80%' }}
        style={{ height: 32, marginBottom: 0 }}
      />
    ))}
  </>
));

const SkeletonList = memo(() => {
  const { styles } = useStyles();
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <ListSkeleton />
      </div>
      <div className={styles.list}>
        <ListSkeleton />
      </div>
      <div className={styles.buttonBar}>
        <Button shape="round" disabled style={{ width: 80 }} />
        <Button type="primary" shape="round" disabled style={{ width: 80 }} />
      </div>
    </div>
  );
});

export default SkeletonList;

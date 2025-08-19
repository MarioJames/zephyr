import React from 'react';
import { Skeleton, Row, Col } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { useAIHintStyles } from '../style';

export const SingleSkeleton = () => {
  const { styles } = useAIHintStyles();

  return (
    <Flexbox>
      {/* 日期分割线 */}
      <div className={styles.dividerDate}>
        <div className={styles.dividerLine} />
        <Skeleton.Button size='small' style={{ width: 120 }} />
        <div className={styles.dividerLine} />
      </div>

      {/* 上方提示语 */}
      <Skeleton paragraph={{ rows: 1 }} title={false} />

      {/* 知识点卡片 */}
      <Row className={styles.cardGrid} gutter={[8, 8]}>
        {[1, 2, 3, 4].map((i) => (
          <Col key={i} span={12}>
            <div className={styles.cardItem}>
              <Skeleton
                active
                paragraph={{ rows: 2 }}
                title={{ width: '40%' }}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* 推荐话术 */}
      <div className={styles.suggestTitle}>
        <Skeleton.Button size='small' style={{ width: 100 }} />
      </div>

      {/* 话术卡片 */}
      {[1, 2].map((i) => (
        <div className={styles.sectionCard} key={i}>
          <Skeleton active paragraph={{ rows: 3 }} title={{ width: '30%' }} />
        </div>
      ))}
    </Flexbox>
  );
};

const SkeletonList = () => {
  return (
    <Flexbox gap={24}>
      <SingleSkeleton />
      <SingleSkeleton />
    </Flexbox>
  );
};

export default SkeletonList;

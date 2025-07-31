import React from 'react';
import { Skeleton } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { useHistoryStyles } from '../style';

const SkeletonList = () => {
  const { styles } = useHistoryStyles();

  return (
    <Flexbox gap={16} padding={16}>
      {/* 历史会话项 */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div className={styles.historyItem} key={i}>
          <Flexbox horizontal justify="space-between">
            <Flexbox>
              {/* 标题 */}
              <Skeleton.Button
                active
                style={{
                  width: '220px',
                  height: '24px',
                  marginBottom: '8px',
                }}
              />
              {/* 元信息 */}
              <Flexbox gap={8} horizontal>
                <Skeleton.Button
                  active
                  size="small"
                  style={{
                    width: '60px',
                    height: '16px',
                  }}
                />
                <Skeleton.Button
                  active
                  size="small"
                  style={{
                    width: '100px',
                    height: '16px',
                  }}
                />
              </Flexbox>
            </Flexbox>
            {/* 消息数量 */}
            <Skeleton.Button
              active
              style={{
                height: '24px',
              }}
            />
          </Flexbox>
        </div>
      ))}
    </Flexbox>
  );
};

export default SkeletonList;

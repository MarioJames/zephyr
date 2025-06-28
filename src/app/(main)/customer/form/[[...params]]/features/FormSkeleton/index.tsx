'use client';

import React, { memo } from 'react';
import { Skeleton, Divider } from 'antd';
import { useFormSkeletonStyles } from './styles';

const FormSkeleton = memo(() => {
  const { styles } = useFormSkeletonStyles();

  return (
    <div className={styles.container}>
      {/* 表单容器 */}
      <div className={styles.formContainer}>
        {/* 客户类型选择区域 */}
        <div className={styles.typeSelector}>
          <Skeleton.Input
            active
            size='default'
            style={{ width: 120, height: 24, marginBottom: 16 }}
          />
          <div className={styles.typeGrid}>
            <Skeleton className={styles.typeCard} active paragraph={false} />
            <Skeleton className={styles.typeCard} active paragraph={false} />
            <Skeleton className={styles.typeCard} active paragraph={false} />
          </div>
        </div>

        <Divider className={styles.divider} />

        {/* 头像上传区域 */}
        <div className={styles.avatarSection}>
          <Skeleton.Avatar active size={80} />
          <div>
            <Skeleton.Input
              active
              size='default'
              style={{ width: 80, marginBottom: 8 }}
            />
          </div>
        </div>

        <Divider className={styles.divider} />

        <Skeleton paragraph={{ rows: 1 }} active />

        {/* 底部按钮组 */}
        <div className={styles.buttonGroup}>
          <Skeleton.Button active className={styles.button} />
          <Skeleton.Button active className={styles.button} />
        </div>
      </div>
    </div>
  );
});

FormSkeleton.displayName = 'FormSkeleton';

export default FormSkeleton;

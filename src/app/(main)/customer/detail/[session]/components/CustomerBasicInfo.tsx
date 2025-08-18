import React from 'react';
import { createStyles } from 'antd-style';
import { CustomerExtend } from '@/types/customer';

const useStyles = createStyles(({ css, token }) => ({
  infoBox: css`
    flex: 1;
    height: 148px;
    padding: 16px;
    background-color: ${token.colorFillAlter};
    border: 1px solid ${token.colorBorder};
    border-radius: 4px;
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  `,
  infoTitle: css`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  `,
  infoItem: css`
    margin-bottom: 8px;
    display: flex;
    font-size: 14px;
    font-weight: 400;
  `,
  infoLabel: css`
    color: ${token.colorText};
    margin-right: 8px;
    min-width: 70px;
  `,
  infoValue: css`
    color: ${token.colorText};
  `,
}));

export interface CustomerBasicInfoProps {
  customer?: CustomerExtend;
}

export const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({
  customer,
}) => {
  const { styles } = useStyles();

  return (
    <>
      {/* 基本信息 */}
      <div className={styles.infoBox}>
        <div className={styles.infoTitle}>基本信息</div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>性别：</div>
          <div className={styles.infoValue}>{customer?.gender || '-'}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>年龄：</div>
          <div className={styles.infoValue}>{customer?.age ? `${customer.age}岁` : '-'}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>工作：</div>
          <div className={styles.infoValue}>{customer?.work || '-'}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>婚姻状况：</div>
          <div className={styles.infoValue}>
            {customer?.isSingle === true ? '单身' : customer?.isSingle === false ? '非单身' : '-'}
          </div>
        </div>
      </div>

      {/* 家庭和兴趣 */}
      <div className={styles.infoBox}>
        <div className={styles.infoTitle}>家庭和兴趣</div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>家庭情况：</div>
          <div className={styles.infoValue}>{customer?.familySituation || '-'}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>兴趣爱好：</div>
          <div className={styles.infoValue}>{customer?.hobby || '-'}</div>
        </div>
      </div>
    </>
  );
};
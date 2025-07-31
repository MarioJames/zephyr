import React from 'react';
import { createStyles } from 'antd-style';
import { CustomerExtend } from '@/types/customer';

const useStyles = createStyles(({ css, token }) => ({
  infoBox: css`
    height: 148px;
    flex: 1;
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
  `,
  infoValue: css`
    color: ${token.colorText};
  `,
}));

export interface CustomerContactInfoProps {
  customer?: CustomerExtend;
}

export const CustomerContactInfo: React.FC<CustomerContactInfoProps> = ({
  customer,
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoTitle}>联系方式</div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>手机号：</div>
        <div className={styles.infoValue}>{customer?.phone || '-'}</div>
      </div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>邮箱：</div>
        <div className={styles.infoValue}>{customer?.email || '-'}</div>
      </div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>微信号：</div>
        <div className={styles.infoValue}>{customer?.wechat || '-'}</div>
      </div>
    </div>
  );
};

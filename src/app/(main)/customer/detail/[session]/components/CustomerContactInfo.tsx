import React from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => ({
  infoBox: css`
    flex: 1;
    padding: 16px;
    background-color: ${token.colorBgBase};
    border: 1px solid ${token.colorBorder};
    border-radius: 4px;
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  `,
  infoTitle: css`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  `,
  infoItem: css`
    margin-bottom: 8px;
    display: flex;
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

export interface CustomerContactInfoProps {
  contactInfo: {
    phone?: string | null;
    email?: string | null;
    wechat?: string | null;
  };
}

export const CustomerContactInfo: React.FC<CustomerContactInfoProps> = ({
  contactInfo,
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoTitle}>联系方式</div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>手机号：</div>
        <div className={styles.infoValue}>{contactInfo.phone || '-'}</div>
      </div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>邮箱：</div>
        <div className={styles.infoValue}>{contactInfo.email || '-'}</div>
      </div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>微信号：</div>
        <div className={styles.infoValue}>{contactInfo.wechat || '-'}</div>
      </div>
    </div>
  );
};

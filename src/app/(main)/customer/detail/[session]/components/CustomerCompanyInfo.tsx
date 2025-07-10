import React from 'react';
import { createStyles } from 'antd-style';

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
  `,
  infoValue: css`
    color: ${token.colorText};
  `,
}));

export interface CustomerCompanyInfoProps {
  companyInfo: {
    company?: string | null;
    industry?: string | null;
    scale?: string | null;
    position?: string | null;
  };
}

export const CustomerCompanyInfo: React.FC<CustomerCompanyInfoProps> = ({
  companyInfo,
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoTitle}>个人信息</div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>公司名称：</div>
        <div className={styles.infoValue}>{companyInfo.company || '-'}</div>
      </div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>行业：</div>
        <div className={styles.infoValue}>{companyInfo.industry || '-'}</div>
      </div>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>规模：</div>
        <div className={styles.infoValue}>{companyInfo.scale || '-'}</div>
      </div>
    </div>
  );
};

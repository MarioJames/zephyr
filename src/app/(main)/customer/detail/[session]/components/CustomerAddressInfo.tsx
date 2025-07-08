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

export interface CustomerAddressInfoProps {
  addressInfo: {
    address?: string | null;
  };
}

export const CustomerAddressInfo: React.FC<CustomerAddressInfoProps> = ({
  addressInfo,
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoTitle}>地址信息</div>
      <div className={styles.infoValue}>{addressInfo.address || '-'}</div>
    </div>
  );
};

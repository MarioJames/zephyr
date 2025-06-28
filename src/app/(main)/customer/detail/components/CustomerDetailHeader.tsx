import React from 'react';
import { Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `,
  backButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
  `,
  actionButton: css`
    margin-left: 8px;
  `,
}));

export interface CustomerDetailHeaderProps {
  customerName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({
  customerName,
  onBack,
  onEdit,
  onDelete,
  deleting,
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.header}>
      <div className={styles.backButton} onClick={onBack}>
        <ArrowLeftOutlined style={{ marginRight: 8 }} />
        <span>返回客户管理</span>
      </div>
      <Space>
        <Button
          className={styles.actionButton}
          onClick={onDelete}
          loading={deleting}
          danger
        >
          删除
        </Button>
        <Button
          type="primary"
          className={styles.actionButton}
          onClick={onEdit}
        >
          编辑
        </Button>
      </Space>
    </div>
  );
};

import React from 'react';
import { Popconfirm, Space } from 'antd';
import { Button } from '@lobehub/ui';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
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
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({
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
      <Space size={10}>
        <Popconfirm
          cancelText='取消'
          okText='确定'
          onConfirm={onDelete}
          title='确定删除该客户吗？'
        >
          <Button
            className={styles.actionButton}
            loading={deleting}
          >
            删除
          </Button>
        </Popconfirm>
        <Button className={styles.actionButton} onClick={onEdit} type='primary'>
          编辑
        </Button>
      </Space>
    </div>
  );
};

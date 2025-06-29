import React from 'react';
import { Card, Row, Col, Avatar } from 'antd';
import { createStyles } from 'antd-style';
import { CustomerItem } from '@/services/customer';
import { EmployeeAssignmentPanel } from './EmployeeAssignmentPanel';
import { UserItem } from '@/services/user';

const useStyles = createStyles(({ css, token }) => ({
  customerCard: css`
    margin-bottom: 24px;
    padding: 24px;
  `,
  customerInfo: css`
    display: flex;
  `,
  customerAvatar: css`
    margin-right: 24px;
  `,
  customerName: css`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  `,
  customerMeta: css`
    color: ${token.colorText};
    margin-bottom: 8px;
  `,
  customerNotes: css`
    color: ${token.colorText};
  `,

}));

export interface CustomerInfoCardProps {
  customer: CustomerItem;
  onAssignSuccess?: (employee: UserItem) => void;
  onAssignError?: (error: any) => void;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  customer,
  onAssignSuccess,
  onAssignError,
}) => {
  const { styles } = useStyles();

  const { session, extend } = customer;

  return (
    <Card className={styles.customerCard}>
      <Row>
        <Col span={18}>
          <div className={styles.customerInfo}>
            <div className={styles.customerAvatar}>
              <Avatar size={64} style={{ backgroundColor: '#1890ff' }}>
                {(session.title || '客户').charAt(0)}
              </Avatar>
            </div>
            <div>
              <div className={styles.customerName}>
                {session.title || '未命名客户'}
              </div>
              <div className={styles.customerMeta}>
                创建时间：
                {session.createdAt
                  ? new Date(session.createdAt).toLocaleString('zh-CN')
                  : '-'}
              </div>
              <div className={styles.customerNotes}>
                备注：{session.description || '-'}
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <EmployeeAssignmentPanel
            session={session}
            onAssignSuccess={onAssignSuccess}
            onAssignError={onAssignError}
          />
        </Col>
      </Row>
    </Card>
  );
};

import React from 'react';
import { Card, Row, Col, Avatar, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { CustomerItem } from '@/services/customer';
import { EmployeeAssignmentPanel } from './EmployeeAssignmentPanel';
import { UserItem } from '@/services/user';

const useStyles = createStyles(({ css, token }) => ({
  customerCard: css`
    margin-bottom: 18px;
    border: none;
  `,
  customerInfo: css`
    display: flex;
  `,
  customerAvatar: css`
    margin-right: 16px;
  `,
  customerBaseInfo: css`
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  `,
  customerNotes: css`
    color: ${token.colorText};
    font-size: 14px;
    font-weight: 400;
  `,
  customerMetaContainer: css`
    display: flex;
    align-items: center;
    color: ${token.colorTextTertiary};
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 4px;
  `,
  customerMetaSeparator: css`
    margin: 0 4px;
  `,
  tags: css`
    color: ${token.colorPrimary};
    background-color: ${token.colorSplit};
  `,
}));

export interface CustomerInfoCardProps {
  customer: CustomerItem;
  onAssignSuccess?: (employee: UserItem) => void;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  customer,
  onAssignSuccess,
}) => {
  const { styles } = useStyles();

  const { session, extend } = customer;
  return (
    <Card
      className={styles.customerCard}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Row>
        <Col span={18}>
          <div className={styles.customerInfo}>
            <div className={styles.customerAvatar}>
              {session.avatar ? (
                <Avatar size={58} src={session.avatar} />
              ) : (
                <Avatar>{(session.title || '客户').charAt(0)}</Avatar>
              )}
            </div>
            <div>
              <div className={styles.customerBaseInfo}>
                <div style={{ marginRight: 8 }}>
                  {session.title || '未命名客户'}
                </div>
                {session?.agent?.title && (
                  <Tag className={styles.tags}>{session?.agent?.title}</Tag>
                )}
                {extend?.gender && (
                  <Tag className={styles.tags}>{extend.gender}</Tag>
                )}
                {extend?.age && (
                  <Tag className={styles.tags}>{extend.age + '岁'}</Tag>
                )}
                {extend?.industry && (
                  <Tag className={styles.tags}>{extend.industry}</Tag>
                )}
                {extend?.position && (
                  <Tag className={styles.tags}>{extend.position}</Tag>
                )}
              </div>
              <div className={styles.customerMetaContainer}>
                <div>
                  创建时间：
                  {session.createdAt
                    ? new Date(session.createdAt).toLocaleString('zh-CN')
                    : '-'}
                </div>
                <div className={styles.customerMetaSeparator}>|</div>
                <div>
                  更新时间：
                  {session.updatedAt
                    ? new Date(session.updatedAt).toLocaleString('zh-CN')
                    : '-'}
                </div>
              </div>
              <div className={styles.customerNotes}>
                备注：{session.description || '-'}
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <EmployeeAssignmentPanel
            onAssignSuccess={onAssignSuccess}
            session={session}
          />
        </Col>
      </Row>
    </Card>
  );
};

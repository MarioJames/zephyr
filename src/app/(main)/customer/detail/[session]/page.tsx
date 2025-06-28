'use client';

import React, { use, useEffect } from 'react';
import { Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import { useCustomerDetail } from './hooks/useCustomerDetail';
import {
  CustomerDetailHeader,
  CustomerInfoCard,
  CustomerContactInfo,
  CustomerCompanyInfo,
  CustomerAddressInfo,
  TopicRecordsTable,
} from './components';

// 创建样式
const useStyles = createStyles(({ css, token }) => ({
  pageContainer: css`
    padding: 24px;
    background-color: ${token.colorBgContainer};
    min-height: 100vh;
    width: 100%;
    flex: 1;
    overflow: auto;
  `,
  infoContainer: css`
    display: flex;
    margin-bottom: 24px;
  `,
}));

export default function CustomerDetail({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { styles } = useStyles();

  const router = useRouter();

  const { session: sessionId } = use(params);

  // 使用自定义hook管理客户详情数据
  const { deleting, customerDetail, fetchCustomerDetail, deleteCustomer } =
    useCustomerDetail(sessionId);

  // 加载客户数据
  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) {
        message.error('缺少客户ID参数');
        router.push('/customer');
        return;
      }

      fetchCustomerDetail();
    };

    loadData();
  }, [sessionId, fetchCustomerDetail, router]);

  // 处理返回
  const handleBack = () => {
    router.push('/customer');
  };

  // 处理编辑
  const handleEdit = () => {
    router.push(`/customer/form/edit/${sessionId}`);
  };

  // 处理删除
  const handleDelete = async () => {
    if (!sessionId) return;

    await deleteCustomer(sessionId);
  };

  if (!customerDetail) {
    return (
      <div className={styles.pageContainer}>
        <Spin
          size='large'
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20%',
          }}
        >
          <div style={{ marginTop: 8 }}>加载中...</div>
        </Spin>
      </div>
    );
  }

  const { session, extend } = customerDetail;

  return (
    <div className={styles.pageContainer}>
      {/* 顶部导航 */}
      <CustomerDetailHeader
        customerName={session.title || '未命名客户'}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* 客户信息卡片 */}
      <CustomerInfoCard
        customer={customerDetail}
        onAssignSuccess={fetchCustomerDetail}
      />

      {/* 详细信息区域 */}
      <div className={styles.infoContainer}>
        {/* 联系方式 */}
        <CustomerContactInfo
          contactInfo={{
            phone: extend?.phone,
            email: extend?.email,
            wechat: extend?.wechat,
          }}
        />

        {/* 公司信息 */}
        <CustomerCompanyInfo
          companyInfo={{
            company: extend?.company,
            industry: extend?.industry,
            scale: extend?.scale,
            position: extend?.position,
          }}
        />

        {/* 地址信息 */}
        <CustomerAddressInfo
          addressInfo={{
            province: extend?.province,
            city: extend?.city,
            district: extend?.district,
            address: extend?.address,
          }}
        />
      </div>

      {/* 话题记录 */}
      <TopicRecordsTable sessionId={sessionId || ''} />
    </div>
  );
}

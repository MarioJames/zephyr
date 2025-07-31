'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Space, Typography, App, Spin, Popconfirm, Skeleton } from 'antd';
import { Button, Modal, Select, Alert } from '@lobehub/ui';
import { SearchOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';
import { sessionsAPI, topicsAPI, type CustomerItem } from '@/services';
import { CustomerAssignee } from '@/components/CustomerAssignee';
import { useCustomerStore } from '@/store/customer';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import Link from 'next/link';
import NoAuthority from '@/components/NoAuthority';
import isEmpty from 'lodash-es/isEmpty';

const { Title } = Typography;

// 客户显示类型（扁平化结构用于表格）
interface CustomerDisplayItem {
  key: string;
  sessionId: string;
  name: string;
  company?: string;
  type: string;
  phone?: string;
  createTime: string;
  lastContactTime: string;
  conversations: number;
  assignee?: string;
  assigneeId?: string; // 对接人用户ID
  session: any; // 完整的session对象，用于传递给组件
}

// 创建样式
const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  pageContainer: css`
    padding: 24px;
    background-color: ${token.colorBgContainer};
    min-height: 100vh;
    width: 100%;
    flex: 1;
    overflow: auto;
  `,
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `,
  statsContainer: css`
    height: 86px;
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    overflow-x: auto;
  `,
  statsBox: css`
    flex: 1 0 280px;
    cursor: pointer;
    border: 1px solid ${token.colorBorderSecondary};
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease;
    border-radius: ${token.borderRadius}px;

    &:hover {
      background: ${token.colorFill};
    }
  `,
  statsBoxActive: css`
    border-color: ${token.colorText};
    background: ${isDarkMode
      ? token.colorFillSecondary
      : token.colorFillTertiary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  statsTitle: css`
    font-size: 14px;
    color: ${token.colorTextQuaternary};
  `,
  statsValue: css`
    font-size: 24px;
    font-weight: bold;
  `,
  tableContainer: css`
    background-color: ${token.colorBgContainer};
    padding: 16px;
    border-radius: 8px;
  `,
  searchBox: css`
    width: 280px;
    margin-right: 16px;

    .ant-select-dropdown {
      max-height: 400px;
    }

    .ant-select-item-option-content {
      padding: 8px 0;
    }
  `,
  actionButton: css`
    margin-left: 8px;
  `,
}));

// 数据转换工具函数
const transformCustomerToDisplayItem = (
  customer: CustomerItem
): CustomerDisplayItem => {
  const { session, extend } = customer || {};

  const { user, agentsToSessions } = session || {};
  return {
    key: session?.id,
    sessionId: session?.id,
    name: session?.title || '',
    company: extend?.company || '',
    type: agentsToSessions?.[0]?.agent?.title || '未分类',
    phone: extend?.phone || '',
    createTime: dayjs(session?.createdAt).format('YYYY-MM-DD HH:mm:ss') || '',
    lastContactTime:
      dayjs(session?.updatedAt).format('YYYY-MM-DD HH:mm:ss') || '',
    conversations: session?.messageCount || 0,
    assignee: user?.fullName || user?.username || '',
    assigneeId: user?.id,
    session: session, // 保存完整的session对象
  };
};

export default function Customer() {
  const { styles, theme } = useStyles();
  const { message } = App.useApp();
  const router = useRouter();
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  // If not admin, show NoAuthority component
  if (!isAdmin) {
    return <NoAuthority />;
  }

  // Store hooks
  const {
    // 数据
    customers,
    loading,
    error,
    selectedCategory,
    categoryStats,
    total,

    // Actions
    setSelectedCategory,
    deleteCustomer,
    fetchCategoryStats,
    refreshCustomers,

    // 分页
    page,
    pageSize,
    setPagination,
  } = useCustomerStore();

  // 防抖搜索
  const {
    loading: searchLoading,
    run: searchSessions,
    data: searchResults,
  } = useRequest(
    (keyword: string) => {
      if (!keyword.trim()) return Promise.resolve([]);

      return sessionsAPI.searchSessionList({
        keyword: keyword,
      });
    },
    {
      debounceWait: 500,
    }
  );

  // 计算显示用的客户数据
  const displayCustomers = useMemo(() => {
    if (isEmpty(customers)) return [];
    return customers.map(transformCustomerToDisplayItem);
  }, [customers]);

  // 添加统计区域加载状态
  const [statsLoading, setStatsLoading] = useState(false);

  // 进入页面时获取分类统计数据
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        await fetchCategoryStats();
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [fetchCategoryStats]);

  // 处理删除
  const handleDelete = useCallback(async (record: CustomerDisplayItem) => {
    try {
      await deleteCustomer(record.sessionId);
      message.success(`已删除客户: ${record.name}`);
      // 刷新客户列表和统计数据
      setStatsLoading(true);
      try {
        await Promise.all([refreshCustomers(), fetchCategoryStats()]);
      } finally {
        setStatsLoading(false);
      }
    } catch (error) {
      message.error('删除客户失败');
      console.error('删除客户失败:', error);
    }
  }, [deleteCustomer, message, refreshCustomers, fetchCategoryStats]);

  // 跳转到添加客户页面
  const handleAddCustomer = useCallback(() => {
    console.log('点击添加客户按钮，准备跳转到 /customer/form');
    try {
      router.push('/customer/form');
      console.log('router.push 调用成功');
    } catch (error) {
      console.error('router.push 调用失败:', error);
    }
  }, [router]);

  // 跳转到编辑客户页面
  const handleEditCustomer = useCallback(
    (record: CustomerDisplayItem) => {
      router.push(`/customer/form/edit/${record.key}`);
    },
    [router]
  );

  // 跳转到客户详情页
  const handleViewCustomerDetail = useCallback(
    (record: CustomerDisplayItem) => {
      router.push(`/customer/detail/${record.key}`);
    },
    [router]
  );

  // 跳转到对话页面
  const handleViewConversations = useCallback(
    async (record: CustomerDisplayItem) => {
      try {
        const topics = await topicsAPI.getTopicList(record.sessionId);

        const activeTopicId = topics?.[0]?.id;

        router.push(`/chat?session=${record.sessionId}&topic=${activeTopicId}`);
      } catch (error) {
        console.error('切换会话失败:', error);
        message.error('切换到对话失败');
      }
    },
    [router, message]
  );

  // 表格列定义
  const columns: ColumnsType<CustomerDisplayItem> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CustomerDisplayItem) => (
        <a
          onClick={() => handleViewCustomerDetail(record)}
          style={{ color: theme.colorText }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '客户类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: '最后联系时间',
      dataIndex: 'lastContactTime',
      key: 'lastContactTime',
      sorter: true,
    },
    {
      title: '对话记录',
      dataIndex: 'conversations',
      key: 'conversations',
      render: (text: number, record: CustomerDisplayItem) => (
        <a
          onClick={() => handleViewConversations(record)}
          style={{ color: theme.colorPrimary }}
        >
          {text}条
        </a>
      ),
    },
    {
      title: '对接人',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text: string, record: CustomerDisplayItem) => (
        <CustomerAssignee
          session={record.session}
          title=''
          placeholder='未分配'
          popoverPlacement='right'
          onAssignSuccess={refreshCustomers}
          style={{ fontSize: '14px' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CustomerDisplayItem) => (
        <Space size='middle'>
          <a
            style={{ color: theme.colorPrimary }}
            onClick={() => handleEditCustomer(record)}
          >
            编辑
          </a>
          <Popconfirm
            title='确认删除'
            description='确定要删除该客户吗？此操作不可撤销。'
            okText='确认'
            cancelText='取消'
            onConfirm={() => handleDelete(record)}
          >
            <a style={{ color: theme.colorPrimary }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理表格变化
  const handleTableChange = useCallback(
    (pagination: any, filters: any, sorter: any) => {
      if (pagination.current !== page) {
        setPagination(pagination.current, pagination.pageSize);
      }
      if (pagination.pageSize !== pageSize) {
        setPagination(pagination.current, pagination.pageSize);
      }
    },
    [page, pageSize, setPagination]
  );

  return (
    <div className={styles.pageContainer}>
      {/* 顶部区域 */}
      <div className={styles.header}>
        <Title level={4} style={{ margin: 0 }}>
          客户管理
        </Title>
        <Space>
          <Select
            showSearch
            allowClear
            placeholder='搜索客户'
            suffixIcon={<SearchOutlined />}
            className={styles.searchBox}
            onSearch={searchSessions}
            onChange={(value: string | undefined) => {
              if (value) {
                // 直接跳转到客户详情页
                router.push(`/customer/detail?id=${value}`);
              }
            }}
            options={searchResults?.map((item) => ({
              label: item.title,
              value: item.id,
            }))}
            onClear={() => searchSessions('')}
            filterOption={false}
            notFoundContent={
              searchLoading ? (
                <Spin size='small' />
              ) : searchResults?.length === 0 ? (
                '暂无匹配的客户'
              ) : (
                '请输入关键词搜索客户'
              )
            }
            style={{ minWidth: 240 }}
          />
          <Link href='/customer/template'>
            <Button className={styles.actionButton}>客户模版配置</Button>
          </Link>
          <Button
            type='primary'
            className={styles.actionButton}
            onClick={handleAddCustomer}
          >
            添加客户
          </Button>
        </Space>
      </div>

      {/* 统计区域/类别Tab */}
      <div className={styles.statsContainer}>
        {statsLoading ? (
          // 骨架屏
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.statsBox}>
              <Skeleton
                active
                paragraph={false}
                title={{ width: '100%' }}
              />
              <Skeleton.Input
                active
                size="default"
                style={{ width: '60%', marginTop: '8px' }}
                />
              </div>
            ))}
          </>
        ) : (
          categoryStats.map((item, index) => (
            <div
              key={item.agent?.id || `category-${index}`}
              onClick={() => setSelectedCategory(item)}
              className={`${styles.statsBox} ${
                selectedCategory.agent?.id === item.agent?.id
                  ? styles.statsBoxActive
                  : ''
              }`}
            >
              <div className={styles.statsTitle}>{item.agent?.title}</div>
              <div className={styles.statsValue}>{item.count}</div>
            </div>
          ))
        )}
      </div>

      {/* 表格区域 */}
      <div className={styles.tableContainer}>
        {error && (
          <Alert
            message='加载客户数据失败'
            description={error}
            type='error'
            style={{ marginBottom: 16 }}
            closable
          />
        )}
        <Table
          columns={columns}
          dataSource={displayCustomers}
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: false,
            showTotal: (total) => `共 ${total} 条记录`,
            locale: {
              items_per_page: '条/页',
              jump_to: '跳至',
              page: '页',
            },
          }}
          onChange={handleTableChange}
          locale={{
            triggerDesc: '点击降序排列',
            triggerAsc: '点击升序排列',
            cancelSort: '取消排序',
          }}
        />
      </div>
    </div>
  );
}

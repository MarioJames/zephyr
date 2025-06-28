'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Input,
  Button,
  Table,
  Space,
  Typography,
  Popover,
  List,
  Modal,
  App,
  Spin,
  Alert,
  Select,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';
import { sessionsAPI, type CustomerItem } from '@/services';
import { UserItem } from '@/services/user';
import { useEmployeeStore } from '@/store/employee';
import { useCustomerStore } from '@/store/customer';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';

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
  `,
  statsBox: css`
    cursor: pointer;
    flex: 1;
    border: 1px solid ${token.colorText};
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
    border-color: ${token.colorPrimary} !important;
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
  popoverContent: css`
    width: 197px;
    height: 214px;
  `,
  popoverSearch: css`
    margin-bottom: 8px;
  `,
}));

// 数据转换工具函数
const transformCustomerToDisplayItem = (
  customer: CustomerItem
): CustomerDisplayItem => {
  const { user, agentsToSessions } = customer.session;

  const agentTitle = agentsToSessions?.[0]?.agent?.title;

  return {
    key: customer.session.id,
    sessionId: customer.session.id,
    name: customer.session.title || '',
    company: customer.extend?.company || '',
    type: agentTitle || '未分类',
    phone: customer.extend?.phone || '',
    createTime:
      dayjs(customer.session.createdAt).format('YYYY-MM-DD HH:mm:ss') || '',
    lastContactTime:
      dayjs(customer.session.updatedAt).format('YYYY-MM-DD HH:mm:ss') || '',
    conversations: customer.session.messageCount || 0,
    assignee: user?.fullName || user?.username || '',
  };
};

export default function Customer() {
  const { styles, theme } = useStyles();
  const { message } = App.useApp();
  const router = useRouter();

  // Store hooks
  const { employees } = useEmployeeStore();
  const {
    // 数据
    customers,
    loading,
    error,
    selectedCategory,
    categoryStats,

    // Actions
    setSelectedCategory,
    updateCustomer,
    deleteCustomer,
    fetchCategoryStats,

    // 分页
    page,
    pageSize,
    setPagination,
  } = useCustomerStore();

  // const fullStats = customerSelectors.getFullStats(useCustomerStore.getState());

  // 本地状态（只保留必要的UI状态）
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [currentRecord, setCurrentRecord] =
    useState<CustomerDisplayItem | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 防抖搜索
  const {
    loading: searchLoading,
    run: searchSessions,
    data: searchResults,
  } = useRequest(
    (keyword: string) => {
      if (!keyword) return Promise.resolve([]);

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
    return customers.map(transformCustomerToDisplayItem);
  }, [customers]);

  // 进入页面时获取分类统计数据
  useEffect(() => {
    fetchCategoryStats();
  }, []);

  // 员工搜索过滤
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: UserItem) =>
      (emp.fullName || emp.username || '')
        .toLowerCase()
        .includes(employeeSearchText.toLowerCase())
    );
  }, [employees, employeeSearchText]);

  // 处理员工分配相关
  const handleAssigneeClick = useCallback((record: CustomerDisplayItem) => {
    setCurrentRecord(record);
  }, []);

  // 处理员工分配
  const handleAssignEmployee = useCallback(
    async (employee: UserItem) => {
      if (!currentRecord) return;

      try {
        // 调用store的updateCustomer方法
        await updateCustomer(currentRecord.sessionId, {
          agentId: employee.id,
        });

        const employeeName =
          employee.fullName || employee.username || '未知员工';
        message.success(
          `已将客户 ${currentRecord.name} 分配给 ${employeeName}`
        );
      } catch (error) {
        message.error('分配员工失败');
        console.error('分配员工失败:', error);
      }
    },
    [currentRecord, updateCustomer, message]
  );

  // 处理删除
  const handleDelete = useCallback((record: CustomerDisplayItem) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!currentRecord) return;

    try {
      await deleteCustomer(currentRecord.sessionId);
      message.success(`已删除客户: ${currentRecord.name}`);
      setDeleteModalVisible(false);
      setCurrentRecord(null);
    } catch (error) {
      message.error('删除客户失败');
      console.error('删除客户失败:', error);
    }
  }, [currentRecord, deleteCustomer, message]);

  // 跳转到添加客户页面
  const handleAddCustomer = useCallback(() => {
    router.push('/customer/form');
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
      router.push(`/customer/detail?id=${record.key}`);
    },
    [router]
  );

  // 跳转到对话页面
  const handleViewConversations = useCallback(
    (record: CustomerDisplayItem) => {
      router.push(`/chat?sessionId=${record.sessionId}`);
    },
    [router]
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
        <Popover
          trigger='click'
          placement='right'
          title='选择对接人'
          content={
            <div className={styles.popoverContent}>
              <Input
                placeholder='搜索员工'
                className={styles.popoverSearch}
                value={employeeSearchText}
                onChange={(e) => setEmployeeSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <List
                size='small'
                dataSource={filteredEmployees}
                renderItem={(item: UserItem) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAssignEmployee(item)}
                  >
                    {item.fullName || item.username || '未知员工'}
                  </List.Item>
                )}
                style={{ height: '150px', overflow: 'auto' }}
              />
            </div>
          }
        >
          <a
            onClick={() => handleAssigneeClick(record)}
            style={{ color: theme.colorText }}
          >
            {text}
          </a>
        </Popover>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CustomerDisplayItem) => (
        <Space size='middle'>
          <Button type='text' onClick={() => handleEditCustomer(record)}>
            编辑
          </Button>
          <Button type='text' onClick={() => handleDelete(record)}>
            删除
          </Button>
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
              onChange={(value) => {
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
            <Button className={styles.actionButton}>客户模版配置</Button>
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
          {categoryStats.map((item) => (
            <div
              key={item.agent?.id}
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
          ))}
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
              total: selectedCategory.count,
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

        {/* 删除确认弹窗 */}
        <Modal
          title='确认删除'
          open={deleteModalVisible}
          onOk={confirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText='确认'
          cancelText='取消'
        >
          <p>确定要删除客户 {currentRecord?.name} 吗？此操作不可撤销。</p>
        </Modal>
      </div>
  );
}

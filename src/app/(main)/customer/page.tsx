'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Input,
  Button,
  Table,
  Space,
  Card,
  Typography,
  Popover,
  List,
  Modal,
  ConfigProvider,
  App,
  Spin,
  Alert,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import zhCN from 'antd/locale/zh_CN';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { SortOrder } from 'antd/es/table/interface';
import {
  customerAPI,
  type CustomerItem,
  type CustomerListRequest,
} from '@/services';
import { UserItem } from '@/services/user';
import { useEmployeeStore } from '@/store/employee';
import { customerSelectors, useCustomerStore } from '@/store/customer';

const { Title, Text } = Typography;

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
  avatar?: string;
  // 扩展字段
  gender?: string;
  age?: number;
  position?: string;
  email?: string;
  wechat?: string;
  industry?: string;
  scale?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  notes?: string;
}

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
    flex: 1;
    border: 1px solid ${token.colorText};
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease;

    &:hover {
      border-color: ${token.colorPrimary};
      background-color: ${token.colorPrimaryBg};
    }
  `,
  statsBoxActive: css`
    border-color: ${token.colorPrimary} !important;
    background-color: ${token.colorPrimaryBg} !important;
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
    width: 240px;
    margin-right: 16px;
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
const transformCustomerToDisplayItem = (customer: CustomerItem, agentTitle?: string): CustomerDisplayItem => ({
  key: customer.session.id,
  sessionId: customer.session.id,
  name: customer.session.title,
  company: customer.extend?.company || '',
  type: agentTitle || '未分类',
  phone: customer.extend?.phone || '',
  createTime: customer.session.createdAt || '',
  lastContactTime: customer.session.updatedAt || '',
  conversations: 0, // 需要从其他API获取
  assignee: '', // 需要从员工分配关系获取
  avatar: customer.session.avatar,
  // 扩展字段
  gender: customer.extend?.gender || undefined,
  age: customer.extend?.age || undefined,
  position: customer.extend?.position || undefined,
  email: customer.extend?.email || undefined,
  wechat: customer.extend?.wechat || undefined,
  industry: customer.extend?.industry || undefined,
  scale: customer.extend?.scale || undefined,
  province: customer.extend?.province || undefined,
  city: customer.extend?.city || undefined,
  district: customer.extend?.district || undefined,
  address: customer.extend?.address || undefined,
  notes: customer.extend?.notes || undefined,
});

export default function Customer() {
  const { styles, theme } = useStyles();
  const { message } = App.useApp();
  const router = useRouter();

  // Store hooks
  const { employees, fetchEmployees } = useEmployeeStore();
  const {
    // 数据
    customers,
    agents,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    searchQuery,
    selectedCategory,
    categoryStats,

    // Actions
    fetchCustomers,
    fetchAgents,
    setSearchQuery,
    setCurrentPage,
    setPageSize,
    setSelectedCategory,
    setSorting,
    updateCustomer,
    deleteCustomer,

    // Selectors (通过useCustomerStore.getState()获取)
  } = useCustomerStore();

  const fullStats = customerSelectors.getFullStats(useCustomerStore.getState());

  // 本地状态（只保留必要的UI状态）
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [currentRecord, setCurrentRecord] =
    useState<CustomerDisplayItem | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 计算显示用的客户数据
  const displayCustomers = useMemo(() => {
    return customers.map(customer => {
      const agentTitle = agents.find(agent => agent.id === customer.session.agentId)?.title;
      return transformCustomerToDisplayItem(customer, agentTitle);
    });
  }, [customers, agents]);

  // 处理类别切换
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
    },
    [setSelectedCategory]
  );

  // 初始化数据
  useEffect(() => {
    fetchEmployees();
    fetchAgents();
  }, [fetchEmployees, fetchAgents]);

  // 当agents加载完成后获取客户数据
  useEffect(() => {
    if (agents.length > 0) {
      fetchCustomers();
    }
  }, [agents, fetchCustomers]);

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
    router.push('/customer/edit');
  }, [router]);

  // 跳转到编辑客户页面
  const handleEditCustomer = useCallback(
    (record: CustomerDisplayItem) => {
      router.push(`/customer/edit?id=${record.key}`);
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
      render: (text: number) => `${text}条`,
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
      if (pagination.current !== currentPage) {
        setCurrentPage(pagination.current);
      }
      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
      }

      if (sorter.field) {
        setSorting(sorter.field, sorter.order);
      }
    },
    [currentPage, pageSize, setCurrentPage, setPageSize, setSorting]
  );

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.pageContainer}>
        {/* 顶部区域 */}
        <div className={styles.header}>
          <Title level={4} style={{ margin: 0 }}>
            客户管理
          </Title>
          <Space>
            <Input
              placeholder='搜索客户'
              prefix={<SearchOutlined />}
              className={styles.searchBox}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {/* 全部客户 */}
          <div
            className={`${styles.statsBox} ${
              selectedCategory === 'all' ? styles.statsBoxActive : ''
            }`}
            style={{ cursor: 'pointer' }}
            onClick={() => handleCategoryChange('all')}
          >
            <div className={styles.statsTitle}>全部客户</div>
            <div className={styles.statsValue}>{total}</div>
          </div>

          {/* 动态Agent类别 */}
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`${styles.statsBox} ${
                selectedCategory === agent.id ? styles.statsBoxActive : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCategoryChange(agent.id)}
            >
              <div className={styles.statsTitle}>
                {agent.title || '未命名类别'}
              </div>
              <div className={styles.statsValue}>
                {fullStats.byCategory[agent.id] || 0}
              </div>
            </div>
          ))}

          {/* 未分类客户 */}
          {fullStats.byCategory['unclassified'] > 0 && (
            <div
              className={`${styles.statsBox} ${
                selectedCategory === 'unclassified' ? styles.statsBoxActive : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCategoryChange('unclassified')}
            >
              <div className={styles.statsTitle}>未分类</div>
              <div className={styles.statsValue}>
                {fullStats.byCategory['unclassified']}
              </div>
            </div>
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
              current: currentPage,
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
    </ConfigProvider>
  );
}

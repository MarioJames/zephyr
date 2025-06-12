'use client';

import React, { useState } from 'react';
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
  message 
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SortAscendingOutlined, 
  SortDescendingOutlined 
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

// 创建样式
const useStyles = createStyles(({ css, token }) => ({
  pageContainer: css`
    padding: 24px;
    background-color: #f0f2f5;
    min-height: 100vh;
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
    border: 1px solid #000;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  statsTitle: css`
    font-size: 14px;
    color: #333;
  `,
  statsValue: css`
    font-size: 24px;
    font-weight: bold;
  `,
  tableContainer: css`
    background-color: white;
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
  `
}));

// 模拟数据
const mockCustomers = [
  {
    key: '1',
    name: '张三',
    company: '阿里巴巴',
    type: 'A类',
    phone: '13800138000',
    createTime: '2023-05-15 10:30:22',
    lastContactTime: '2023-06-20 14:25:10',
    conversations: 15,
    assignee: '李四'
  },
  {
    key: '2',
    name: '王五',
    company: '腾讯科技',
    type: 'B类',
    phone: '13900139000',
    createTime: '2023-04-10 09:15:30',
    lastContactTime: '2023-06-18 11:45:20',
    conversations: 8,
    assignee: '赵六'
  },
  {
    key: '3',
    name: '刘七',
    company: '百度',
    type: 'A类',
    phone: '13700137000',
    createTime: '2023-06-01 16:20:15',
    lastContactTime: '2023-06-15 10:30:00',
    conversations: 5,
    assignee: '李四'
  },
  {
    key: '4',
    name: '陈八',
    company: '字节跳动',
    type: 'C类',
    phone: '13600136000',
    createTime: '2023-03-20 14:10:25',
    lastContactTime: '2023-06-10 09:20:15',
    conversations: 20,
    assignee: '王九'
  },
  {
    key: '5',
    name: '钱十',
    company: '华为技术',
    type: 'A类',
    phone: '13500135000',
    createTime: '2023-05-25 11:30:40',
    lastContactTime: '2023-06-05 16:45:30',
    conversations: 12,
    assignee: '赵六'
  },
];

// 模拟员工数据
const mockEmployees = [
  { id: 1, name: '李四' },
  { id: 2, name: '赵六' },
  { id: 3, name: '王九' },
  { id: 4, name: '张十' },
  { id: 5, name: '刘备' },
  { id: 6, name: '关羽' },
  { id: 7, name: '张飞' },
];

export default function Customer() {
  const { styles } = useStyles();
  const router = useRouter();
  
  // 状态管理
  const [searchText, setSearchText] = useState('');
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 处理排序
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  
  // 处理员工分配
  const handleAssigneeClick = (record) => {
    setCurrentRecord(record);
  };
  
  // 员工搜索过滤
  const filteredEmployees = mockEmployees.filter(
    emp => emp.name.toLowerCase().includes(employeeSearchText.toLowerCase())
  );
  
  // 处理员工分配
  const handleAssignEmployee = (employee) => {
    message.success(`已将客户 ${currentRecord.name} 分配给 ${employee.name}`);
    // 实际项目中这里会调用API更新数据
  };
  
  // 处理删除
  const handleDelete = (record) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  };
  
  const confirmDelete = () => {
    message.success(`已删除客户: ${currentRecord.name}`);
    setDeleteModalVisible(false);
    // 实际项目中这里会调用API删除数据
  };

  // 跳转到添加客户页面
  const handleAddCustomer = () => {
    router.push('/customer/edit');
  };

  // 跳转到编辑客户页面
  const handleEditCustomer = (record) => {
    router.push(`/customer/edit?id=${record.key}`);
  };

  // 跳转到客户详情页
  const handleViewCustomerDetail = (record) => {
    router.push(`/customer/detail?id=${record.key}`);
  };
  
  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => handleViewCustomerDetail(record)}>{text}</a>
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
      sortOrder: sortField === 'createTime' ? sortOrder : null,
      render: (text) => (
        <Space>
          {text}
          {sortField === 'createTime' && sortOrder === 'ascend' && <SortAscendingOutlined />}
          {sortField === 'createTime' && sortOrder === 'descend' && <SortDescendingOutlined />}
        </Space>
      ),
    },
    {
      title: '最后联系时间',
      dataIndex: 'lastContactTime',
      key: 'lastContactTime',
      sorter: true,
      sortOrder: sortField === 'lastContactTime' ? sortOrder : null,
      render: (text) => (
        <Space>
          {text}
          {sortField === 'lastContactTime' && sortOrder === 'ascend' && <SortAscendingOutlined />}
          {sortField === 'lastContactTime' && sortOrder === 'descend' && <SortDescendingOutlined />}
        </Space>
      ),
    },
    {
      title: '对话记录',
      dataIndex: 'conversations',
      key: 'conversations',
      render: (text) => `${text}条`,
    },
    {
      title: '对接人',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text, record) => (
        <Popover
          trigger="click"
          placement="right"
          title="选择对接人"
          content={
            <div className={styles.popoverContent}>
              <Input
                placeholder="搜索员工"
                className={styles.popoverSearch}
                value={employeeSearchText}
                onChange={(e) => setEmployeeSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <List
                size="small"
                dataSource={filteredEmployees}
                renderItem={item => (
                  <List.Item 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAssignEmployee(item)}
                  >
                    {item.name}
                  </List.Item>
                )}
                style={{ height: '150px', overflow: 'auto' }}
              />
            </div>
          }
        >
          <a onClick={() => handleAssigneeClick(record)}>{text}</a>
        </Popover>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCustomer(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 处理表格变化
  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 顶部区域 */}
      <div className={styles.header}>
        <Title level={4} style={{ margin: 0 }}>客户管理</Title>
        <Space>
          <Input 
            placeholder="搜索客户" 
            prefix={<SearchOutlined />} 
            className={styles.searchBox}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button className={styles.actionButton}>客户模版配置</Button>
          <Button type="primary" className={styles.actionButton} onClick={handleAddCustomer}>添加客户</Button>
        </Space>
      </div>

      {/* 统计区域 */}
      <div className={styles.statsContainer}>
        <div className={styles.statsBox}>
          <div className={styles.statsTitle}>当前A类客户总数</div>
          <div className={styles.statsValue}>200</div>
        </div>
        <div className={styles.statsBox}>
          <div className={styles.statsTitle}>当前B类客户总数</div>
          <div className={styles.statsValue}>150</div>
        </div>
        <div className={styles.statsBox}>
          <div className={styles.statsTitle}>当前C类客户总数</div>
          <div className={styles.statsValue}>100</div>
        </div>
        <div className={styles.statsBox}>
          <div className={styles.statsTitle}>客户总数</div>
          <div className={styles.statsValue}>450</div>
        </div>
      </div>

      {/* 表格区域 */}
      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          dataSource={mockCustomers}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: 100, // 假设总数为100
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
        />
      </div>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>确定要删除客户 {currentRecord?.name} 吗？此操作不可撤销。</p>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Typography, 
  Avatar, 
  Space, 
  Divider, 
  Table, 
  Popover, 
  Input, 
  List,
  Row,
  Col,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  DownOutlined, 
  SearchOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter, useSearchParams } from 'next/navigation';

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
  backButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
  `,
  actionButton: css`
    margin-left: 8px;
  `,
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
    color: #666;
    margin-bottom: 8px;
  `,
  customerNotes: css`
    color: #888;
  `,
  assigneeContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,
  assigneeTitle: css`
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  `,
  assigneeValue: css`
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
  infoContainer: css`
    display: flex;
    margin-bottom: 24px;
  `,
  infoBox: css`
    flex: 1;
    padding: 16px;
    background-color: white;
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
    color: #666;
    margin-right: 8px;
    min-width: 70px;
  `,
  infoValue: css`
    color: #333;
  `,
  messagesTitle: css`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  `,
  messagesTable: css`
    background-color: white;
    padding: 16px;
    border-radius: 8px;
  `,
  popoverContent: css`
    width: 197px;
    height: 214px;
  `,
  popoverSearch: css`
    margin-bottom: 8px;
  `
}));

// 模拟客户数据
const mockCustomerData = {
  id: '1',
  name: '张三',
  gender: '男',
  age: '35',
  position: '技术总监',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  wechat: 'zhangsan123',
  company: '阿里巴巴',
  industry: '互联网',
  scale: '10000人以上',
  province: '浙江省',
  city: '杭州市',
  district: '西湖区',
  address: '余杭塘路866号',
  notes: '重要客户，需要重点跟进',
  type: 'A',
  avatar: '',
  createTime: '2023-05-15 10:30:22',
  assignee: '李四'
};

// 模拟消息记录数据
const mockMessages = [
  {
    key: '1',
    topic: '产品介绍',
    messageCount: 15,
    recordTime: '2023-06-20 14:25:10',
    assignee: '李四'
  },
  {
    key: '2',
    topic: '需求沟通',
    messageCount: 8,
    recordTime: '2023-06-18 11:45:20',
    assignee: '李四'
  },
  {
    key: '3',
    topic: '价格谈判',
    messageCount: 12,
    recordTime: '2023-06-15 10:30:00',
    assignee: '王五'
  },
  {
    key: '4',
    topic: '合同确认',
    messageCount: 5,
    recordTime: '2023-06-10 09:20:15',
    assignee: '李四'
  },
  {
    key: '5',
    topic: '售后服务',
    messageCount: 20,
    recordTime: '2023-06-05 16:45:30',
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

export default function CustomerDetail() {
  const { styles } = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取URL参数
  const id = searchParams.get('id');
  
  // 状态管理
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  
  // 加载客户数据
  useEffect(() => {
    if (id) {
      // 实际项目中，这里应该调用API获取客户数据
      // 这里使用模拟数据
      setLoading(true);
      
      // 模拟API请求延迟
      setTimeout(() => {
        setCustomer(mockCustomerData);
        setLoading(false);
      }, 500);
    }
  }, [id]);
  
  // 处理返回
  const handleBack = () => {
    router.push('/customer');
  };
  
  // 处理编辑
  const handleEdit = () => {
    router.push(`/customer/edit?id=${id}`);
  };
  
  // 处理删除
  const handleDelete = () => {
    // 实际项目中，这里应该调用API删除客户
    message.success('客户删除成功！');
    router.push('/customer');
  };
  
  // 员工搜索过滤
  const filteredEmployees = mockEmployees.filter(
    emp => emp.name.toLowerCase().includes(employeeSearchText.toLowerCase())
  );
  
  // 处理员工分配
  const handleAssignEmployee = (employee) => {
    message.success(`已将客户 ${customer.name} 分配给 ${employee.name}`);
    // 实际项目中这里会调用API更新数据
  };
  
  // 消息记录表格列定义
  const columns = [
    {
      title: '主题',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: '消息数量',
      dataIndex: 'messageCount',
      key: 'messageCount',
    },
    {
      title: '记录时间',
      dataIndex: 'recordTime',
      key: 'recordTime',
      sorter: true,
      sortOrder: sortField === 'recordTime' ? sortOrder : null,
    },
    {
      title: '对接人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link">查看</Button>
      ),
    },
  ];
  
  // 处理表格变化
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  if (loading || !customer) {
    return <div className={styles.pageContainer}>加载中...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* 顶部导航 */}
      <div className={styles.header}>
        <div className={styles.backButton} onClick={handleBack}>
          <ArrowLeftOutlined style={{ marginRight: 8 }} />
          <span>返回客户管理</span>
        </div>
        <Space>
          <Button 
            icon={<DeleteOutlined />} 
            className={styles.actionButton}
            onClick={handleDelete}
          >
            删除
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            className={styles.actionButton}
            onClick={handleEdit}
          >
            编辑
          </Button>
        </Space>
      </div>
      
      {/* 客户信息卡片 */}
      <Card className={styles.customerCard}>
        <Row>
          <Col span={18}>
            <div className={styles.customerInfo}>
              <div className={styles.customerAvatar}>
                <Avatar size={64} style={{ backgroundColor: '#1890ff' }}>
                  {customer.name.charAt(0)}
                </Avatar>
              </div>
              <div>
                <div className={styles.customerName}>{customer.name}</div>
                <div className={styles.customerMeta}>创建时间：{customer.createTime}</div>
                <div className={styles.customerNotes}>备注：{customer.notes || '-'}</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.assigneeContainer}>
              <div className={styles.assigneeTitle}>对接人</div>
              <Popover
                trigger="click"
                placement="bottom"
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
                <div className={styles.assigneeValue}>
                  {customer.assignee} <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
                </div>
              </Popover>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* 详细信息区域 */}
      <div className={styles.infoContainer}>
        {/* 联系方式 */}
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>联系方式</div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>手机号：</div>
            <div className={styles.infoValue}>{customer.phone || '-'}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>邮箱：</div>
            <div className={styles.infoValue}>{customer.email || '-'}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>微信号：</div>
            <div className={styles.infoValue}>{customer.wechat || '-'}</div>
          </div>
        </div>
        
        {/* 公司信息 */}
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>公司信息</div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>公司名称：</div>
            <div className={styles.infoValue}>{customer.company || '-'}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>行业：</div>
            <div className={styles.infoValue}>{customer.industry || '-'}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>规模：</div>
            <div className={styles.infoValue}>{customer.scale || '-'}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>职位：</div>
            <div className={styles.infoValue}>{customer.position || '-'}</div>
          </div>
        </div>
        
        {/* 地址信息 */}
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>地址信息</div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>省市区：</div>
            <div className={styles.infoValue}>
              {customer.province && customer.city && customer.district
                ? `${customer.province} ${customer.city} ${customer.district}`
                : '-'}
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>详细地址：</div>
            <div className={styles.infoValue}>{customer.address || '-'}</div>
          </div>
        </div>
      </div>
      
      {/* 消息记录 */}
      <div className={styles.messagesTitle}>消息记录</div>
      <div className={styles.messagesTable}>
        <Table 
          columns={columns} 
          dataSource={mockMessages}
          pagination={{ pageSize: 5 }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
} 
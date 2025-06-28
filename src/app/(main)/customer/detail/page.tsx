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
  message,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomerStore } from '@/store/customer';
import { AgentItem } from '@/services/agents';
import { SessionItem } from '@/services/sessions';
import { TopicItem } from '@/services/topics';

const { Title, Text } = Typography;

// 创建样式
const useStyles = createStyles(({ css, token }) => ({
  pageContainer: css`
    padding: 24px;
    background-color: #f0f2f5;
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

export default function CustomerDetail() {
  const { styles } = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 获取URL参数
  const sessionId = searchParams.get('id');

  // 从 Store 获取状态和方法
  const {
    currentCustomer,
    loading,
    agents,
    fetchCustomerDetail,
    updateCustomer,
    deleteCustomer,
    fetchAgents,
    setCurrentCustomer
  } = useCustomerStore();

  // 本地状态
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 加载客户数据和相关信息
  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) {
        message.error('缺少客户ID参数');
        router.push('/customer');
        return;
      }

      try {
        // 并行加载客户详情、话题列表和代理列表
        await Promise.all([
          fetchCustomerDetail(sessionId),
          loadTopics(sessionId),
          fetchAgents()
        ]);
      } catch (error) {
        console.error('加载数据失败:', error);
        message.error('加载客户数据失败');
      }
    };

    loadData();
  }, [sessionId, fetchCustomerDetail, fetchAgents, router]);

  // 加载话题列表
  const loadTopics = async (sessionId: string) => {
    setTopicsLoading(true);
    try {
      // 这里应该调用话题服务获取该客户的话题列表
      // 暂时使用空数组，等待话题服务接口实现
      setTopics([]);
    } catch (error) {
      console.error('加载话题失败:', error);
      message.error('加载话题列表失败');
    } finally {
      setTopicsLoading(false);
    }
  };

  // 清理当前客户数据
  useEffect(() => {
    return () => {
      setCurrentCustomer(undefined);
    };
  }, [setCurrentCustomer]);

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
    if (!sessionId || !currentCustomer) return;

    setDeleting(true);
    try {
      await deleteCustomer(sessionId);
      message.success('客户删除成功！');
      router.push('/customer');
    } catch (error) {
      console.error('删除客户失败:', error);
      message.error('删除客户失败，请重试');
    } finally {
      setDeleting(false);
    }
  };

  // 员工搜索过滤
  const filteredEmployees = agents.filter(
    agent => (agent.title || '').toLowerCase().includes(employeeSearchText.toLowerCase())
  );

  // 处理员工分配
  const handleAssignEmployee = async (agent: AgentItem) => {
    if (!sessionId || !currentCustomer) return;

    setUpdating(true);
    try {
      // 暂时显示成功消息，等待接口实现
      message.success(`已将客户 ${currentCustomer.session.title || '客户'} 分配给 ${agent.title}`);
      
      // TODO: 实现真实的员工分配逻辑
      // const updateData = {
      //   ...currentCustomer.session,
      //   agent: agent
      // };
      // await updateCustomer(sessionId, updateData);
      // await fetchCustomerDetail(sessionId);
    } catch (error) {
      console.error('分配员工失败:', error);
      message.error('分配员工失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  // 话题记录表格列定义
  const columns = [
    {
      title: '主题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '消息数量',
      dataIndex: 'messageCount',
      key: 'messageCount',
      render: (count: number) => count || 0
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortField === 'createdAt' ? (sortOrder as any) : null,
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-'
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="text" 
          onClick={() => router.push(`/chat?session=${sessionId}&topic=${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 处理表格变化
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  if (loading || !currentCustomer) {
    return (
        <div className={styles.pageContainer}>
          <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
            <div style={{ marginTop: 8 }}>加载中...</div>
          </Spin>
        </div>
    );
  }

  const { session, extend } = currentCustomer;
  const assignedAgent = session.agent;

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
              className={styles.actionButton}
              onClick={handleDelete}
              loading={deleting}
              danger
            >
              删除
            </Button>
            <Button
              type="primary"
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
                    {(session.title || '客户').charAt(0)}
                  </Avatar>
                </div>
                <div>
                  <div className={styles.customerName}>{session.title || '未命名客户'}</div>
                  <div className={styles.customerMeta}>创建时间：{session.createdAt ? new Date(session.createdAt).toLocaleString('zh-CN') : '-'}</div>
                  <div className={styles.customerNotes}>备注：{extend?.notes || '-'}</div>
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
                            {item.title}
                          </List.Item>
                        )}
                        style={{ height: '150px', overflow: 'auto' }}
                      />
                    </div>
                  }
                >
                  <div className={styles.assigneeValue}>
                    {assignedAgent?.title || '未分配'} <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
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
              <div className={styles.infoValue}>{extend?.phone || '-'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>邮箱：</div>
              <div className={styles.infoValue}>{extend?.email || '-'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>微信号：</div>
              <div className={styles.infoValue}>{extend?.wechat || '-'}</div>
            </div>
          </div>

          {/* 公司信息 */}
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>公司信息</div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>公司名称：</div>
              <div className={styles.infoValue}>{extend?.company || '-'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>行业：</div>
              <div className={styles.infoValue}>{extend?.industry || '-'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>规模：</div>
              <div className={styles.infoValue}>{extend?.scale || '-'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>职位：</div>
              <div className={styles.infoValue}>{extend?.position || '-'}</div>
            </div>
          </div>

          {/* 地址信息 */}
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>地址信息</div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>省市区：</div>
              <div className={styles.infoValue}>
                {extend?.province && extend?.city && extend?.district
                  ? `${extend.province} ${extend.city} ${extend.district}`
                  : '-'}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>详细地址：</div>
              <div className={styles.infoValue}>{extend?.address || '-'}</div>
            </div>
          </div>
        </div>

        {/* 话题记录 */}
        <div className={styles.messagesTitle}>话题记录</div>
        <div className={styles.messagesTable}>
          <Table
            columns={columns}
            dataSource={topics}
            loading={topicsLoading}
            pagination={{
              pageSize: 5,
              showTotal: (total) => `共 ${total} 条记录`,
              locale: {
                items_per_page: '条/页',
                jump_to: '跳至',
                page: '页'
              }
            }}
            onChange={handleTableChange}
            locale={{
              triggerDesc: '点击降序排列',
              triggerAsc: '点击升序排列',
              cancelSort: '取消排序',
              emptyText: '暂无话题记录'
            }}
          />
        </div>
      </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Tooltip, Typography, Space, Divider, Form, Input, message, Spin, Empty, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import Link from 'next/link';

import { useAgentStore } from '@/store/agent/store';
import { agentSelectors } from '@/store/agent/selectors';
import TemplateModal from './components/templateModal';
import DeleteModal from './components/deleteModal';

const { Title, Paragraph } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    padding: 16px 24px;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
  `,
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  subHeader: css`
    height: 34px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0;
  `,
  backButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
  `,
  cardGrid: css`
    margin-top: 16px;
  `,
  card: css`
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    overflow: hidden;
    height: 280px;
    display: flex;
    flex-direction: column;
  `,
  cardContent: css`
    flex: 1;
    padding: 8px;
    height: 240px;
    display: flex;
    flex-direction: column;
  `,
  cardImage: css`
    width: 100%;
    height: 132px;
    object-fit: cover;
  `,
  cardTitle: css`
    margin-top: 8px;
    font-size: 16px;
    font-weight: 500;
  `,
  cardDescription: css`
    margin-top: 4px;
    color: ${token.colorTextSecondary};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `,
  cardFooter: css`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  `,
  footerButton: css`
    color: ${token.colorText};
    cursor: pointer;
    font-size: 14px;
    &:hover {
      color: ${token.colorPrimary};
    }
  `,
  footerDivider: css`
    height: 20px;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.06);
  `,
  addButton: css`
    background-color: #000;
    color: #fff;
    &:hover, &:focus {
      background-color: #333;
      color: #fff;
    }
  `,
}));

export default function CustomerTemplatePage() {
  const { styles } = useStyles();

  // agent store hooks
  const agents = useAgentStore(agentSelectors.agents);
  const isLoading = useAgentStore(agentSelectors.isLoading);
  const error = useAgentStore(agentSelectors.error);
  const fetchAgents = useAgentStore((s) => s.fetchAgents);
  const createAgent = useAgentStore((s) => s.createAgent);
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const deleteAgent = useAgentStore((s) => s.deleteAgent);

  // 弹窗表单相关
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<{id?: string, initial?: any}|null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 删除弹窗相关
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 拉取 agent 列表
  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  // 合并新增/编辑弹窗逻辑
  const openModal = (agent?: any) => {
    if (agent) {
      setEditing({ id: agent.id, initial: agent });
      form.setFieldsValue({
        title: agent.title,
        description: agent.description,
        avatar: agent.avatar,
      });
    } else {
      setEditing(null);
      form.resetFields();
    }
    setModalOpen(true);
  };

  // 删除（弹出转移弹窗）
  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  // 删除弹窗确认
  const handleDeleteModalOk = async (transferToId: string) => {
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
    // TODO: 这里可实现转移逻辑
    message.success('转移并删除成功（仅UI，逻辑待实现）');
  };

  // 删除弹窗取消
  const handleDeleteModalCancel = () => {
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  // 提交表单（合并新增/编辑）
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      if (editing?.id) {
        await updateAgent(editing.id, { id: editing.id, ...values });
        message.success('编辑成功');
      } else {
        await createAgent(values);
        message.success('添加成功');
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    } catch (e) {
      // 校验失败或接口异常
    } finally {
      setSubmitting(false);
    }
  };

  // 关闭弹窗
  const handleModalCancel = () => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      {/* 顶部导航 */}
      <div className={styles.header}>
        <Link href="/customer" className={styles.backButton}>
          <ArrowLeftOutlined style={{ marginRight: 8 }} />
          返回客户管理
        </Link>
      </div>

      {/* 子标题和添加按钮 */}
      <div className={styles.subHeader}>
        <Title level={4} style={{ margin: 0 }}>客户模版配置</Title>
        <Button className={styles.addButton} onClick={() => openModal()}>
          添加客户类型
        </Button>
      </div>

      {/* 卡片网格/数据区，撑满高度，支持溢出滚动 */}
      <Spin spinning={isLoading} tip="加载中...">
        <div style={{ minHeight: '60vh' }}>
          {error ? (
            <Empty description={error} style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          ) : agents.length === 0 ? (
            <Empty description="暂无客户模版" style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          ) : (
            <Row gutter={[16, 16]} className={styles.cardGrid}>
              {agents.map((agent) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={agent.id}>
                  <div className={styles.card}>
                    <div className={styles.cardContent}>
                      <img 
                        src={'/test.png'}
                        alt={agent.title}
                        className={styles.cardImage} 
                      />
                      <div className={styles.cardTitle}>{agent.title}</div>
                      <Tooltip title={agent.description}>
                        <div className={styles.cardDescription}>
                          {agent.description}
                        </div>
                      </Tooltip>
                    </div>
                    <div className={styles.cardFooter}>
                      <span 
                        className={styles.footerButton} 
                        onClick={() => openModal(agent)}
                      >
                        编辑
                      </span>
                      <div className={styles.footerDivider} />
                      <span 
                        className={styles.footerButton} 
                        onClick={() => handleDelete(agent.id)}
                      >
                        删除
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Spin>

      <TemplateModal
        open={modalOpen}
        onCancel={handleModalCancel}
        onOk={async (values) => {
          setSubmitting(true);
          try {
            if (editing?.id) {
              await updateAgent(editing.id, { id: editing.id, ...values });
              message.success('编辑成功');
            } else {
              await createAgent(values);
              message.success('添加成功');
            }
            setModalOpen(false);
            setEditing(null);
            form.resetFields();
          } catch (e) {
            // 校验失败或接口异常
          } finally {
            setSubmitting(false);
          }
        }}
        loading={submitting}
        initialValues={editing?.initial}
        modelOptions={[
          { label: 'claude-3.5-sonnet', value: 'claude-3.5-sonnet' },
          { label: 'gemini-2.0-flash', value: 'gemini-2.0-flash' },
          { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
          { label: 'gpt-4', value: 'gpt-4' },
        ]}
        onUploadImage={async (file) => {
          // 这里需要你实现上传逻辑，返回图片url
          // 示例：return await uploadImage(file);
          return '';
        }}
      />
      <DeleteModal
        open={deleteModalOpen}
        onCancel={handleDeleteModalCancel}
        onOk={handleDeleteModalOk}
        agents={agents}
        currentId={deleteTargetId || ''}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { Form, Divider, FormInstance, Input } from 'antd';

// Features
import CustomerTypeSelector from './features/CustomerTypeSelector';
import AvatarUploader from './features/AvatarUploader';
import { BasicInfoSection, NotesSection } from './features/FormSections';
import FormActions from './features/FormActions';
import { useSharedStyles } from './features/shared/styles';

import { AgentItem } from '@/services/agents';

export type CustomerFormData = {
  // Session 相关字段 (排除 id)
  slug: string;
  title: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  type?: 'agent' | 'group';
  userId: string;
  groupId?: string;
  clientId?: string;
  pinned?: boolean;
  messageCount?: number;
  agentsToSessions: {
    agent: AgentItem;
    agentId: string;
    sessionId: string;
    userId: string;
  }[];

  // Extend 相关字段 (排除 id, sessionId, timestamps)
  gender: string | null;
  age: number | null;
  work: string | null;
  maritalStatus: 'Married' | 'Unmarried' | null;
  familySituation: string | null;
  hobby: string | null;
  chatConfig: any; // AgentConfig

  // 表单专用字段
  region?: string[];
  sessionId?: string;
  agentId?: string;
};

export interface CustomerFormProps {
  form: FormInstance<CustomerFormData>;
  mode: 'create' | 'edit';
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  agents: AgentItem[];
  submitLoading?: boolean;
}

export default function CustomerForm({
  form,
  agents,
  mode,
  onSubmit,
  onCancel,
  submitLoading,
}: CustomerFormProps) {
  const { styles } = useSharedStyles();

  // 处理表单提交
  const handleSubmit = async (values: CustomerFormData) => {
    try {
      // 构建提交数据
      const submitData = {
        ...values,
      };
      await onSubmit(submitData);
      // 成功消息由父组件处理，不在这里显示
    } catch (error) {
      // 错误消息由父组件处理，这里不显示
      console.error('表单提交失败:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Form
        disabled={submitLoading}
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        requiredMark={true}
      >
        <Form.Item hidden name='sessionId'>
          <Input />
        </Form.Item>
        {/* 客户类型选择 */}
        <CustomerTypeSelector agents={agents} />

        <Divider />
        {/* 头像上传 */}
        <AvatarUploader disabled={submitLoading} />

        <Divider />

        {/* 基本信息 */}
        <BasicInfoSection />

        <Divider />

        {/* 备注 */}
        <NotesSection />

        {/* 提交按钮 */}
        <FormActions
          mode={mode}
          onCancel={onCancel}
          submitting={!!submitLoading}
        />
      </Form>
    </div>
  );
}

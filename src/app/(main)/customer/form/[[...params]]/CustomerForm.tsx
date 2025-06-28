'use client';

import React, { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';

// Features
import Header from './features/Header';
import CustomerTypeSelector from './features/CustomerTypeSelector';
import AvatarUploader from './features/AvatarUploader';
import {
  BasicInfoSection,
  ContactInfoSection,
  CompanyInfoSection,
  AddressInfoSection,
  NotesSection,
} from './features/FormSections';
import FormActions from './features/FormActions';
import { useSharedStyles } from './features/shared/styles';

import { CustomerItem } from '@/services';
import { AgentItem } from '@/services/agents';

export type CustomerFormData = CustomerItem['extend'] &
  CustomerItem['session'] & {
    region?: string[];
  };

export interface CustomerFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  agents: AgentItem[];
}

export default function CustomerForm({
  agents,
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: CustomerFormProps) {
  const { styles } = useSharedStyles();

  // 表单实例
  const [form] = Form.useForm();

  // 状态管理
  const [customerType, setCustomerType] = useState(
    agents.length > 0 ? agents[0].id : ''
  );

  const [avatarUrl, setAvatarUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.setFieldsValue(initialData);
      if (initialData.avatar) {
        setAvatarUrl(initialData.avatar);
      }
    }
    // 确保客户类型有默认值
    if (agents.length > 0 && !customerType) {
      setCustomerType(agents[0].id);
    }
  }, [mode, initialData, form, agents, customerType]);

  // 处理表单提交
  const handleSubmit = async (values: CustomerFormData) => {
    setSubmitting(true);
    try {
      // 构建提交数据
      const submitData = {
        ...values,
        province: values.region ? values.region[0] : '',
        city: values.region ? values.region[1] : '',
        district: values.region ? values.region[2] : '',
      };

      await onSubmit(submitData);
      // 成功消息由父组件处理，不在这里显示
    } catch (error) {
      // 错误消息由父组件处理，这里不显示
      console.error('表单提交失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 顶部返回导航 */}
      <Header onCancel={onCancel} />
      {/* 表单区域 */}
      <div className={styles.formContainer}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          disabled={loading || submitting}
          requiredMark={true}
        >
          {/* 客户类型选择 */}
          <CustomerTypeSelector agents={agents} />

          <Divider />
          {/* 头像上传 */}
          <AvatarUploader disabled={loading || submitting} />

          <Divider />

          {/* 基本信息 */}
          <BasicInfoSection />

          {/* 联系方式 */}
          <ContactInfoSection />

          {/* 公司信息 */}
          <CompanyInfoSection />

          {/* 地址信息 */}
          <AddressInfoSection />

          <Divider />

          {/* 备注 */}
          <NotesSection />

          {/* 提交按钮 */}
          <FormActions
            mode={mode}
            submitting={submitting}
            onCancel={onCancel}
          />
        </Form>
      </div>
    </div>
  );
}

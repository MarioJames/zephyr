'use client';

import React, { useState, useEffect } from 'react';
import { Form, Divider, FormInstance } from 'antd';

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
import { OmitTimestamps } from '@/types';

export type CustomerFormData = OmitTimestamps<
  CustomerItem['extend'] & CustomerItem['session']
> & {
  region?: string[];
  sessionId?: string;
  extendId?: string;
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
        province: values.region ? values.region[0] : '',
        city: values.region ? values.region[1] : '',
        district: values.region ? values.region[2] : '',
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
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        disabled={submitLoading}
        requiredMark={true}
      >
        <Form.Item name='sessionId' hidden />
        {/* 客户类型选择 */}
        <CustomerTypeSelector agents={agents} />

        <Divider />
        {/* 头像上传 */}
        <AvatarUploader disabled={submitLoading} />

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
          submitting={submitLoading}
          onCancel={onCancel}
        />
      </Form>
    </div>
  );
}

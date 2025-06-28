'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  Upload,
  message,
  Row,
  Col,
  Cascader,
  
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  UploadOutlined
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import {
  type CustomerFormProps,
  type CustomerFormData,
  genderOptions,
  ageOptions,
  industryOptions,
  scaleOptions,
  provinceOptions,
  customerTypeOptions
} from '@/types/customer-form';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
    align-items: center;
    margin-bottom: 24px;
  `,
  backButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
  `,
  typeContainer: css`
    width: 100%;
    height: 85px;
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  `,
  typeBox: css`
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    background-color: ${token.colorBgContainer};
    border-radius: 4px;
    transition: all 0.3s;
  `,
  typeBoxSelected: css`
    border: 1px solid ${token.colorText};
  `,
  typeBoxUnselected: css`
    border: 1px solid ${token.colorSplit};
  `,
  typeTitle: css`
    font-size: 16px;
    font-weight: bold;
  `,
  typeDesc: css`
    font-size: 12px;
    color: ${token.colorTextQuaternary};
  `,
  checkIcon: css`
    position: absolute;
    top: 10px;
    right: 10px;
    color: ${token.colorText};
    font-size: 18px;
  `,
  avatarContainer: css`
    display: flex;
    align-items: center;
    margin: 16px 0;
  `,
  avatarCircle: css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${token.colorBgContainer};
    border: 1px dashed ${token.colorSplit};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    overflow: hidden;
  `,
  sectionTitle: css`
    font-size: 16px;
    font-weight: bold;
    margin: 24px 0 16px;
  `,
  formLabel: css`
    display: block;
    margin-bottom: 8px;
  `,
  requiredLabel: css`
    &::before {
      content: '*';
      color: ${token.colorError};
      margin-right: 4px;
    }
  `,
  buttonsContainer: css`
    display: flex;
    justify-content: center;
    margin-top: 24px;
    gap: 16px;
  `,
  formContainer: css`
    background-color: ${token.colorBgContainer};
    padding: 24px;
    border-radius: 8px;
  `,
}));

export default function CustomerForm({
  mode,
  initialData,
  customerId,
  onSubmit,
  onCancel,
  loading = false
}: CustomerFormProps) {
  const { styles } = useStyles();

  // 表单实例
  const [form] = Form.useForm();

  // 状态管理
  const [customerType, setCustomerType] = useState('A');
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
  }, [mode, initialData, form]);

  // 处理表单提交
  const handleSubmit = async (values: CustomerFormData) => {
    setSubmitting(true);
    try {
      // 构建提交数据
      const submitData = {
        ...values,
        type: customerType,
        avatar: avatarUrl,
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

  // 处理上传头像
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      // 实际项目中，这里应该获取上传后的URL
      // 这里仅做模拟
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      message.success('头像上传成功！');
    }
  };

  return (
      <div className={styles.pageContainer}>
        {/* 顶部返回导航 */}
        <div className={styles.header}>
          <div className={styles.backButton} onClick={onCancel}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            <span>返回客户管理</span>
          </div>
        </div>

        {/* 客户类型选择 */}
        <Title level={5}>选择客户类型</Title>
        <div className={styles.typeContainer}>
          {customerTypeOptions.map((type) => (
            <div
              key={type.value}
              className={`${styles.typeBox} ${
                customerType === type.value ? styles.typeBoxSelected : styles.typeBoxUnselected
              }`}
              onClick={() => setCustomerType(type.value)}
            >
              <div className={styles.typeTitle}>{type.label}</div>
              <div className={styles.typeDesc}>{type.description}</div>
              {customerType === type.value && <CheckCircleFilled className={styles.checkIcon} />}
            </div>
          ))}
        </div>

        <Divider />

        {/* 表单区域 */}
        <div className={styles.formContainer}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={loading || submitting}
            requiredMark={true}
          >
            {/* 头像上传 */}
            <Title level={5}>头像</Title>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarCircle}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: '#999' }}>头像</div>
                )}
              </div>
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('只能上传图片文件！');
                  }
                  return isImage || Upload.LIST_IGNORE;
                }}
                onChange={handleAvatarChange}
                customRequest={({ onSuccess }) => {
                  // 模拟上传成功
                  setTimeout(() => {
                    onSuccess?.("ok");
                  }, 500);
                }}
              >
                <Button icon={<UploadOutlined />}>上传头像</Button>
              </Upload>
            </div>

            <Divider />

            {/* 基本信息 */}
            <div className={styles.sectionTitle}>基本信息</div>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="gender"
                  label="性别"
                >
                  <Select placeholder="请选择性别">
                    {genderOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="age"
                  label="年龄"
                >
                  <Select placeholder="请选择年龄">
                    {ageOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="position"
                  label="职位"
                >
                  <Input placeholder="请输入职位" />
                </Form.Item>
              </Col>
            </Row>

            {/* 联系方式 */}
            <div className={styles.sectionTitle}>联系方式</div>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { type: 'email', message: '请输入正确的邮箱格式' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="wechat"
                  label="微信号"
                >
                  <Input placeholder="请输入微信号" />
                </Form.Item>
              </Col>
            </Row>

            {/* 公司信息 */}
            <div className={styles.sectionTitle}>公司信息</div>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="company"
                  label="公司名称"
                >
                  <Input placeholder="请输入公司名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="industry"
                  label="行业"
                >
                  <Select placeholder="请选择行业">
                    {industryOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="scale"
                  label="规模"
                >
                  <Select placeholder="请选择公司规模">
                    {scaleOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 地址信息 */}
            <div className={styles.sectionTitle}>地址信息</div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="region"
                  label="省市区"
                >
                  <Cascader options={provinceOptions} placeholder="请选择省市区" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="详细地址"
                >
                  <Input placeholder="请输入详细地址" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* 备注 */}
            <Form.Item
              name="notes"
              label="备注"
            >
              <TextArea rows={2} placeholder="请输入备注信息" />
            </Form.Item>

            {/* 提交按钮 */}
            <div className={styles.buttonsContainer}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {mode === 'edit' ? '更新客户' : '添加客户'}
              </Button>
              <Button onClick={onCancel}>取消</Button>
            </div>
          </Form>
        </div>
      </div>
  );
}

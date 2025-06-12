'use client';

import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Space, 
  Divider, 
  Typography, 
  Upload, 
  message,
  Row,
  Col,
  Cascader,
  ConfigProvider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckCircleFilled, 
  UploadOutlined 
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import zhCN from 'antd/locale/zh_CN';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
    background-color: white;
    border-radius: 4px;
    transition: all 0.3s;
  `,
  typeBoxSelected: css`
    border: 1px solid #000;
  `,
  typeBoxUnselected: css`
    border: 1px solid #e8e8e8;
  `,
  typeTitle: css`
    font-size: 16px;
    font-weight: bold;
  `,
  typeDesc: css`
    font-size: 12px;
    color: #666;
  `,
  checkIcon: css`
    position: absolute;
    top: 10px;
    right: 10px;
    color: #000;
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
    background-color: #fff;
    border: 1px dashed #d9d9d9;
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
      color: #ff4d4f;
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
    background-color: white;
    padding: 24px;
    border-radius: 8px;
  `,
}));

// 模拟客户数据（用于编辑模式）
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
};

// 性别选项
const genderOptions = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
  { value: '其他', label: '其他' },
];

// 年龄选项
const ageOptions = Array.from({ length: 60 }, (_, i) => {
  const age = i + 18; // 从18岁开始
  return { value: age.toString(), label: `${age}岁` };
});

// 行业选项
const industryOptions = [
  { value: '互联网', label: '互联网' },
  { value: '金融', label: '金融' },
  { value: '教育', label: '教育' },
  { value: '医疗', label: '医疗' },
  { value: '制造业', label: '制造业' },
  { value: '服务业', label: '服务业' },
  { value: '其他', label: '其他' },
];

// 公司规模选项
const scaleOptions = [
  { value: '少于50人', label: '少于50人' },
  { value: '50-200人', label: '50-200人' },
  { value: '200-500人', label: '200-500人' },
  { value: '500-1000人', label: '500-1000人' },
  { value: '1000-5000人', label: '1000-5000人' },
  { value: '5000-10000人', label: '5000-10000人' },
  { value: '10000人以上', label: '10000人以上' },
];

// 省市区选项（简化版）
const provinceOptions = [
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '余杭区', label: '余杭区' },
          { value: '滨江区', label: '滨江区' },
        ],
      },
      {
        value: '宁波市',
        label: '宁波市',
        children: [
          { value: '海曙区', label: '海曙区' },
          { value: '江北区', label: '江北区' },
        ],
      },
    ],
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' },
        ],
      },
    ],
  },
];

export default function CustomerEdit() {
  const { styles } = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取URL参数，判断是新增还是编辑模式
  const id = searchParams.get('id');
  const isEdit = !!id;
  
  // 表单实例
  const [form] = Form.useForm();
  
  // 状态管理
  const [customerType, setCustomerType] = useState('A');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 如果是编辑模式，加载客户数据
  useEffect(() => {
    if (isEdit) {
      // 实际项目中，这里应该调用API获取客户数据
      // 这里使用模拟数据
      setLoading(true);
      
      // 模拟API请求延迟
      setTimeout(() => {
        form.setFieldsValue({
          name: mockCustomerData.name,
          gender: mockCustomerData.gender,
          age: mockCustomerData.age,
          position: mockCustomerData.position,
          phone: mockCustomerData.phone,
          email: mockCustomerData.email,
          wechat: mockCustomerData.wechat,
          company: mockCustomerData.company,
          industry: mockCustomerData.industry,
          scale: mockCustomerData.scale,
          address: mockCustomerData.address,
          region: [mockCustomerData.province, mockCustomerData.city, mockCustomerData.district],
          notes: mockCustomerData.notes,
        });
        
        setCustomerType(mockCustomerData.type);
        if (mockCustomerData.avatar) {
          setAvatarUrl(mockCustomerData.avatar);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [isEdit, form]);
  
  // 处理表单提交
  const handleSubmit = (values) => {
    setLoading(true);
    
    // 构建提交数据
    const submitData = {
      ...values,
      type: customerType,
      avatar: avatarUrl,
      province: values.region ? values.region[0] : '',
      city: values.region ? values.region[1] : '',
      district: values.region ? values.region[2] : '',
    };
    
    // 模拟API请求
    setTimeout(() => {
      console.log('提交的数据:', submitData);
      message.success(isEdit ? '客户信息更新成功！' : '客户添加成功！');
      setLoading(false);
      router.push('/customer');
    }, 1000);
  };
  
  // 处理上传头像
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // 实际项目中，这里应该获取上传后的URL
      // 这里仅做模拟
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      message.success('头像上传成功！');
    }
  };
  
  // 处理返回
  const handleBack = () => {
    router.push('/customer');
  };
  
  // 客户类型描述
  const customerTypeDesc = {
    A: 'A类客户：重要客户，需要重点关注和维护',
    B: 'B类客户：常规客户，定期维护和跟进',
    C: 'C类客户：潜在客户，需要培养和发展',
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.pageContainer}>
        {/* 顶部返回导航 */}
        <div className={styles.header}>
          <div className={styles.backButton} onClick={handleBack}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            <span>返回客户管理</span>
          </div>
        </div>
        
        {/* 客户类型选择 */}
        <Title level={5}>选择客户类型</Title>
        <div className={styles.typeContainer}>
          {['A', 'B', 'C'].map((type) => (
            <div
              key={type}
              className={`${styles.typeBox} ${
                customerType === type ? styles.typeBoxSelected : styles.typeBoxUnselected
              }`}
              onClick={() => setCustomerType(type)}
            >
              <div className={styles.typeTitle}>{type}类客户</div>
              <div className={styles.typeDesc}>{customerTypeDesc[type]}</div>
              {customerType === type && <CheckCircleFilled className={styles.checkIcon} />}
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
            disabled={loading}
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
                    onSuccess("ok", null);
                  }, 500);
                }}
              >
                <Button>上传头像</Button>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEdit ? '更新客户' : '添加客户'}
              </Button>
              <Button onClick={handleBack}>取消</Button>
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
} 
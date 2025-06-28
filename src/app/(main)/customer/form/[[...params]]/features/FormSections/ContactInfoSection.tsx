import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { useSharedStyles } from '../shared/styles';

export default function ContactInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>联系方式</div>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name='phone'
            label='手机号'
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder='请输入手机号' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='email'
            label='邮箱'
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input placeholder='请输入邮箱' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='wechat' label='微信号'>
            <Input placeholder='请输入微信号' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

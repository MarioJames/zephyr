import React from 'react';
import { Form, Row, Col } from 'antd';
import { Input } from '@lobehub/ui';
import { useSharedStyles } from '../shared/styles';

export default function ContactInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>联系方式</div>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            label='手机号'
            name='phone'
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input className={styles.inputBg} placeholder='请输入手机号' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label='邮箱'
            name='email'
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input className={styles.inputBg} placeholder='请输入邮箱' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='微信号' name='wechat'>
            <Input className={styles.inputBg} placeholder='请输入微信号' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

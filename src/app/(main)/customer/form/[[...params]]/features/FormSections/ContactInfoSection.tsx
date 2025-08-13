import React from 'react';
import { Form, Row, Col } from 'antd';
import { Input } from '@lobehub/ui';
import { LinkOutlined } from '@ant-design/icons';
import { useSharedStyles } from '../shared/styles';
import { PHONE_CHECK_URL } from '@/const/base'

// 打开韩国手机号去重查询网站
const handlePhoneCheckClick = () => {
  window.open(PHONE_CHECK_URL, '_blank', 'noopener,noreferrer');
};

export default function ContactInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>联系方式</div>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            label={
              <div style={{ display: 'flex', gap: '12px' }}>
                <span>手机号</span>
                <a
                  onClick={handlePhoneCheckClick}
                  style={{ 
                    color: '#1677ff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="点击查询手机号去重"
                >
                  <LinkOutlined />
                  <span>手机号去重查询</span>
                </a>
              </div>
            }
            name='phone'
            rules={[
              { required: true, message: '请输入手机号' }
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

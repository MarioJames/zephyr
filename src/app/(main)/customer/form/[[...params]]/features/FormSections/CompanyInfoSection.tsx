import React from 'react';
import { Form, Row, Col } from 'antd';
import { Input } from '@lobehub/ui';
import { useSharedStyles } from '../shared/styles';

export default function CompanyInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>个人信息</div>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label='公司名称' name='company'>
            <Input className={styles.inputBg} placeholder='请输入公司名称' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='行业' name='industry'>
            <Input className={styles.inputBg} placeholder='请输入行业' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='公司规模' name='scale'>
            <Input className={styles.inputBg} placeholder='请输入公司规模' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

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
          <Form.Item name='company' label='公司名称'>
            <Input placeholder='请输入公司名称' className={styles.inputBg} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='industry' label='行业'>
            <Input placeholder='请选择行业' className={styles.inputBg} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='scale' label='规模'>
            <Input placeholder='请选择公司规模' className={styles.inputBg} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

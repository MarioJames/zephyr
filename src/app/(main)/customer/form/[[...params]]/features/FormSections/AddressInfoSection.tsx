import React from 'react';
import { Form, Row, Input, Col } from 'antd';
import { useSharedStyles } from '../shared/styles';

export default function AddressInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>地址信息</div>
      <Row gutter={24} style={{ padding: '0 8px 0 0' }}>
        <Col span={16}>
          <Form.Item name='address' style={{ width: '100%' }}>
            <Input className={styles.inputBg} placeholder='请输入地址' style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

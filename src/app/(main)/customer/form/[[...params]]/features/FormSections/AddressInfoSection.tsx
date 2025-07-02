import React from 'react';
import { Form, Row, Input } from 'antd';
import { useSharedStyles } from '../shared/styles';

export default function AddressInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>地址信息</div>
      <Row gutter={24}>
        <Form.Item name='address'>
          <Input.TextArea placeholder='请输入地址' className={styles.inputBg} />
        </Form.Item>
      </Row>
    </>
  );
}

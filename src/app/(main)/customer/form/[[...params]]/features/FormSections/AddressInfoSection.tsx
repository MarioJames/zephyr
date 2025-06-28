import React from 'react';
import { Form, Input, Cascader, Row, Col } from 'antd';
import { PROVINCE_OPTIONS } from '@/const/customer';
import { useSharedStyles } from '../shared/styles';

export default function AddressInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>地址信息</div>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name='region' label='省市区'>
            <Cascader options={PROVINCE_OPTIONS} placeholder='请选择省市区' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='address' label='详细地址'>
            <Input placeholder='请输入详细地址' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

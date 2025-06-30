import React from 'react';
import { Form, Row, Col } from 'antd';
import { Input, Select } from '@lobehub/ui';
import { INDUSTRY_OPTIONS, SCALE_OPTIONS } from '@/const/customer';
import { useSharedStyles } from '../shared/styles';

export default function CompanyInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>公司信息</div>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name='company' label='公司名称'>
            <Input placeholder='请输入公司名称' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='industry' label='行业'>
            <Select placeholder='请选择行业' options={INDUSTRY_OPTIONS} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='scale' label='规模'>
            <Select placeholder='请选择公司规模' options={SCALE_OPTIONS} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

import React from 'react';
import { Form, Row, Col } from 'antd';
import { Input, Select, InputNumber } from '@lobehub/ui';
import { GENDER_OPTIONS } from '@/const/customer';
import { useSharedStyles } from '../shared/styles';

export default function BasicInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>基本信息</div>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            name='title'
            label='姓名'
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder='请输入姓名' className={styles.inputBg} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='gender' label='性别'>
            <Select placeholder='请选择性别' options={GENDER_OPTIONS} className={styles.selectBg} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='age' label='年龄'>
            <InputNumber
              min={18}
              max={100}
              placeholder='请输入年龄'
              style={{ width: '100%' }}
              className={styles.inputBg}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='position' label='职位'>
            <Input placeholder='请输入职位' className={styles.inputBg} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

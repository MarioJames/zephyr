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
            label='姓名'
            name='title'
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input className={styles.inputBg} placeholder='请输入姓名' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label='性别' name='gender'>
            <Select className={styles.selectBg} options={GENDER_OPTIONS} placeholder='请选择性别' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label='年龄' name='age'>
            <InputNumber
              className={styles.inputBg}
              max={100}
              min={18}
              placeholder='请输入年龄'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label='职位' name='position'>
            <Input className={styles.inputBg} placeholder='请输入职位' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

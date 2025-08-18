import React from 'react';
import { Form, Row, Col } from 'antd';
import { Input, Select, InputNumber } from '@lobehub/ui';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '@/const/customer';
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
          <Form.Item label='工作' name='work'>
            <Input className={styles.inputBg} placeholder='请输入工作' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label='婚姻状况' name='isSingle'>
            <Select className={styles.selectBg} options={MARITAL_STATUS_OPTIONS} placeholder='请选择婚姻状况' />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item label='家庭情况' name='familySituation'>
            <Input className={styles.inputBg} placeholder='请输入家庭情况' />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item label='兴趣爱好' name='hobby'>
            <Input className={styles.inputBg} placeholder='请输入兴趣爱好' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

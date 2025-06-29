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
        <Input.TextArea placeholder='请输入省市区' />{' '}
      </Row>
    </>
  );
}

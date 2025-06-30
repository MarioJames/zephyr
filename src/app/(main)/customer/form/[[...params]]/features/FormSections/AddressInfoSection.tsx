import React from 'react';
import { Row } from 'antd';
import { Input } from '@lobehub/ui';
import { useSharedStyles } from '../shared/styles';

export default function AddressInfoSection() {
  const { styles } = useSharedStyles();

  return (
    <>
      <div className={styles.sectionTitle}>地址信息</div>
      <Row gutter={24}>
        <Input placeholder='请输入省市区' />
      </Row>
    </>
  );
}

import React from 'react';
import { Button } from 'antd';
import { FormActionsProps } from './shared/types';
import { useSharedStyles } from './shared/styles';

export default function FormActions({
  mode,
  submitting,
  onCancel
}: FormActionsProps) {
  const { styles } = useSharedStyles();

  return (
    <div className={styles.buttonsContainer}>
      <Button type='primary' htmlType='submit' loading={submitting}>
        {mode === 'edit' ? '更新客户' : '添加客户'}
      </Button>
      <Button onClick={onCancel}>取消</Button>
    </div>
  );
}

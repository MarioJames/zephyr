import React from 'react';
import { Form } from 'antd';
import { TextArea } from '@lobehub/ui';
import { useSharedStyles } from '../shared/styles';

export default function NotesSection() {
  const { styles } = useSharedStyles();

  return (
    <Form.Item name='description' label='备注'>
      <TextArea rows={2} placeholder='请输入备注信息' className={styles.inputBg} />
    </Form.Item>
  );
}

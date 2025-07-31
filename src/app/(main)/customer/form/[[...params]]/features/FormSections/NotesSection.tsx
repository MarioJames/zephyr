import React from 'react';
import { Form } from 'antd';
import { TextArea } from '@lobehub/ui';
import { useSharedStyles } from '../shared/styles';

export default function NotesSection() {
  const { styles } = useSharedStyles();

  return (
    <Form.Item label='备注' name='description'>
      <TextArea className={styles.inputBg} placeholder='请输入备注信息' rows={2} />
    </Form.Item>
  );
}

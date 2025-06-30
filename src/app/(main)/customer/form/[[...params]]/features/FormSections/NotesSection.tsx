import React from 'react';
import { Form } from 'antd';
import { TextArea } from '@lobehub/ui';

export default function NotesSection() {
  return (
    <Form.Item name='description' label='备注'>
      <TextArea rows={2} placeholder='请输入备注信息' />
    </Form.Item>
  );
}

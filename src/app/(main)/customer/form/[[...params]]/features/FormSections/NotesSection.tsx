import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

export default function NotesSection() {
  return (
    <Form.Item name='description' label='备注'>
      <TextArea rows={2} placeholder='请输入备注信息' />
    </Form.Item>
  );
}

import React from 'react';
import { Form, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { CustomerTypeSelectorProps } from '../shared/types';
import { useCustomerTypeSelectorStyles } from './styles';

const { Title } = Typography;

export default function CustomerTypeSelector({
  agents,
}: CustomerTypeSelectorProps) {
  const form = Form.useFormInstance();

  const agentId = Form.useWatch('agentId', form);

  const { styles } = useCustomerTypeSelectorStyles();

  return (
    <>
      <Title level={5}>选择客户类型</Title>
      <Form.Item name='agentId' hidden />
      <div className={styles.typeContainer}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`${styles.typeBox} ${
              agentId === agent.id
                ? styles.typeBoxSelected
                : styles.typeBoxUnselected
            }`}
            onClick={() => form.setFieldValue('agentId', agent.id)}
          >
            <div className={styles.typeTitle}>{agent.title}</div>
            <div className={styles.typeDesc}>{agent.description}</div>
            {agentId === agent.id && (
              <CheckCircleFilled className={styles.checkIcon} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

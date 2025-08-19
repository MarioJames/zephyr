import React from 'react';
import { Form, Input, Typography } from 'antd';
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
      <Form.Item hidden name='agentId'>
        <Input />
      </Form.Item>
      <div className={styles.typeContainer}>
        {agents && agents.length > 0 ? (
          agents.map((agent) => (
            <div
              className={`${styles.typeBox} ${
                agentId === agent.id
                  ? styles.typeBoxSelected
                  : styles.typeBoxUnselected
              }`}
              key={agent.id}
              onClick={() =>
                form.setFields([
                  {
                    name: 'agentId',
                    value: agent.id,
                  },
                ])
              }
            >
              <div className={styles.typeTitle}>{agent.title}</div>
              <div className={styles.typeDesc}>{agent.description}</div>
              {agentId === agent.id && (
                <CheckCircleFilled className={styles.checkIcon} />
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            暂无可选客户类型，请联系管理员进行添加
          </div>
        )}
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { Popover, Input, List } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { AgentItem } from '@/services/agents';

const useStyles = createStyles(({ css, token }) => ({
  assigneeContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,
  assigneeTitle: css`
    font-size: 14px;
    color: ${token.colorText};
    margin-bottom: 8px;
  `,
  assigneeValue: css`
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
  popoverContent: css`
    width: 197px;
    height: 214px;
  `,
  popoverSearch: css`
    margin-bottom: 8px;
  `,
}));

export interface EmployeeAssignmentPanelProps {
  assignedAgent?: AgentItem;
  agents: AgentItem[];
  onAssign: (agent: AgentItem) => void;
  updating: boolean;
}

export const EmployeeAssignmentPanel: React.FC<
  EmployeeAssignmentPanelProps
> = ({ assignedAgent, agents, onAssign, updating }) => {
  const { styles } = useStyles();
  const [employeeSearchText, setEmployeeSearchText] = useState('');

  // 员工搜索过滤
  const filteredEmployees = agents.filter((agent) =>
    (agent.title || '').toLowerCase().includes(employeeSearchText.toLowerCase())
  );

  return (
    <div className={styles.assigneeContainer}>
      <div className={styles.assigneeTitle}>对接人</div>
      <Popover
        trigger='click'
        placement='bottom'
        title='选择对接人'
        content={
          <div className={styles.popoverContent}>
            <Input
              placeholder='搜索员工'
              className={styles.popoverSearch}
              value={employeeSearchText}
              onChange={(e) => setEmployeeSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <List
              size='small'
              dataSource={filteredEmployees}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={() => onAssign(item)}
                >
                  {item.title}
                </List.Item>
              )}
              style={{ height: '150px', overflow: 'auto' }}
            />
          </div>
        }
      >
        <div className={styles.assigneeValue}>
          {assignedAgent?.title || '未分配'}{' '}
          <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
        </div>
      </Popover>
    </div>
  );
};

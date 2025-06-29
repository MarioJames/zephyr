import React, { useState } from 'react';
import { Modal, Button, List, Avatar } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { createStyles } from 'antd-style';

interface AgentItem {
  id: string;
  title: string;
  description?: string;
  avatar?: string;
}

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (transferToId: string) => void;
  agents: AgentItem[];
  currentId: string; // 当前要删除的 agent id
}

const useStyles = createStyles(({ css, token }) => ({
  modalBody: css`
    height: 600px;
    display: flex;
    flex-direction: column;
    padding: 32px;
  `,
  title: css`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  `,
  list: css`
    flex: 1;
    overflow: auto;
    margin-bottom: 24px;
  `,
  item: css`
    width: 100%;
    height: 64px;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    background: #F7F7F7;
    cursor: pointer;
    position: relative;
    transition: background 0.2s;
  `,
  itemSelected: css`
    background: #FFF !important;
  `,
  avatar: css`
    width: 112px !important;
    height: 48px !important;
    margin-right: 16px;
    border-radius: 8px !important;
    object-fit: cover;
  `,
  itemContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  `,
  itemTitle: css`
    font-weight: 500;
    font-size: 16px;
    color: #222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  itemDesc: css`
    font-size: 13px;
    color: #888;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  footer: css`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `,
}));

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onCancel, onOk, agents, currentId }) => {
  const { styles, cx } = useStyles();
  // 过滤掉当前要删除的 agent
  const filteredAgents = agents.filter(a => a.id !== currentId);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  return (
    <Modal
      open={open}
      title="删除客户类型"
      onCancel={onCancel}
      footer={null}
      width={470}
      centered
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.modalBody}>
        <div className={styles.title}>
          请将该客户类型客户转移到其他类型
        </div>
        <div className={styles.list}>
          <List
            dataSource={filteredAgents}
            renderItem={item => {
              const selected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  className={cx(styles.item, selected && styles.itemSelected)}
                  onClick={() => setSelectedId(item.id)}
                >
                  <Avatar src={item.avatar || '/test.png'} shape="square" size={48} className={styles.avatar} />
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemDesc}>{item.description}</div>
                  </div>
                  {selected && (
                    <CheckCircleFilled style={{ color: '#518ded', fontSize: 22, position: 'absolute', right: 16, top: 16 }} />
                  )}
                </div>
              );
            }}
          />
        </div>
        <div className={styles.footer}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            type="primary"
            disabled={!selectedId}
            onClick={() => selectedId && onOk(selectedId)}
          >
            转移并删除
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

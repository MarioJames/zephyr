import React, { useState } from 'react';
import { List, Avatar } from 'antd';
import { Button, Modal } from '@lobehub/ui';
import { CircleCheck } from 'lucide-react';
import { createStyles } from 'antd-style';
import { useAgentStore } from '@/store/agent';

interface AgentItem {
  id: string;
  title: string;
  description?: string;
  avatar?: string;
}

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (transferToId: string, deleteId: string) => void;
  agents: AgentItem[];
  currentId: string; // 当前要删除的 agent id
}

const useStyles = createStyles(({ css, token }) => ({
  modalBody: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${token.colorBgElevated};
  `,
  title: css`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  `,
  list: css`
    flex: 1;
    overflow: auto;
    margin-bottom: 12px;
  `,
  item: css`
    width: 100%;
    height: 64px;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid ${token.colorBorder};
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    background: ${token.colorBgElevated};
    cursor: pointer;
    position: relative;
    transition: background 0.2s;
  `,
  itemSelected: css`
    background: ${token.colorFillSecondary} !important;
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
    color: ${token.colorText};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  itemDesc: css`
    font-size: 14px;
    margin-top: 8px;
    overflow: hidden;
    color: ${token.colorText};
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  footer: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `,
}));

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onCancel,
  onOk,
  agents,
  currentId,
}) => {
  const { styles, cx } = useStyles();
  // 过滤掉当前要删除的 agent
  const filteredAgents = agents.filter((a) => a.id !== currentId);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const loading = useAgentStore((state) => state.isDeleting);

  return (
    <Modal
      centered
      footer={null}
      onCancel={onCancel}
      open={open}
      styles={{
        body: {
          height: 600,
          padding: '0 24px 24px 24px',
        },
      }}
      title='删除客户类型'
      width={450}
    >
      <div className={styles.modalBody}>
        <div className={styles.title}>请将该客户类型客户转移到其他类型</div>
        <div className={styles.list}>
          <List
            dataSource={filteredAgents}
            renderItem={(item) => {
              const selected = selectedId === item.id;
              return (
                <div
                  className={cx(styles.item, selected && styles.itemSelected)}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <Avatar
                    className={styles.avatar}
                    shape='square'
                    size={48}
                    src={item.avatar || '/test.png'}
                  />
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemDesc}>{item.description}</div>
                  </div>
                  {selected && <CircleCheck size={16} />}
                </div>
              );
            }}
          />
        </div>
        <div className={styles.footer}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            disabled={!selectedId}
            loading={loading}
            onClick={() => selectedId && onOk(selectedId, currentId)}
            type='primary'
          >
            转移并删除
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

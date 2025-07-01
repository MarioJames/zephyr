import React from "react";
import { Button, Modal } from '@lobehub/ui';
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css, token }) => ({
  cardActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  `,
  cancelButton: css`
    border: 1px solid ${token.colorBorder};
  `,
}));

export interface SendLoginGuideModalProps {
  open: boolean;
  loading: boolean;
  employee: { email?: string; username?: string; fullName?: string } | null;
  theme: any;
  onCancel: () => void;
  onSend: () => void;
}

const SendLoginGuideModal: React.FC<SendLoginGuideModalProps> = ({
  open,
  loading,
  employee,
  theme,
  onCancel,
  onSend,
}) => {
  const { styles } = useStyles();
  return (
    <Modal
      title="发送邮件引导员工登录系统"
      open={open}
      footer={null}
      onCancel={onCancel}
      width={400}
      closable={false}
      styles={{
        content: {
          padding: 24,
        },
      }}
    >
      <div>
        <p>将向员工发送登录引导邮件，包含系统访问地址和登录说明。</p>
        <p>
          <strong>收件邮箱：</strong>
          <span
            style={{
              color: employee?.email ? theme.colorText : "#ff4d4f",
            }}
          >
            {employee?.email || "邮箱地址不存在"}
          </span>
        </p>
        <p>
          <strong>员工姓名：</strong>
          {employee?.username || employee?.fullName || "未设置"}
        </p>
        <div className={styles.cardActions}>
          <Button className={styles.cancelButton} onClick={onCancel}>
            取消
          </Button>
          <Button
            loading={loading}
            disabled={!employee?.email}
            onClick={onSend}
            type="primary"
          >
            确认发送
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendLoginGuideModal; 
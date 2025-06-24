import { ActionIcon } from '@lobehub/ui';
import { App } from 'antd';
import { createStyles } from 'antd-style';
import { Trash, MoreVertical } from 'lucide-react';
import { memo } from 'react';
import { useSessionStore } from '@/store/session';

const useStyles = createStyles(({ css }) => ({
  modalRoot: css`
    z-index: 2000;
  `,
}));

interface ActionProps {
  id: string;
}

const Actions = memo<ActionProps>(({ id }) => {
  const { styles } = useStyles();
  const removeSession = useSessionStore((s) => s.removeSession);
  const { modal, message } = App.useApp();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    modal.confirm({
      centered: true,
      okButtonProps: { danger: true },
      onOk: async () => {
        await removeSession(id);
        message.success('助手删除成功');
      },
      rootClassName: styles.modalRoot,
      title: '即将删除该助手，删除后将无法找回，请确认你的操作',
    });
  };

  return (
    <ActionIcon
      icon={MoreVertical}
      size={{ blockSize: 28, size: 16 }}
      onClick={handleDelete}
      title="删除"
    />
  );
});

export default Actions;

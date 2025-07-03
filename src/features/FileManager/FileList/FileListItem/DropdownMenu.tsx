import { ActionIcon, Dropdown, Icon, copyToClipboard } from '@lobehub/ui';
import { App } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import {
  DownloadIcon,
  LinkIcon,
  MoreHorizontalIcon,
  Trash,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useFileStore } from '@/store/file';
import { downloadFile } from '@/utils/client/downloadFile';

interface DropdownMenuProps {
  name: string;
  id: string;
  url: string;
}

const DropdownMenu = memo<DropdownMenuProps>(({ id, url, name }) => {
  const { t } = useTranslation(['components', 'common']);
  const { message, modal } = App.useApp();

  const [removeFile] = useFileStore((s) => [s.removeFileItem]);

  const items = useMemo(() => {
    return [
      {
        icon: <Icon icon={LinkIcon} />,
        key: 'copyUrl',
        label: t('FileManager.actions.copyUrl'),
        onClick: async ({ domEvent }) => {
          domEvent.stopPropagation();
          await copyToClipboard(url);
          message.success(t('FileManager.actions.copyUrlSuccess'));
        },
      },
      {
        icon: <Icon icon={DownloadIcon} />,
        key: 'download',
        label: t('download', { ns: 'common' }),
        onClick: async ({ domEvent }) => {
          domEvent.stopPropagation();
          const key = 'file-downloading';
          message.loading({
            content: t('FileManager.actions.downloading'),
            duration: 0,
            key,
          });
          await downloadFile(url, name);
          message.destroy(key);
        },
      },
      {
        type: 'divider',
      },
      {
        danger: true,
        icon: <Icon icon={Trash} />,
        key: 'delete',
        label: t('delete', { ns: 'common' }),
        onClick: async ({ domEvent }) => {
          domEvent.stopPropagation();
          modal.confirm({
            content: t('FileManager.actions.confirmDelete'),
            okButtonProps: { danger: true },
            onOk: async () => {
              await removeFile(id);
            },
          });
        },
      },
    ] as ItemType[];
  }, []);

  return (
    <Dropdown menu={{ items }}>
      <ActionIcon icon={MoreHorizontalIcon} size={'small'} />
    </Dropdown>
  );
});

export default DropdownMenu;

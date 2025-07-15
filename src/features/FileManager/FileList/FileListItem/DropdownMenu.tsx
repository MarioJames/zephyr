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

import { useFileStore } from '@/store/file';
import { downloadFile } from '@/utils/downloadFile';

interface DropdownMenuProps {
  name: string;
  id: string;
  url: string;
}

const DropdownMenu = memo<DropdownMenuProps>(({ id, url, name }) => {
  const { message, modal } = App.useApp();

  const [removeFile] = useFileStore((s) => [s.removeFileItem]);

  const items = useMemo(() => {
    return [
      {
        icon: <Icon icon={LinkIcon} />,
        key: 'copyUrl',
        label: '复制链接',
        onClick: async ({ domEvent }) => {
          domEvent.stopPropagation();
          await copyToClipboard(url);
          message.success('文件地址复制成功');
        },
      },
      {
        icon: <Icon icon={DownloadIcon} />,
        key: 'download',
        label: '下载',
        onClick: async ({ domEvent }) => {
          domEvent.stopPropagation();
          const key = 'file-downloading';
          message.loading({
            content: '文件下载中...',
            duration: 0,
            key,
          });

          const fileName = name.split('.').pop() || 'downloaded-file';
          downloadFile(url, fileName);
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
        label: '删除',
        onClick: async ({ domEvent }) => {
          domEvent.stopPropagation();
          modal.confirm({
            content: '即将删除该文件，删除后该将无法找回，请确认你的操作',
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

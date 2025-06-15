import { Avatar, Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { InboxIcon } from 'lucide-react';
import { Center, Flexbox } from 'react-layout-kit';
import Balancer from 'react-wrap-balancer';

import SkeletonLoading from '@/components/BrandTextLoading';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import FileItem from './Item';

const FileList = () => {
  const files = useChatStore(chatSelectors.currentUserFiles, isEqual);
  const theme = useTheme();
  const isCurrentChatLoaded = useChatStore(chatSelectors.isCurrentChatLoaded);

  return !isCurrentChatLoaded ? (
    <Flexbox gap={12} paddingInline={12}>
      <SkeletonLoading />
    </Flexbox>
  ) : files.length === 0 ? (
    <Center
      gap={8}
      paddingBlock={24}
      style={{ border: `1px dashed ${theme.colorSplit}`, borderRadius: 8, marginInline: 12 }}
    >
      <Avatar
        avatar={<Icon icon={InboxIcon} size={'large'} />}
        background={theme.colorFillTertiary}
        size={48}
      />
      <Balancer>
        <Typography.Text type={'secondary'}>当前知识列表为空</Typography.Text>
      </Balancer>
    </Center>
  ) : (
    <Flexbox gap={12} paddingInline={12}>
      {files.map((m) => (
        <FileItem {...m} key={m.id} />
      ))}
    </Flexbox>
  );
};

export default FileList;

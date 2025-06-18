import { ActionIcon, Dropdown, EditableText, Icon, type MenuProps } from '@lobehub/ui';
import { App, Typography } from 'antd';
import { createStyles } from 'antd-style';
import {
  LucideCopy,
  LucideLoader2,
  MoreVertical,
  PencilLine,
  Star,
  Trash,
  Wand2,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import BubblesLoading from '@/components/BubblesLoading';
import { LOADING_FLAT } from '@/const/base';
import { useChatStore } from '@/store/chat';

const useStyles = createStyles(({ css }) => ({
  content: css`
    position: relative;
    overflow: hidden;
    flex: 1;
  `,
  title: css`
    flex: 1;
    height: 28px;
    line-height: 28px;
    text-align: start;
  `,
}));
const { Paragraph } = Typography;

interface TopicContentProps {
  fav?: boolean;
  id: string;
  showMore?: boolean;
  title: string;
}

const TopicContent = memo<TopicContentProps>(({ id, title, fav, showMore }) => {

  const [
    editing,
    updateTopicTitle,
    removeTopic,
    autoRenameTopicTitle,
    duplicateTopic,
    isLoading,
  ] = useChatStore((s) => [
    s.topicRenamingId === id,
    s.updateTopicTitle,
    s.removeTopic,
    s.autoRenameTopicTitle,
    s.duplicateTopic,
    s.topicLoadingIds.includes(id),
  ]);
  const { styles, theme } = useStyles();

  const toggleEditing = (visible?: boolean) => {
    useChatStore.setState({ topicRenamingId: visible ? id : '' });
  };

  const { modal } = App.useApp();

  const items = useMemo<MenuProps['items']>(
    () => [
      {
        icon: <Icon icon={Wand2} />,
        key: 'autoRename',
        label: '智能重命名',
        onClick: () => {
          autoRenameTopicTitle(id);
        },
      },
      {
        icon: <Icon icon={PencilLine} />,
        key: 'rename',
        label: '编辑',
        onClick: () => {
          toggleEditing(true);
        },
      },
      {
        type: 'divider',
      },
      {
        icon: <Icon icon={LucideCopy} />,
        key: 'duplicate',
        label: '创建副本',
        onClick: () => {
          duplicateTopic(id);
        },
      },
      // {
      //   icon: <Icon icon={LucideDownload} />,
      //   key: 'export',
      //   label: t('topic.actions.export'),
      //   onClick: () => {
      //     configService.exportSingleTopic(sessionId, id);
      //   },
      // },
      {
        type: 'divider',
      },
      // {
      //   icon: <Icon icon={Share2} />,
      //   key: 'share',
      //   label: t('share'),
      // },
      {
        danger: true,
        icon: <Icon icon={Trash} />,
        key: 'delete',
        label: '删除',
        onClick: () => {
          if (!id) return;

          modal.confirm({
            centered: true,
            okButtonProps: { danger: true },
            onOk: async () => {
              await removeTopic(id);
            },
            title: '即将删除该话题，删除后将不可恢复，请谨慎操作。',
          });
        },
      },
    ],
    [],
  );

  return (
    <Flexbox
      align={'center'}
      gap={8}
      horizontal
      justify={'space-between'}
      onDoubleClick={(e) => {
        if (!id) return;
        if (e.altKey) toggleEditing(true);
      }}
    >
      <ActionIcon
        color={fav && !isLoading ? theme.colorWarning : undefined}
        fill={fav && !isLoading ? theme.colorWarning : 'transparent'}
        icon={isLoading ? LucideLoader2 : Star}
        onClick={(e) => {
          e.stopPropagation();
          if (!id) return;
        }}
        size={'small'}
        spin={isLoading}
      />
      {!editing ? (
        title === LOADING_FLAT ? (
          <Flexbox flex={1} height={28} justify={'center'}>
            <BubblesLoading />
          </Flexbox>
        ) : (
          <Paragraph
            className={styles.title}
            ellipsis={{ rows: 1, tooltip: { placement: 'left', title } }}
            style={{ margin: 0 }}
          >
            {title}
          </Paragraph>
        )
      ) : (
        <EditableText
          editing={editing}
          onChangeEnd={(v) => {
            if (title !== v) {
              updateTopicTitle(id, v);
            }
            toggleEditing(false);
          }}
          onEditingChange={toggleEditing}
          showEditIcon={false}
          style={{ height: 28 }}
          value={title}
        />
      )}
      {(showMore) && !editing && (
        <Dropdown
          arrow={false}
          menu={{
            items: items,
            onClick: ({ domEvent }) => {
              domEvent.stopPropagation();
            },
          }}
          trigger={['click']}
        >
          <ActionIcon
            className="topic-more"
            icon={MoreVertical}
            onClick={(e) => {
              e.stopPropagation();
            }}
            size={'small'}
          />
        </Dropdown>
      )}
    </Flexbox>
  );
});

export default TopicContent;

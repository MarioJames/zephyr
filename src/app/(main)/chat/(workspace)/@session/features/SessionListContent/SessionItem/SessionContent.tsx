import { ActionIcon, Dropdown, Icon, type MenuProps } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { MoreVertical, PencilLine } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useRouter } from 'next/navigation';

import BubblesLoading from '@/components/Loading/BubblesLoading';
import { LOADING_FLAT } from '@/const/base';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

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
  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #d9d9d9;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    cursor: pointer;
  `,
  avatarImage: css`
    border-radius: 50%;
    width: 32px;
    height: 32px;
  `,
}));

interface SessionContentProps {
  id: string;
  showMore?: boolean;
  title: string;
  employeeName?: string;
  isRecent?: boolean;
  avatar?: string;
}

const SessionContent = memo<SessionContentProps>(
  ({ id, title, showMore, employeeName, isRecent, avatar }) => {
    const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);
    const { styles } = useStyles();
    const router = useRouter();

    const toggleEditing = () => {
      if (id) {
        router.push(`/customer/form/edit/${id}`);
      }
    };

    const items = useMemo<MenuProps['items']>(
      () => [
        {
          icon: <Icon icon={PencilLine} />,
          key: 'edit',
          label: '编辑客户信息',
          onClick: () => {
            toggleEditing();
          },
        },
      ],
      [id, isRecent]
    );
    return (
      <Flexbox
        align={'center'}
        gap={8}
        horizontal
        justify={'space-between'}
        onDoubleClick={(e) => {
          if (!id) return;
          if (e.altKey) toggleEditing();
        }}
      >
        <div
          className={styles.avatar}
          onClick={(e) => {
            e.stopPropagation();
            if (!id) return;
          }}
        >
          {avatar ? (
            <img
              alt='avatar'
              className={styles.avatarImage}
              src={avatar || ''}
            />
          ) : (
            title?.[0] || ''
          )}
        </div>
        <Flexbox
          direction='vertical'
          flex={1}
          justify='center'
          style={{ minWidth: 0 }}
        >
          {title === LOADING_FLAT ? (
            <Flexbox flex={1} height={28} justify={'center'}>
              <BubblesLoading />
            </Flexbox>
          ) : (
            <Typography.Paragraph
              className={styles.title}
              ellipsis={{ tooltip: { placement: 'left', title } }}
              style={{ margin: 0 }}
            >
              {title}
            </Typography.Paragraph>
          )}
          {isAdmin && (
            <Typography.Text style={{ fontSize: 12 }} type='secondary'>
              @{employeeName || '未知员工'}
            </Typography.Text>
          )}
        </Flexbox>
        {showMore && (
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
              className='topic-more'
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
  }
);

SessionContent.displayName = 'SessionContent';

export default SessionContent;

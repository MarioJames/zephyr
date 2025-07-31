'use client';

import { Skeleton, Popover, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { Suspense, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { ChevronDown, PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import TogglePanelButton from '@/app/(main)/chat/features/TogglePanelButton';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    position: relative;
    overflow: hidden;
    flex: 1;
    max-width: 100%;
  `,
  tag: css`
    flex: none;
    align-items: baseline;
  `,
  title: css`
    overflow: hidden;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  `,
  avatar: css`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${token.colorFillTertiary};
    user-select: none;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  `,
  avatarCircle: css`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${token.colorFillTertiary};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  popoverItem: css`
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 400;

    &:hover {
      background-color: ${token.colorFillSecondary};
    }
  `,
  tags: css`
    color: ${token.colorPrimary};
    background-color: ${token.colorSplit};
  `,
}));

const MainContent = memo<{ className?: string }>(({ className }) => {
  const { styles } = useStyles();
  const router = useRouter();
  const sessionId = useSessionStore(sessionSelectors.activeSessionId);
  const activeSession = useSessionStore(sessionSelectors.activeSession);
  const [isPinned] = useQueryState('pinned', parseAsBoolean);

  const showSessionPanel = useGlobalStore(globalSelectors.showSessionPanel);

  const handleEditCustomer = () => {
    router.push(`/customer/form/edit/${sessionId}`);
  };

  const popoverContent = (
    <div className={styles.popoverItem} onClick={handleEditCustomer}>
      <PencilLine size={16} />
      编辑客户信息
    </div>
  );

  return (
    <Flexbox align={'center'} className={className} gap={12} horizontal>
      {!isPinned && !showSessionPanel && <TogglePanelButton />}
      <div className={styles.avatar}>
        {activeSession?.avatar ? (
          <img src={activeSession?.avatar} alt='头像' />
        ) : (
          <div className={styles.avatarCircle}>
            {activeSession?.title?.slice(0, 1)}
          </div>
        )}
      </div>
      <Flexbox align={'center'} className={styles.container} gap={8} horizontal>
        <Popover
          content={popoverContent}
          trigger='click'
          placement='bottomLeft'
          arrow={false}
          styles={{
            root: {
              padding: '8px',
              borderRadius: '8px',
            },
            body: {
              padding: '8px',
            },
          }}
        >
          <div className={styles.title}>
            {activeSession?.title || '客户名称'}
            <ChevronDown size={14} />
          </div>
        </Popover>
        {activeSession?.agentsToSessions[0]?.agent?.title && (
          <Tag className={styles.tags}>
            {activeSession?.agentsToSessions[0]?.agent?.title}
          </Tag>
        )}
      </Flexbox>
    </Flexbox>
  );
});

MainContent.displayName = 'MainContent';

const Main = memo<{ className?: string }>(({ className }) => (
  <Suspense
    fallback={
      <Skeleton
        active
        avatar={{ shape: 'circle', size: 'default' }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    }
  >
    <MainContent className={className} />
  </Suspense>
));

Main.displayName = 'Main';

export default Main;

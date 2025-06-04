import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { WebBrowsingManifest } from '@/tools/web-browsing';

import { EngineAvatarGroup } from '../../../components/EngineAvatar';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    cursor: pointer;

    height: 100%;
    padding: 8px;
    border-radius: 8px;

    font-size: 12px;
    color: initial;

    background: ${token.colorFillQuaternary};

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  title: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    text-overflow: ellipsis;
  `,
}));

interface ShowMoreProps {
  engines: string[];
  messageId: string;
  resultsNumber: number;
}
const ShowMore = memo<ShowMoreProps>(({ messageId, engines, resultsNumber }) => {
  const { styles } = useStyles();
  const [openToolUI] = useChatStore((s) => [s.openToolUI]);

  return (
    <Flexbox
      className={styles.container}
      gap={2}
      justify={'space-between'}
      onClick={() => {
        openToolUI(messageId, WebBrowsingManifest.identifier);
      }}
    >
      <div className={styles.title}>{`查看更多搜索结果（共${resultsNumber}条）`}</div>
      <Flexbox align={'center'} gap={4} horizontal>
        <EngineAvatarGroup engines={engines} />
      </Flexbox>
    </Flexbox>
  );
});

export default ShowMore;

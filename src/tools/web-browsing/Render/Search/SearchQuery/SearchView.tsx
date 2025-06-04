import { Icon } from '@lobehub/ui';
import { Divider, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { SearchIcon } from 'lucide-react';
import { memo } from 'react';
import { shinyTextStylish } from '@/styles/loading';

import { EngineAvatarGroup } from '../../../components/EngineAvatar';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  font: css`
    font-size: 12px;
    color: ${token.colorTextTertiary};
  `,
  query: css`
    cursor: pointer;

    padding-block: 4px;
    padding-inline: 8px;
    border-radius: 8px;

    font-size: 12px;
    color: ${token.colorTextSecondary};

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  shinyText: shinyTextStylish(token),
}));

interface SearchBarProps {
  defaultEngines: string[];
  defaultQuery: string;
  onEditingChange: (editing: boolean) => void;
  resultsNumber: number;
  searching?: boolean;
}

const SearchBar = memo<SearchBarProps>(
  ({ defaultEngines, defaultQuery, resultsNumber, onEditingChange, searching }) => {
    const { styles, cx } = useStyles();
    return (
      <Flexbox
        align={'center'}
        distribution={'space-between'}
        gap={40}
        height={32}
        horizontal
      >
        <Flexbox
          align={'center'}
          className={cx(styles.query, searching && styles.shinyText)}
          gap={8}
          horizontal
          onClick={() => {
            onEditingChange(true);
          }}
        >
          <Icon icon={SearchIcon} />
          {defaultQuery}
        </Flexbox>

        <Flexbox align={'center'} horizontal>
          <div className={styles.font}>{'搜索引擎'}</div>
          {searching ? (
            <Skeleton.Button active size={'small'} />
          ) : (
            <EngineAvatarGroup engines={defaultEngines} />
          )}
            <>
              <Divider type={'vertical'} />
              <div className={styles.font}>{'搜索结果数'}</div>
              {searching ? <Skeleton.Button active size={'small'} /> : resultsNumber}
            </>
        </Flexbox>
      </Flexbox>
    );
  },
);
export default SearchBar;

import { createStyles } from 'antd-style';
import { rgba } from 'polished';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useFileStore } from '@/store/file';

import MultiSelectActions, { MultiSelectActionType } from './MultiSelectActions';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    height: 40px;
    padding-block-end: 12px;
    border-block-end: 1px solid ${isDarkMode ? token.colorSplit : rgba(token.colorSplit, 0.06)};
  `,
}));

interface MultiSelectActionsProps {
  selectCount: number;
  selectFileIds: string[];
  setSelectedFileIds: (ids: string[]) => void;
  total?: number;
  totalFileIds: string[];
}

const ToolBar = memo<MultiSelectActionsProps>(
  ({
    selectCount,
    setSelectedFileIds,
    selectFileIds,
    total,
    totalFileIds,
  }) => {
    const { styles } = useStyles();

    const [removeFiles] = useFileStore((s) => [s.removeFiles]);

    const onActionClick = async (type: MultiSelectActionType) => {
      switch (type) {
        case 'delete': {
          await removeFiles(selectFileIds);
          setSelectedFileIds([]);

          return;
        }
      }
    };

    return (
      <Flexbox align={'center'} className={styles.container} horizontal justify={'space-between'}>
        <MultiSelectActions
          onActionClick={onActionClick}
          onClickCheckbox={() => {
            setSelectedFileIds(selectCount === total ? [] : totalFileIds);
          }}
          selectCount={selectCount}
          total={total}
        />
      </Flexbox>
    );
  },
);

export default ToolBar;

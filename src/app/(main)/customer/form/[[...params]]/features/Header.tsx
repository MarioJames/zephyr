import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { HeaderProps } from './shared/types';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

const useStyles = createStyles(({ css }) => ({
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
  `,
  backButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
  `,
}));

export default function Header({ onCancel }: HeaderProps) {
  const { styles } = useStyles();
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  return (
    <div className={styles.header}>
      <div className={styles.backButton} onClick={onCancel}>
        <ArrowLeftOutlined style={{ marginRight: 8 }} />
        <span>{isAdmin ? '返回客户管理' : '返回首页'}</span>
      </div>
    </div>
  );
}

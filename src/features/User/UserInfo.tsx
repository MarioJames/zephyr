'use client';

import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import PlanTag from '@/features/User/PlanTag';

import UserAvatar, { type UserAvatarProps } from './UserAvatar';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

const useStyles = createStyles(({ css, token }) => ({
  nickname: css`
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
  `,
  username: css`
    line-height: 1;
    color: ${token.colorTextDescription};
  `,
}));

export interface UserInfoProps extends FlexboxProps {
  avatarProps?: Partial<UserAvatarProps>;
  onClick?: () => void;
}

const UserInfo = memo<UserInfoProps>(({ avatarProps, onClick, ...rest }) => {
  const { styles, theme } = useStyles();
  const [userInit, userName] = useGlobalStore((s) => [
    globalSelectors.userInit(s),
    globalSelectors.userName(s),
  ]);

  return (
    <Flexbox
      align={'center'}
      gap={12}
      horizontal
      justify={'space-between'}
      paddingBlock={12}
      paddingInline={12}
      {...rest}
    >
      <Flexbox align={'center'} gap={12} horizontal onClick={onClick}>
        <UserAvatar background={theme.colorFill} size={48} {...avatarProps} />
        <div className={styles.nickname}>{userName}</div>
      </Flexbox>
      {userInit && <PlanTag />}
    </Flexbox>
  );
});

export default UserInfo;

'use client';

import { Avatar, type AvatarProps } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { forwardRef } from 'react';

import { DEFAULT_USER_AVATAR_URL } from '@/const/base';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

const useStyles = createStyles(({ css, token }) => ({
  clickable: css`
    position: relative;
    transition: all 200ms ease-out 0s;

    &::before {
      content: '';

      position: absolute;
      transform: skewX(-45deg) translateX(-400%);

      overflow: hidden;

      box-sizing: border-box;
      width: 25%;
      height: 100%;

      background: rgba(255, 255, 255, 50%);

      transition: all 200ms ease-out 0s;
    }

    &:hover {
      box-shadow: 0 0 0 2px ${token.colorPrimary};

      &::before {
        transform: skewX(-45deg) translateX(400%);
      }
    }
  `,
}));

export interface UserAvatarProps extends AvatarProps {
  clickable?: boolean;
}

const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ size = 40, background, clickable, className, style, ...rest }, ref) => {
    const { styles, cx } = useStyles();
    const [avatar, currentUser] = useGlobalStore((s) => [
      globalSelectors.userAvatar(s),
      globalSelectors.currentUser(s),
    ]);

    const userInit = useGlobalStore(globalSelectors.userInit);

    return (
      <Avatar
        alt={userInit && (currentUser?.fullName || currentUser?.username) ? currentUser?.fullName || currentUser?.username : '默认'}
        avatar={userInit && !!avatar ? avatar : DEFAULT_USER_AVATAR_URL}
        background={userInit && avatar ? background : 'transparent'}
        className={cx(clickable && styles.clickable, className)}
        ref={ref}
        size={size}
        style={{ flex: 'none', ...style }}
        unoptimized
        {...rest}
      />
    );
  }
);

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;

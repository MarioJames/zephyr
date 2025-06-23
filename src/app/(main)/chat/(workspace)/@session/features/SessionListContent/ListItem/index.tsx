import { Avatar, List, type ListItemProps } from '@lobehub/ui';
import { useHover } from 'ahooks';
import { createStyles } from 'antd-style';
import { memo, useMemo, useRef } from 'react';

const { Item } = List;

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      position: relative;
      margin-block: 2px;
      padding-inline: 8px 16px;
      border-radius: ${token.borderRadius}px;
    `,
    title: css`
      line-height: 1.2;
    `,
  };
});

const ListItem = memo<ListItemProps & { avatar: string; avatarBackground?: string }>(
  ({ avatar, avatarBackground, active, showAction, actions, title, ...props }) => {
    const ref = useRef(null);
    const isHovering = useHover(ref);
    const { cx, styles } = useStyles();

    const avatarRender = useMemo(
      () => (
        <Avatar
          animation={isHovering}
          avatar={avatar}
          background={avatarBackground}
          shape="circle"
          size={40}
        />
      ),
      [isHovering, avatar, avatarBackground],
    );

    return (
      <Item
        actions={actions}
        active={active}
        avatar={avatarRender}
        className={cx(styles.container)}
        ref={ref}
        showAction={actions && (isHovering || showAction)}
        title={<span className={styles.title}>{title}</span>}
        {...(props as any)}
      />
    );
  },
);

export default ListItem;

import { createStyles } from "antd-style";
import React, { memo } from "react";
import { Flexbox } from "react-layout-kit";

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    color: ${token.colorTextQuaternary};
    background: ${token.colorBgContainerSecondary};
    box-shadow: 0 3px 4px -2px ${token.colorBgContainerSecondary};
  `,
  sessionTitle: css`
    color: ${token.colorText};
    font-size: 14px;
    font-weight: 600;
  `,
  count: css`
    color: ${token.colorTextQuaternary};
    font-size: 14;
    font-weight: 600;
    margin-left:10px;
  `,
}));

interface SessionGroupItemProps {
  count?: number;
  title:string;
}

const SessionGroupItem = memo<SessionGroupItemProps>(({ title, count }) => {
  const { styles } = useStyles();

  return (
    <>
      <Flexbox
        className={styles.container}
        paddingBlock={"12px 8px"}
        paddingInline={12}
        horizontal
        align="center"
      >
        <span className={styles.sessionTitle}>{title}</span>
        {typeof count === "number" && <span className={styles.count}>{count}</span>}
      </Flexbox>
    </>
  );
});

SessionGroupItem.displayName = 'SessionGroupItem';

export default SessionGroupItem;

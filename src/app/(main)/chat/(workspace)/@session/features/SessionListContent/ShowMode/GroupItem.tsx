import { createStyles } from "antd-style";
import React, { memo } from "react";
import { Flexbox } from "react-layout-kit";

import { GroupedTopic } from "@/types/topic";

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    color: ${token.colorTextQuaternary};
    background: ${token.colorBgContainerSecondary};
    box-shadow: 0 3px 4px -2px ${token.colorBgContainerSecondary};
  `,
  topicTitle: css`
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    font-weight: 600;
  `,
  count: css`
    color: "rgba(0, 0, 0, 0.45)";
    font-size: 14;
    font-weight: 600;
    margin-left:10px;
  `,
}));

interface SessionGroupItemProps extends Omit<GroupedTopic, "children"> {
  count?: number;
}

const SessionGroupItem = memo<SessionGroupItemProps>(({ title, count, id }) => {
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
        <span className={styles.topicTitle}>{title}</span>
        {typeof count === "number" && <span className={styles.count}>{count}</span>}
      </Flexbox>
    </>
  );
});
export default SessionGroupItem;

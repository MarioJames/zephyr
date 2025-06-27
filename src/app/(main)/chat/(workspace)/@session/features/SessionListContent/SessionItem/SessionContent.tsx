import {
  ActionIcon,
  Dropdown,
  Icon,
  type MenuProps,
} from "@lobehub/ui";
import { App, Typography } from "antd";
import { createStyles } from "antd-style";
import {
  MoreVertical,
  PencilLine,
  Trash,
} from "lucide-react";
import { memo, useMemo } from "react";
import { Flexbox } from "react-layout-kit";
import { useRouter } from "next/navigation";

import BubblesLoading from "@/components/BubblesLoading";
import { LOADING_FLAT } from "@/const/base";
import { useSessionStore } from '@/store/session';

const useStyles = createStyles(({ css }) => ({
  content: css`
    position: relative;
    overflow: hidden;
    flex: 1;
  `,
  title: css`
    flex: 1;
    height: 28px;
    line-height: 28px;
    text-align: start;
  `,
  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #D9D9D9;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    cursor: pointer;
  `
}));
    
interface SessionContentProps {
  id: string;
  showMore?: boolean;
  title: string;
  employeeName?: string;
  isRecent?: boolean;
}

const SessionContent = memo<SessionContentProps>(({ id, title, showMore, employeeName, isRecent }) => {
  const [deleteSession, removeFromRecentSessions] = useSessionStore((s) => [
    s.deleteSession,
    s.removeFromRecentSessions,
  ]);
  const { styles } = useStyles();
  const router = useRouter();

  const toggleEditing = () => {
    if (id) {
      router.push(`/customer/edit?id=${id}`);
    }
  };

  const { modal } = App.useApp();

  const items = useMemo<MenuProps["items"]>(
    () => [
      {
        icon: <Icon icon={PencilLine} />,
        key: "edit",
        label: "编辑客户信息",
        onClick: () => {
          toggleEditing();
        },
      },
      ...(isRecent
        ? [
            {
              danger: true,
              icon: <Icon icon={Trash} />,
              key: "delete",
              label: "从最近对话中移除",
              onClick: () => {
                if (!id) return;

                modal.confirm({
                  centered: true,
                  okButtonProps: { danger: true },
                  onOk: async () => {
                    removeFromRecentSessions(id);
                  },
                  title: "即将从最近对话中移除该客户，请确认",
                });
              },
            },
          ]
        : []),
    ],
    [id, deleteSession, isRecent]
  );
  return (
    <Flexbox
      align={"center"}
      gap={8}
      horizontal
      justify={"space-between"}
      onDoubleClick={(e) => {
        if (!id) return;
        if (e.altKey) toggleEditing();
      }}
    >
      <div
        className={styles.avatar}
        onClick={(e) => {
          e.stopPropagation();
          if (!id) return;
        }}
      >
        {title?.[0] || ''}
      </div>
      <Flexbox flex={1} style={{ minWidth: 0 }} direction="vertical" justify="center">
          {title === LOADING_FLAT ? (
            <Flexbox flex={1} height={28} justify={"center"}>
              <BubblesLoading />
            </Flexbox>
          ) : (
            <Typography.Paragraph
              className={styles.title}
              ellipsis={{ tooltip: { placement: "left", title } }}
              style={{ margin: 0 }}
            >
              {title}
            </Typography.Paragraph>
          )}
        {employeeName && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ rows: 1 }}>
            {employeeName}
          </Typography.Text>
        )}
      </Flexbox>
      {showMore && (
        <Dropdown
          arrow={false}
          menu={{
            items: items,
            onClick: ({ domEvent }) => {
              domEvent.stopPropagation();
            },
          }}
          trigger={["click"]}
        >
          <ActionIcon
            className="topic-more"
            icon={MoreVertical}
            onClick={(e) => {
              e.stopPropagation();
            }}
            size={"small"}
          />
        </Dropdown>
      )}
    </Flexbox>
  );
});

export default SessionContent;

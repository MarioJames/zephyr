import { Checkbox } from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { useRouter } from "next/navigation";
import { rgba } from "polished";
import { memo } from "react";
import { Center, Flexbox } from "react-layout-kit";

import FileIcon from "@/components/FileIcon";
import { FileItem } from "@/services/files";
import { formatSize } from "@/utils/format";

import DropdownMenu from "./DropdownMenu";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

export const FILE_DATE_WIDTH = 160;
export const FILE_SIZE_WIDTH = 140;

const useStyles = createStyles(({ css, token, cx, isDarkMode }) => {
  const hover = css`
    opacity: 0;
  `;
  return {
    checkbox: hover,
    container: css`
      margin-inline: 24px;
      border-block-end: 1px solid
        ${isDarkMode ? token.colorSplit : rgba(token.colorSplit, 0.06)};
      border-radius: ${token.borderRadius}px;

      &:hover {
        background: ${token.colorFillTertiary};

        .${cx(hover)} {
          opacity: 1;
        }
      }
    `,

    hover,
    item: css`
      padding-block: 0;
      padding-inline: 0 24px;
      color: ${token.colorTextSecondary};
    `,
    name: css`
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;

      margin-inline-start: 12px;

      color: ${token.colorText};
    `,
  };
});

interface FileRenderItemProps extends FileItem {
  index: number;
}

const FileRenderItem = memo<FileRenderItemProps>(
  ({ size, url, filename, fileType, hashId, createdAt }) => {
    const { styles, cx } = useStyles();
    const router = useRouter();

    const displayTime =
      dayjs().diff(dayjs(createdAt), "d") < 7
        ? dayjs(createdAt).fromNow()
        : dayjs(createdAt).format("YYYY-MM-DD");

    return (
      <Flexbox
        align={"center"}
        className={styles.container}
        height={64}
        horizontal
        paddingInline={8}
      >
        <Flexbox
          align={"center"}
          className={styles.item}
          distribution={"space-between"}
          flex={1}
          horizontal
        >
          <Flexbox
            align={"center"}
            horizontal
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`/file/${hashId}`);
            }}
          >
            <FileIcon fileName={filename} fileType={fileType} />
            <span className={styles.name}>{filename}</span>
          </Flexbox>
          <DropdownMenu id={hashId} name={filename} url={url} />
        </Flexbox>
        <Flexbox className={styles.item} width={FILE_DATE_WIDTH}>
          {displayTime}
        </Flexbox>
        <Flexbox className={styles.item} width={FILE_SIZE_WIDTH}>
          {formatSize(size)}
        </Flexbox>
      </Flexbox>
    );
  }
);

export default FileRenderItem;

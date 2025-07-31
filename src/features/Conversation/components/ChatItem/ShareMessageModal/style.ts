import { createStyles } from 'antd-style';

export const useContainerStyles = createStyles(({ css, token, stylish, cx }) => ({
  preview: cx(
    stylish.noScrollbar,
    css`
      overflow: hidden scroll;

      width: 100%;
      max-height: 70dvh;
      border: 1px solid ${token.colorBorder};
      border-radius: ${token.borderRadiusLG}px;

      background: ${token.colorBgLayout};

      * {
        pointer-events: none;

        ::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
        }
      }
    `,
  ),
}));

export const useStyles = createStyles(({ css }) => ({
  sidebar: css`
    flex: none;
    width: max(240px, 25%);
  `,
}));

import { createStyles } from 'antd-style';

export const useSharedStyles = createStyles(({ css, token }) => ({
  pageContainer: css`
    padding: 24px;
    background-color: ${token.colorBgContainer};
    min-height: 100vh;
    width: 100%;
    flex: 1;
    overflow: auto;
  `,
  formContainer: css`
    background-color: ${token.colorBgContainer};
    padding: 24px;
    border-radius: 8px;
    width: 100%;
  `,
  sectionTitle: css`
    font-size: 16px;
    font-weight: bold;
    margin: 24px 0 16px;
  `,
  buttonsContainer: css`
    display: flex;
    justify-content: center;
    margin-top: 24px;
    gap: 16px;
  `,
  inputBg: css`
    background: ${token.colorFillTertiary};
    border: 1px solid ${token.colorBorder};
    &:hover,
    &:focus {
      background: ${token.colorFillTertiary};
      border: 1px solid ${token.colorBorder};
    }
  `,
  selectBg: css`
    .ant-select-selector {
      background: ${token.colorFillTertiary} !important;
      border: 1px solid ${token.colorBorder} !important;
      box-shadow: none;
    }
  `,
}));

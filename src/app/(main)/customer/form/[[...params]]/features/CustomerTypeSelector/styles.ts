import { createStyles } from 'antd-style';

export const useCustomerTypeSelectorStyles = createStyles(({ css, token, isDarkMode }) => ({
  typeContainer: css`
    width: 100%;
    height: 85px;
    display: flex;
    gap: 20px;
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${token.colorTextQuaternary};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: ${token.colorFillQuaternary};
    }
  `,
  typeBox: css`
    flex: 1;
    min-width: 240px;
    max-width: 320px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    background-color: ${token.colorBgContainer};
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background: ${token.colorFill};
    }
  `,
  typeBoxSelected: css`
    border: 1px solid ${token.colorText};
    background: ${isDarkMode ? token.colorFillSecondary : token.colorFillTertiary};
  `,
  typeBoxUnselected: css`
    border: 1px solid ${token.colorSplit};
  `,
  typeTitle: css`
    font-size: 16px;
    font-weight: bold;
  `,
  typeDesc: css`
    font-size: 12px;
    color: ${token.colorTextQuaternary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  checkIcon: css`
    position: absolute;
    top: 10px;
    right: 10px;
    color: ${token.colorText};
    font-size: 18px;
  `,
}));

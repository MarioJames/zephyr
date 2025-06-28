import { createStyles } from 'antd-style';

export const useCustomerTypeSelectorStyles = createStyles(({ css, token, isDarkMode }) => ({
  typeContainer: css`
    width: 100%;
    height: 85px;
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  `,
  typeBox: css`
    flex: 1;
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
  `,
  checkIcon: css`
    position: absolute;
    top: 10px;
    right: 10px;
    color: ${token.colorText};
    font-size: 18px;
  `,
}));

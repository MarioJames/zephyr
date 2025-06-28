import { createStyles } from 'antd-style';

export const useAvatarUploaderStyles = createStyles(({ css, token }) => ({
  avatarContainer: css`
    display: flex;
    align-items: center;
    margin: 16px 0;
  `,
  avatarCircle: css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${token.colorBgContainer};
    border: 1px dashed ${token.colorSplit};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    overflow: hidden;
  `,
}));

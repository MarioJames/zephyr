import { createStyles } from 'antd-style';

export const useFormSkeletonStyles = createStyles(({ css, token }) => ({
  container: css`
    padding: 24px;
    background-color: ${token.colorBgContainer};
    min-height: 100vh;
    width: 100%;
    flex: 1;
    overflow: auto;
  `,

  headerSection: css`
    margin-bottom: 24px;
    height: 40px;
  `,

  formContainer: css`
    background-color: ${token.colorBgContainer};
    padding: 24px;
    border-radius: 8px;
    width: 100%;
  `,

  sectionBlock: css`
    margin-bottom: 32px;
  `,

  sectionTitle: css`
    margin-bottom: 16px;
    height: 22px;
  `,

  formRow: css`
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
  `,

  formItem: css`
    flex: 1;
    min-width: 200px;
  `,

  buttonGroup: css`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  `,

  button: css`
    width: 100px;
    height: 32px;
  `,

  divider: css`
    margin: 24px 0;
  `,

  typeSelector: css`
    margin-bottom: 24px;
  `,

  typeGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
  `,

  typeCard: css`
    height: 80px;
    border-radius: 8px;
  `,

  avatarSection: css`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  `,

  avatar: css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
  `,
}));

import { createStyles } from 'antd-style';

export const useHistoryStyles = createStyles(({ css, token }) => ({
  panelBg: css`
    background: ${token.colorBgContainer};
    transition: background 200ms ${token.motionEaseOut};
  `,
  header: css`
    height: 56px;
    padding: 0 24px;
  `,
  headerTitle: css`
    font-weight: 500;
    font-size: 14px;
  `,
  closeBtn: css`
    cursor: pointer;
  `,
  listWrap: css`
    overflow-y: auto;
    padding: 8px;
  `,
  historyItem: css`
    border-radius: 6px;
    padding: 8px 16px;
    transition: background 0.2s;
    cursor: pointer;
    &:hover {
      background: ${token.colorFill};
    }
  `,
  activeHistoryItem: css`
    background: ${token.colorFill};
  `,
  historyTitle: css`
    font-weight: 500;
    font-size: 14px;
  `,
  historyMeta: css`
    color: ${token.colorTextQuaternary};
    font-size: 12px;
    font-weight: 400;
  `,
  historyCount: css`
    font-weight: 400;
    font-size: 14px;
  `,
}));

export const useAIHintStyles = createStyles(({ css, token }) => ({
  panelBg: css`
    background: ${token.colorBgContainer};
  `,
  header: css`
    height: 56px;
    padding: 0 24px;
  `,
  headerTitle: css`
    font-weight: 500;
    font-size: 14px;
  `,
  listWrap: css`
    overflow-y: auto;
    padding: 0px 24px;
  `,
  dividerDate: css`
    display: flex;
    align-items: center;
    margin: 8px 0;
  `,
  dividerLine: css`
    flex: 1;
    height: 1px;
    background: ${token.colorSplit};
  `,
  dividerText: css`
    margin: 0 10px;
    color: ${token.colorText};
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
  `,
  hint: css`
    font-weight: 400;
    font-size: 14px;
    margin: 0px 8px 12px 8px;
    color: ${token.colorTextSecondary};
    line-height: 22px;
  `,
  cardGrid: css`
    width: 100%;
    margin-bottom: 8px;
    margin-top: 12px;
  `,
  cardItem: css`
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid ${token.colorSplit};
    background: ${token.colorBgContainer};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    min-height: 70px;
    min-width: 0;

    &:hover {
      background: ${token.colorFill};
    }
  `,
  cardTitle: css`
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 4px;
  `,
  cardDesc: css`
    color: ${token.colorTextSecondary};
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-all;
    min-width: 0;
  `,
  suggestTitle: css`
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    margin: 12px 0;
    padding: 0 8px;
  `,
  sectionTitle: css`
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
    color: ${token.colorPrimary};
    margin-bottom: 4px;
  `,
  sectionCard: css`
    padding: 10px;
    width: 100%;
    height: auto;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  sectionContent: css`
    background: ${token.colorFillSecondary};
    font-size: 13px;
    line-height: 22px;
    font-weight: 400;
    margin-bottom: 10px;
    padding: 10px;

    .ant-typography {
      color: ${token.colorTextSecondary};
      position: relative;
      margin-bottom: 0;

      .ant-typography-expand {
        color: ${token.colorTextQuaternary};
        font-size: 12px;
      }
    }
  `,
  sectionFooter: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 4px;
    margin-top: 8px;
  `,
  adoptBtn: css`
    color: ${token.colorText};
    height: 22px;
    background-color: ${token.colorPrimary};
    border: none;
    font-size: 13px;
    font-weight: 400;
    line-height: 22px;
    padding: 0 8px;
    border-radius: 6px;
    cursor: pointer;
  `,
  copyBtn: css`
    color: ${token.colorPrimary};
    cursor: pointer;
    margin-right: 12px;
  `,
}));

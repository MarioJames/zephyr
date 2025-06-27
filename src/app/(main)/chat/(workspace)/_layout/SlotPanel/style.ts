import { createStyles } from 'antd-style';

export const useHistoryStyles = createStyles(({ css, token, isDarkMode }) => ({
  panelBg: css`
    background: ${isDarkMode
      ? token.colorFillSecondary
      : token.colorFillTertiary};
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
    background: ${token.colorFillSecondary};
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
    color: ${token.colorTextQuaternary};
    line-height: 22px;
  `,
  cardGrid: css`
    width: 100%;
    margin-bottom: 8px;
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
  `,
  cardTitle: css`
    font-weight: 500;
    font-size: 12px;
    margin-bottom: 4px;
  `,
  cardDesc: css`
    color: ${token.colorTextQuaternary};
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
    padding: 0 8px;
  `,
  sectionCard: css`
    padding: 10px;
    width: 100%;
    height: auto;
    border-radius: 6px;
    background: ${token.colorFillSecondary};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  sectionDesc: css`
    color: ${token.colorTextQuaternary};
    font-size: 13px;
    line-height: 22px;
    font-weight: 400;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  `,
  sectionDescExpand: css`
    color: ${token.colorTextQuaternary};
    font-size: 13px;
    line-height: 22px;
    font-weight: 400;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  `,
  sectionFooter: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  expandBtn: css`
    color: ${token.colorTextQuaternary};
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
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
}));

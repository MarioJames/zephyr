import { createStyles } from 'antd-style';

export const useHistoryStyles = createStyles(({ css, token }) => ({
  panelBg: css`
    background: #F4F4F4;
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
      background: #fff;
    }
  `,
  historyTitle: css`
    font-weight: 500;
    font-size: 14px;
  `,
  historyMeta: css`
    color: rgba(0, 0, 0, 0.45);
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
    background: #F4F4F4;
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
    padding: 8px 24px;
  `,
  dividerDate: css`
    display: flex;
    align-items: center;
    margin: 16px 0;
  `,
  dividerLine: css`
    flex: 1;
    height: 1px;
    background: #E5E6EB;
  `,
  dividerText: css`
    margin: 0 16px;
    color: #000;
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
  `,
  hint: css`
    font-weight: 400;
    font-size: 14px;
    margin: 8px 8px 12px 8px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  `,
  cardGrid: css`
    display: grid;
    grid-template-columns: repeat(2, 164px);
    grid-template-rows: repeat(2, 84px);
    gap: 8px;
  `,
  cardItem: css`
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.06);
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 164px;
    height: 84px;
  `,
  cardTitle: css`
    font-weight: 500;
    font-size: 12px;
    margin-bottom: 4px;
  `,
  cardDesc: css`
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
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
    height: 98px;
    border-radius: 6px;
    background: #E9E9E9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  sectionDesc: css`
    color: rgba(0, 0, 0, 0.65);
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
    color: rgba(0, 0, 0, 0.65);
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
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
  `,
})); 
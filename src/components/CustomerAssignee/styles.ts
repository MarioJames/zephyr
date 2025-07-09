import { createStyles } from 'antd-style';

export const useCustomerAssigneeStyles = createStyles(({ css, token }) => ({
  assigneeContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,

  assigneeTitle: css`
    font-size: 14px;
    color: ${token.colorText};
    margin-bottom: 8px;
    font-weight: 500;
  `,
  assigneeValueText: css`
    font-size: 16px;
    color: ${token.colorText};
    font-weight: 600;
  `,
  assigneeValue: css`
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${token.colorText};
    transition: color 0.2s ease;
    user-select: none;

    &:hover {
      color: ${token.colorPrimary};
    }

    &.disabled {
      cursor: not-allowed;
      color: ${token.colorTextDisabled};

      &:hover {
        color: ${token.colorTextDisabled};
      }
    }
  `,

  dropdownIcon: css`
    font-size: 12px;
    margin-left: 4px;
    transition: transform 0.2s ease;
  `,

  popoverContent: css`
    width: 260px;
    max-height: 300px;
    padding: 0;
  `,

  searchContainer: css`
    padding: 12px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,

  searchInput: css`
    width: 100%;
  `,

  employeeList: css`
    max-height: 200px;
    overflow-y: auto;
    padding: 4px 0;

    .ant-list-item {
      padding: 8px 12px;
      margin: 0;
      border-bottom: none;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${token.colorFillTertiary};
      }

      &:last-child {
        border-bottom: none;
      }
    }
  `,

  employeeItem: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
  `,

  employeeName: css`
    font-size: 14px;
    font-weight: 500;
    color: ${token.colorText};
    line-height: 1.4;
  `,

  employeeInfo: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    line-height: 1.2;
  `,

  emptyState: css`
    padding: 24px 12px;
    text-align: center;
    color: ${token.colorTextSecondary};
    font-size: 14px;
  `,

  loadingState: css`
    padding: 24px 12px;
    text-align: center;
  `,
}));

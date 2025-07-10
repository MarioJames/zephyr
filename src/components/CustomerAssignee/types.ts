import React from 'react';
import { UserItem } from '@/services/user';
import { SessionItem } from '@/services/sessions';
import type { TooltipPlacement } from 'antd/es/tooltip';

export type PopoverPlacement = TooltipPlacement;

export interface CustomerAssigneeProps {
  /**
   * 会话对象，包含所有必要的数据
   */
  session: SessionItem;

  /**
   * 标题文本
   * @default "对接人"
   */
  title?: string;

  /**
   * 无对接人时的占位文本
   * @default "未分配"
   */
  placeholder?: string;

  /**
   * 弹窗位置
   * @default "bottom"
   */
  popoverPlacement?: PopoverPlacement;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 分配成功回调
   */
  onAssignSuccess?: (employee: UserItem) => void;

  /**
   * 分配失败回调
   */
  onAssignError?: (error: any) => void;

  /**
   * 自定义样式类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 是否是标题
   * @default false
   */
  isTitle?: boolean;
}

export interface EmployeeListItemProps {
  employee: UserItem;
  onClick: (employee: UserItem) => void;
}

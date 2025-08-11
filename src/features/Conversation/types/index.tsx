import { type ActionIconGroupEvent } from '@lobehub/ui';
import { type ChatItemProps } from '@lobehub/ui/chat';
import { FC, ReactNode } from 'react';

import { LLMRoleType } from '@/types/llm';

import { type ActionsBarProps } from '../components/ChatItem/ActionsBar';
import { MessageItem } from '@/services';

export type OnActionsClick = (
  action: ActionIconGroupEvent,
  message: MessageItem
) => void;
export type OnAvatarsClick = (
  role: RenderRole
) => ChatItemProps['onAvatarClick'];
export type RenderRole = LLMRoleType | 'default' | 'history' | string;
export type RenderMessage = FC<MessageItem & { editableContent: ReactNode }>;
export type RenderBelowMessage = FC<MessageItem>;
export type RenderMessageExtra = FC<MessageItem>;
export type MarkdownCustomRender = (props: {
  displayMode: 'chat' | 'docs';
  dom: ReactNode;
  text: string;
}) => ReactNode;

export type RenderAction = FC<ActionsBarProps & MessageItem>;

export type RenderItem = FC<{ key: string } & MessageItem & ListItemProps>;

export interface ListItemProps {
  groupNav?: ChatItemProps['avatarAddon'];

  renderItems?: {
    [role: RenderRole]: RenderItem;
  };

  /**
   * @description 是否显示聊天项的名称
   * @default false
   */
  showTitle?: boolean;
}

import { MessageRoleType } from '@/types/message';

import { RenderAction } from '../types';
import { AssistantActionsBar } from './Assistant';
import { UserActionsBar } from './User';

export const renderActions: Record<MessageRoleType, RenderAction> = {
  assistant: AssistantActionsBar,
  user: UserActionsBar,
};

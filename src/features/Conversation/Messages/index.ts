import { useCallback } from 'react';

import { useGlobalStore } from '@/store/global';

import {
  MarkdownCustomRender,
  RenderBelowMessage,
  RenderMessage,
} from '../types';
import { AssistantMessage } from './Assistant';
import { DefaultBelowMessage, DefaultMessage } from './Default';
import { UserBelowMessage, UserMarkdownRender, UserMessage } from './User';
import { sessionSelectors, useSessionStore } from '@/store/session';

export const renderMessages: Record<string, RenderMessage> = {
  assistant: AssistantMessage,
  default: DefaultMessage,
  function: DefaultMessage,
  user: UserMessage,
};

export const renderBelowMessages: Record<string, RenderBelowMessage> = {
  default: DefaultBelowMessage,
  user: UserBelowMessage,
};

export const markdownCustomRenders: Record<string, MarkdownCustomRender> = {
  user: UserMarkdownRender,
};

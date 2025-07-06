import { MarkdownCustomRender, RenderMessage } from '../types';
import { AssistantMessage } from './Assistant';
import { DefaultMessage } from './Default';
import { UserMarkdownRender, UserMessage } from './User';

export const renderMessages: Record<string, RenderMessage> = {
  assistant: AssistantMessage,
  user: UserMessage,
  default: DefaultMessage,
};

export const markdownCustomRenders: Record<string, MarkdownCustomRender> = {
  user: UserMarkdownRender,
};

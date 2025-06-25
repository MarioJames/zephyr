import { MessageState } from './initialState';
import { MessageItem } from '@/services/messages';

export const inputMessage = (s: MessageState) => s.inputMessage;
export const messages = (s: MessageState) => s.messages;
export const messagesInit = (s: MessageState) => s.messagesInit;

export const getMessageById = (id: string) => (s: MessageState): MessageItem | undefined =>
  s.messages.find(msg => msg.id === id);
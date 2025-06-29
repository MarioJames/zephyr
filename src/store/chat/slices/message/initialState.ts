import { MessageItem } from '@/services/messages';

export interface MessageState {
  messages: MessageItem[];
  messagesInit: boolean;
  inputMessage: string;
  editingMessageId?: string;
  generatingMessageId?: string;
  artifactMessageId?: string;
}

export const initialMessageState: MessageState = {
  messages: [],
  messagesInit: false,
  inputMessage: '',
  editingMessageId: undefined,
  generatingMessageId: undefined,
  artifactMessageId: undefined,
};
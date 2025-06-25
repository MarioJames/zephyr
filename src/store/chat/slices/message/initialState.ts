import { MessageItem } from '@/services/messages';

export interface MessageState {
  messages: MessageItem[];
  messagesInit: boolean;
  inputMessage: string;
}

export const initialMessageState: MessageState = {
  messages: [],
  messagesInit: false,
  inputMessage: '',
};
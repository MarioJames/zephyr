import { MessageItem } from '@/services/messages';

export interface MessageState {
  messages: MessageItem[];
  messagesInit: boolean;
  inputMessage: string;
  isAIGenerating: boolean;
  abortController?: AbortController;
}

export const initialMessageState: MessageState = {
  messages: [],
  messagesInit: false,
  inputMessage: '',
  isAIGenerating: false,
  abortController: undefined,
};
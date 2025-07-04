import { MessageItem } from '@/services/messages';

export interface MessageState {
  sendLoading: boolean;
  messages: MessageItem[];
  messagesInit: boolean;
  inputMessage: string;
  editingMessageId?: string;
  generatingMessageId?: string;
  artifactMessageId?: string;
  translatingMessageIds: string[]; // 正在翻译的消息ID列表
}

export const initialMessageState: MessageState = {
  sendLoading: false,
  messages: [],
  messagesInit: false,
  inputMessage: '',
  editingMessageId: undefined,
  generatingMessageId: undefined,
  artifactMessageId: undefined,
  translatingMessageIds: [],
};

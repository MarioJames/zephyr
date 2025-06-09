import { request } from './index';
import type { ChatMessage } from '@/types/message';

export const messageApi = {
  createMessage: (params: any) => request('/message/createMessage', params),
  batchCreateMessages: (messages: any) => request('/message/batchCreateMessages', { messages }),
  getMessages: (sessionId: string, topicId: string) => request('/message/getMessages', { sessionId, topicId }),
  getAllMessages: () => request('/message/getAllMessages', {}),
  countMessages: (params: any) => request('/message/countMessages', params),
  countWords: (params: any) => request('/message/countWords', params),
  rankModels: () => request('/message/rankModels', {}),
  getHeatmaps: () => request('/message/getHeatmaps', {}),
  getAllMessagesInSession: (sessionId: string) => request('/message/getAllMessagesInSession', { sessionId }),
  updateMessageError: (id: string, error: any) => request('/message/updateMessageError', { id, error }),
  updateMessage: (id: string, message: any) => request('/message/updateMessage', { id, message }),
  updateMessageTTS: (id: string, tts: any) => request('/message/updateMessageTTS', { id, tts }),
  updateMessageTranslate: (id: string, translate: any) => request('/message/updateMessageTranslate', { id, translate }),
  updateMessagePluginState: (id: string, value: any) => request('/message/updateMessagePluginState', { id, value }),
  updateMessagePluginError: (id: string, value: any) => request('/message/updateMessagePluginError', { id, value }),
  updateMessagePluginArguments: (id: string, value: any) => request('/message/updateMessagePluginArguments', { id, value }),
  removeMessage: (id: string) => request('/message/removeMessage', { id }),
  removeMessages: (ids: string[]) => request('/message/removeMessages', { ids }),
  removeMessagesByAssistant: (sessionId: string, topicId: string) => request('/message/removeMessagesByAssistant', { sessionId, topicId }),
  removeAllMessages: () => request('/message/removeAllMessages', {}),
  hasMessages: () => request('/message/hasMessages', {}),
  messageCountToCheckTrace: () => request('/message/messageCountToCheckTrace', {}),
}; 
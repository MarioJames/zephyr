import { StateCreator } from 'zustand';
import { ChatStore } from '../..';

export interface ChatCoreAction {
  resetChatState: () => void;
}

export const chatCoreSlice: StateCreator<ChatStore, [], [], ChatCoreAction> = (
  set
) => ({
  resetChatState: () => {
    set({
      chatUploadFileList: [],
      parsedFileContentMap: new Map(),
      inputMessage: '',
      messages: [],
      messagesInit: false,
      editingMessageId: undefined,
      generatingMessageId: undefined,
      artifactMessageId: undefined,
      translatingMessageIds: [],
    });
  },
});

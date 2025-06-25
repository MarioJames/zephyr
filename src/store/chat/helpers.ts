import { ChatMessage } from '@/types/message';
import { produce } from 'immer';
import { UploadFileListDispatch } from './slices/upload/action';
import { FileItem } from '@/services/files';

export const getMessageById = (messages: ChatMessage[], id: string) =>
  messages.find((m) => m.id === id);

const getSlicedMessages = (
  messages: ChatMessage[],
  options: {
    enableHistoryCount?: boolean;
    historyCount?: number;
    includeNewUserMessage?: boolean;
  }
): ChatMessage[] => {
  // if historyCount is not enabled, return all messages
  if (!options.enableHistoryCount || options.historyCount === undefined)
    return messages;

  // if user send message, history will include this message so the total length should +1
  const messagesCount = !!options.includeNewUserMessage
    ? options.historyCount + 1
    : options.historyCount;

  // if historyCount is negative or set to 0, return empty array
  if (messagesCount <= 0) return [];

  // if historyCount is positive, return last N messages
  return messages.slice(-messagesCount);
};

export const uploadFileListReducer = (
  state: FileItem[],
  action: UploadFileListDispatch
): FileItem[] => {
  switch (action.type) {
    case 'addFile': {
      return produce(state, (draftState) => {
        const { atStart, file } = action;

        if (atStart) {
          draftState.unshift(file);
        } else {
          draftState.push(file);
        }
      });
    }

    case 'addFiles': {
      return produce(state, (draftState) => {
        const { atStart, files } = action;

        for (const file of files) {
          if (atStart) {
            draftState.unshift(file);
          } else {
            draftState.push(file);
          }
        }
      });
    }
    case 'updateFile': {
      return produce(state, (draftState) => {
        const file = draftState.find((f) => f.id === action.id);
        if (file) {
          Object.assign(file, action.value);
        }
      });
    }

    case 'updateFileStatus': {
      return produce(state, (draftState) => {
        const file = draftState.find((f) => f.id === action.id);
        if (file) {
          file.status = action.status;
        }
      });
    }

    case 'removeFile': {
      return produce(state, (draftState) => {
        const index = draftState.findIndex((f) => f.id === action.id);
        if (index !== -1) {
          draftState.splice(index, 1);
        }
      });
    }

    case 'removeFiles': {
      return produce(state, (draftState) => {
        for (const id of action.ids) {
          const index = draftState.findIndex((f) => f.id === id);
          if (index !== -1) {
            draftState.splice(index, 1);
          }
        }
      });
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
};

export const chatHelpers = {
  getMessageById,
  getSlicedMessages,
};

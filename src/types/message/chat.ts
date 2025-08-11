import { IPluginErrorType } from '@lobehub/chat-plugin-sdk';

import { ErrorType } from '@/types/fetch';

import { Translate } from './translate';

export type ChatMessageContent =
  | string
  | {
      type: 'text' | 'image_url';
      text?: string;
      image_url?: { url: string; detail: string };
    }[];

export type ChatMessage = {
  role: 'user' | 'system' | 'assistant' | 'tool';
  content: ChatMessageContent;
};

/**
 * 聊天消息错误对象
 */
export interface ChatMessageError {
  body?: any;
  message: string;
  type: ErrorType | IPluginErrorType;
}

export interface ChatTranslate extends Translate {
  content?: string;
}

export interface ChatTTS {
  contentMd5?: string;
  file?: string;
  voice?: string;
}

export interface ChatFileItem {
  content?: string;
  fileType: string;
  id: string;
  name: string;
  size: number;
  url: string;
}

export interface ChatFileChunk {
  fileId: string;
  fileType: string;
  fileUrl: string;
  filename: string;
  id: string;
  similarity?: number;
  text: string;
}

export interface ChatMessageExtra {
  fromModel?: string;
  fromProvider?: string;
  // 翻译
  translate?: ChatTranslate | false | null;
  // TTS
  tts?: ChatTTS;
}

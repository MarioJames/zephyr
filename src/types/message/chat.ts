import { IPluginErrorType } from '@lobehub/chat-plugin-sdk';

import { ILobeAgentRuntimeErrorType } from '@/libs/model-runtime';
import { ErrorType } from '@/types/fetch';
import { MetaData } from '@/types/meta';
import { MessageSemanticSearchChunk } from '@/types/rag';
import { GroundingSearch } from '@/types/search';

import { MessageMetadata, MessageRoleType, ModelReasoning } from './base';
import { ChatImageItem } from './image';
import { ChatPluginPayload, ChatToolPayload } from './tools';
import { Translate } from './translate';

/**
 * 聊天消息错误对象
 */
export interface ChatMessageError {
  body?: any;
  message: string;
  type: ErrorType | IPluginErrorType | ILobeAgentRuntimeErrorType;
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

import { MessageItem } from '@/services/messages';

export type ChatMessage = MessageItem;

import { UploadFileItem } from '../file';

export * from './base';
export * from './chat';

export interface SendMessageParams {
  /**
   * create a thread
   */
  createThread?: boolean;
  files?: UploadFileItem[];
  /**
   *
   * https://github.com/lobehub/lobe-chat/pull/2086
   */
  isWelcomeQuestion?: boolean;
  message: string;
  onlyAddUserMessage?: boolean;
}

export interface UpdateMessageParams {
  content?: string;
  model?: string;
  provider?: string;
  role?: string;
}
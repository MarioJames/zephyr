import { MessageItem } from '@/services';

export const LOADING_FLAT = '...';

export const MESSAGE_CANCEL_FLAT = 'canceled';

export const MESSAGE_THREAD_DIVIDER_ID = '__THREAD_DIVIDER__';

export const MESSAGE_WELCOME_GUIDE_ID = 'welcome';

export const THREAD_DRAFT_ID = '__THREAD_DRAFT_ID__';

export const MESSAGE_FLAGGED_THINKING = 'FLAGGED_THINKING';

/**
 * 默认的占位话题
 */
export const PLACEHOLDER_MESSAGE: MessageItem = {
  id: 'placeholder',
  role: 'assistant',
  content: '...',
  createdAt: new Date().toISOString(),
  userId: '',
};

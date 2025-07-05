import { ReactNode, memo } from 'react';

import BubblesLoading from '@/components/Loading/BubblesLoading';
import { LOADING_FLAT } from '@/const/base';
import { ChatMessage } from '@/types/message';

export const DefaultMessage = memo<
  ChatMessage & {
    addIdOnDOM?: boolean;
    editableContent: ReactNode;
    isToolCallGenerating?: boolean;
  }
>(
  ({
    id,
    editableContent,
    content,
    isToolCallGenerating,
    addIdOnDOM = true,
  }) => {
    if (isToolCallGenerating) return;

    if (content === LOADING_FLAT) return <BubblesLoading />;

    return <div id={addIdOnDOM ? id : undefined}>{editableContent}</div>;
  }
);

export const DefaultBelowMessage = memo<ChatMessage>(() => {
  return null;
});

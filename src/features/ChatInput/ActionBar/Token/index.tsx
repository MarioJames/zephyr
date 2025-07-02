import dynamic from 'next/dynamic';
import { PropsWithChildren, memo } from 'react';

import { useChatStore } from '@/store/chat';
import { useModelStore, modelCoreSelectors } from '@/store/model';

const LargeTokenContent = dynamic(() => import('./TokenTag'), { ssr: false });

const Token = memo<PropsWithChildren>(({ children }) => {
  const [showTag] = useModelStore((s) => [
    modelCoreSelectors.currentModelContextWindowTokens(s),
  ]);

  return showTag && children;
});

export const MainToken = memo(() => {
  // Get all messages from the store
  const messages = useChatStore((s) => s.messages);
  // Join all message contents into a single string
  const total = messages.map((msg) => msg.content || '').join('');

  return (
    <Token>
      <LargeTokenContent total={total} />
    </Token>
  );
});

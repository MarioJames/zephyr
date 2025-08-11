import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { MessageItem } from '@/services';

import { RenderMessageExtra } from '../types';
import ExtraContainer from './ExtraContainer';
import Translate from './Translate';

export const AssistantMessageExtra: RenderMessageExtra = memo<
  MessageItem & { extra?: any }
>(({ extra, id, tools }) => {
  const isTranslating = useChatStore(chatSelectors.isMessageTranslating(id));

  return (
    <Flexbox gap={8} style={{ marginTop: !!tools?.length ? 8 : 4 }}>
      {(!!extra?.translate || isTranslating) && (
        <ExtraContainer>
          <Translate id={id} loading={isTranslating} {...extra?.translate} />
        </ExtraContainer>
      )}
    </Flexbox>
  );
});

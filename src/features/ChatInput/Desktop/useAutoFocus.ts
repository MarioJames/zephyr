import { TextAreaRef } from 'antd/es/input/TextArea';
import { RefObject, useEffect } from 'react';

import { sessionSelectors, useSessionStore } from '@/store/session';

export const useAutoFocus = (inputRef: RefObject<TextAreaRef>) => {
  const chatKey = useSessionStore(sessionSelectors.activeTopicId);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatKey]);
};

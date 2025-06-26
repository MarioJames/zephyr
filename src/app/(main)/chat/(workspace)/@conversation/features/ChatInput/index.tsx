'use client';

import { memo } from 'react';

import { ActionKeys } from '@/features/ChatInput/ActionBar/config';
import DesktopChatInput, { FooterRender } from '@/features/ChatInput/Desktop';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import Footer from './Footer';
import TextArea from './TextArea';

const leftActions = [
  // 'model',
  // 'search',
  'fileUpload',
  // 'stt',
  // 'mainToken',
] as ActionKeys[];

// const rightActions = ['clear'] as ActionKeys[];
const rightActions = [] as ActionKeys[];


const renderTextArea = (onSend: () => void) => <TextArea onSend={onSend} />;
const renderFooter: FooterRender = ({ expand, onExpandChange }) => (
  <Footer expand={expand} onExpandChange={onExpandChange} />
);

const ChatInput = memo(() => {
  const inputHeight = useGlobalStore(systemStatusSelectors.inputHeight);
  const updatePreference = useGlobalStore((s) => s.updateSystemStatus);

  return (
    <DesktopChatInput
      inputHeight={inputHeight}
      leftActions={leftActions}
      onInputHeightChange={(height) => {
        updatePreference({ inputHeight: height });
      }}
      renderFooter={renderFooter}
      renderTextArea={renderTextArea}
      rightActions={rightActions}
    />
  );
});

export default ChatInput;

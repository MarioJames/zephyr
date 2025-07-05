'use client';

import { memo } from 'react';

import { ActionKeys } from '@/features/ChatInput/ActionBar/config';
import DesktopChatInput, { FooterRender } from '@/features/ChatInput/Desktop';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useChatStore } from '@/store/chat';

import Footer from './Footer';
import TextArea from './TextArea';
import UploadedFileList from './UploadedFileList';

const leftActions = [
  'search',
  'fileUpload',
  'stt',
  'mainToken',
] as ActionKeys[];

const rightActions = ['newTopic'] as ActionKeys[];

const renderTextArea = (onSend: () => void) => <TextArea onSend={onSend} />;
const renderFooter: FooterRender = ({ expand, onExpandChange }) => (
  <Footer expand={expand} onExpandChange={onExpandChange} />
);

const ChatInput = memo(() => {
  const inputHeight = useGlobalStore(systemStatusSelectors.inputHeight);
  const updatePreference = useGlobalStore((s) => s.updateSystemStatus);

  // 获取文件上传相关状态
  const { chatUploadFileList, isUploading, removeChatUploadFile } =
    useChatStore();

  return (
    <div>
      {/* 文件列表展示 */}
      <UploadedFileList
        files={chatUploadFileList}
        isUploading={isUploading}
        onRemoveFile={removeChatUploadFile}
      />

      {/* 输入框 */}
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
    </div>
  );
});

export default ChatInput;

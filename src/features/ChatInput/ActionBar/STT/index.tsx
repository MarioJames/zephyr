import {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from '@lobehub/tts/react';
import { memo, useCallback, useState } from 'react';
import { SWRConfiguration } from 'swr';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatMessageError } from '@/types/message';

import CommonSTT from './common';
import { App } from 'antd';

interface STTConfig extends SWRConfiguration {
  onTextChange: (value: string) => void;
}

const useBrowserSTT = (config: STTConfig) => {
  return useSpeechRecognition('zh-CN', {
    ...config,
    autoStop: false,
  } as SpeechRecognitionOptions);
};

const BrowserSTT = memo(() => {
  const { message } = App.useApp();

  const [error, setError] = useState<ChatMessageError>();

  const [loading, updateInputMessage] = useChatStore((s) => [
    chatSelectors.sendMessageLoading(s),
    s.updateInputMessage,
  ]);

  const { start, isLoading, stop, formattedTime, time, response, isRecording } =
    useBrowserSTT({
      onError: () => {
        stop();
        message.error('语音输入失败');
      },
      onErrorRetry: () => {
        stop();
        message.error('语音输入失败');
      },
      onSuccess: async () => {
        if (!response) return;
        if (response.status === 200) return;

        message.error('语音输入失败');

        stop();
      },
      onTextChange: (text) => {
        if (loading) stop();
        if (text) updateInputMessage(text);
      },
    });

  const handleTriggerStartStop = useCallback(() => {
    if (loading) return;
    if (!isLoading) {
      start();
    } else {
      stop();
    }
  }, [loading, isLoading, start, stop]);

  const handleCloseError = useCallback(() => {
    setError(undefined);
    stop();
  }, [stop]);

  const handleRetry = useCallback(() => {
    setError(undefined);
    start();
  }, [start]);

  return (
    <CommonSTT
      error={error}
      formattedTime={formattedTime}
      handleCloseError={handleCloseError}
      handleRetry={handleRetry}
      handleTriggerStartStop={handleTriggerStartStop}
      isLoading={isLoading}
      isRecording={isRecording}
      time={time}
    />
  );
});

export default BrowserSTT;

import React, { useState } from 'react';
import { Button } from '@lobehub/ui';
import { FormActionsProps } from './shared/types';
import { useSharedStyles } from './shared/styles';
import { ChatConfirmModal } from '@/components/ChatConfirmModal';

export default function FormActions({
  mode,
  submitting,
  onCancel,
  onSubmitSuccess
}: FormActionsProps) {
  const { styles } = useSharedStyles();
  const [showChatModal, setShowChatModal] = useState(false);
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    topicId: string;
    username: string;
  } | null>(null);

  const handleSubmitSuccess = (data: { sessionId: string; topicId: string; username: string }) => {
    setSessionData(data);
    setShowChatModal(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(data);
    }
  };

  return (
    <>
      <div className={styles.buttonsContainer}>
        <Button type='primary' htmlType='submit' loading={submitting}>
          {mode === 'edit' ? '更新客户' : '添加客户'}
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </div>

      {sessionData && (
        <ChatConfirmModal
          visible={showChatModal}
          onCancel={() => setShowChatModal(false)}
          sessionId={sessionData.sessionId}
          topicId={sessionData.topicId}
          username={sessionData.username}
        />
      )}
    </>
  );
}

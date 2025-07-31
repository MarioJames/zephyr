import { ActionIcon, Alert, Button, Dropdown, Highlighter } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Mic, MicOff } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatMessageError } from '@/types/message';

const useStyles = createStyles(({ css, token }) => ({
  recording: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${token.colorError};
  `,
}));

const CommonSTT = memo<{
  error?: ChatMessageError;
  formattedTime: string;
  handleCloseError: () => void;
  handleRetry: () => void;
  handleTriggerStartStop: () => void;
  isLoading: boolean;
  isRecording: boolean;
  time: number;
}>(
  ({
    isLoading,
    formattedTime,
    time,
    isRecording,
    error,
    handleRetry,
    handleTriggerStartStop,
    handleCloseError,
  }) => {
    const { styles } = useStyles();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownVisibleChange = (open: boolean) => {
      setDropdownOpen(open);
    };

    return (
      <Dropdown
        menu={{
          defaultOpenKeys: ['time'],
          items: [
            {
              key: 'title',
              label: (
                <Flexbox>
                  <div style={{ fontWeight: 'bolder' }}>语音输入</div>
                </Flexbox>
              ),
            },
            {
              key: 'time',
              label: (
                <Flexbox align={'center'} gap={8} horizontal>
                  <div className={styles.recording} />
                  {time > 0 ? formattedTime : isRecording ? '识别中' : '润色中'}
                </Flexbox>
              ),
            },
          ],
        }}
        onOpenChange={handleDropdownVisibleChange}
        open={dropdownOpen || !!error || isRecording || isLoading}
        placement={'top'}
        popupRender={
          error
            ? () => (
                <Alert
                  action={
                    <Button
                      onClick={handleRetry}
                      size={'small'}
                      type={'primary'}
                    >
                      重试
                    </Button>
                  }
                  closable
                  extra={
                    error.body && (
                      <Highlighter
                        actionIconSize={'small'}
                        language={'json'}
                        variant={'borderless'}
                      >
                        {JSON.stringify(error.body, null, 2)}
                      </Highlighter>
                    )
                  }
                  message={error.message}
                  onClose={handleCloseError}
                  style={{ alignItems: 'center' }}
                  type='error'
                />
              )
            : undefined
        }
        trigger={['click']}
      >
        <ActionIcon
          active={isRecording}
          icon={isLoading ? MicOff : Mic}
          onClick={handleTriggerStartStop}
          size={22}
          style={{ flex: 'none' }}
          title={dropdownOpen ? '' : '语音输入'}
          tooltipProps={{
            placement: 'bottom',
          }}
          variant={'borderless'}
        />
      </Dropdown>
    );
  }
);

export default CommonSTT;

import { Button } from '@lobehub/ui';
import { memo, useMemo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';

import SearchXNGIcon from './SearchXNGIcon';
import { FormAction } from './style';

interface ConfigAlertProps {
  id: string;
  provider: string;
}

const ConfigAlert = memo<ConfigAlertProps>(({ provider, id }) => {
  const [resend, deleteMessage] = useChatStore((s) => [s.reInvokeToolMessage, s.deleteMessage]);

  const [loading, setLoading] = useState(false);

  const avatar = useMemo(() => {
    switch (provider) {
      default: {
        return <SearchXNGIcon />;
      }
    }
  }, [provider]);

  return (
    <Center gap={16} style={{ width: 400 }}>
      <FormAction
        avatar={avatar}
        description={'SearXNG 未配置，请先配置'}
        title={'SearXNG 未配置'}
      >
        <Flexbox gap={12} width={'100%'}>
          <Button
            block
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              resend(id).then(() => {
                setLoading(false);
              });
              // deleteMessage(id);
            }}
            style={{ marginTop: 8 }}
            type={'primary'}
          >
            {'确认'}
          </Button>
          <Button
            onClick={() => {
              deleteMessage(id);
            }}
          >
            {'关闭'}
          </Button>
        </Flexbox>
      </FormAction>
    </Center>
  );
});

export default ConfigAlert;

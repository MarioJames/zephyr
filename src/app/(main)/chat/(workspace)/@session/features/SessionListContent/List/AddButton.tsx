import { Button } from '@lobehub/ui';
import { Plus } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useActionSWR } from '@/libs/swr';
import { useSessionStore } from '@/store/session';

const AddButton = memo(() => {
  const createSession = useSessionStore((s) => s.createSession);
  const { mutate, isValidating } = useActionSWR(['session.createSession', ''], () => {
    return createSession();
  });

  return (
    <Flexbox flex={1} padding={0}>
      <Button
        block
        icon={Plus}
        loading={isValidating}
        onClick={() => mutate()}
        style={{
          marginTop: 8,
        }}
        variant={'filled'}
      >
        新建客户
      </Button>
    </Flexbox>
  );
});

export default AddButton;

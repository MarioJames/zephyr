import { Button, InputPassword } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { useUserStore } from '@/store/user';
import { keyVaultsConfigSelectors } from '@/store/user/selectors';

import { FormAction } from './style';

interface AccessCodeFormProps {
  id: string;
}

const AccessCodeForm = memo<AccessCodeFormProps>(({ id }) => {
  const [password, updateKeyVaults] = useUserStore((s) => [
    keyVaultsConfigSelectors.password(s),
    s.updateKeyVaults,
  ]);
  const [resend, deleteMessage] = useChatStore((s) => [s.regenerateMessage, s.deleteMessage]);

  return (
    <>
      <FormAction
        avatar={'🗳'}
        description={'请输入访问密码'}
        title={'密码登录'}
      >
        <InputPassword
          autoComplete={'new-password'}
          onChange={(e) => {
            updateKeyVaults({ password: e.target.value });
          }}
          placeholder={'请输入密码'}
          value={password}
          variant={'filled'}
        />
      </FormAction>
      <Flexbox gap={12}>
        <Button
          onClick={() => {
            resend(id);
            deleteMessage(id);
          }}
          type={'primary'}
        >
          {'确认'}
        </Button>
        <Button
          onClick={() => {
            deleteMessage(id);
          }}
        >
          {'关闭消息'}
        </Button>
      </Flexbox>
    </>
  );
});

export default AccessCodeForm;

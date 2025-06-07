import { Button } from '@lobehub/ui';
import { memo } from 'react';

import UserLoginOrSignup from '@/features/User/UserLoginOrSignup';
import { useChatStore } from '@/store/chat';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';

import { ErrorActionContainer, FormAction } from '../style';

const ClerkLogin = memo<{ id: string }>(({ id }) => {
  const [openSignIn, isSignedIn] = useUserStore((s) => [s.openLogin, s.isSignedIn]);
  const nickName = useUserStore(userProfileSelectors.nickName);
  const [resend, deleteMessage] = useChatStore((s) => [s.regenerateMessage, s.deleteMessage]);

  return (
    <ErrorActionContainer>
      {isSignedIn ? (
        <FormAction
          avatar={'🌟'}
          description={`欢迎回来`}
          title={`登录成功，${nickName}`}
        >
          <Button
            block
            onClick={() => {
              resend(id);
              deleteMessage(id);
            }}
            size={'large'}
            type={'primary'}
          >
            {'继续'}
          </Button>
        </FormAction>
      ) : (
        <UserLoginOrSignup onClick={openSignIn} />
      )}
    </ErrorActionContainer>
  );
});

export default ClerkLogin;

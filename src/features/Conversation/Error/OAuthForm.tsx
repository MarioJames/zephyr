import { Button, Icon } from '@lobehub/ui';
import { App } from 'antd';
import { ScanFace } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { useUserStore } from '@/store/user';
import { authSelectors, userProfileSelectors } from '@/store/user/selectors';

import { FormAction } from './style';

const OAuthForm = memo<{ id: string }>(({ id }) => {
  const [signIn, signOut] = useUserStore((s) => [s.openLogin, s.logout]);
  const user = useUserStore(userProfileSelectors.userProfile);
  const isOAuthLoggedIn = useUserStore(authSelectors.isLoginWithAuth);

  const [resend, deleteMessage] = useChatStore((s) => [s.regenerateMessage, s.deleteMessage]);

  const { message, modal } = App.useApp();

  const handleSignOut = useCallback(() => {
    modal.confirm({
      centered: true,
      okButtonProps: { danger: true },
      onOk: () => {
        signOut();
        message.success('退出登录成功');
      },
      title: '确定要退出登录吗？',
    });
  }, []);

  return (
    <Center gap={16} style={{ maxWidth: 300 }}>
      <FormAction
        avatar={isOAuthLoggedIn ? '✅' : '🕵️‍♂️'}
        description={
          isOAuthLoggedIn
            ? `欢迎，${user?.fullName || ''}`
            : '请使用 OAuth 登录以继续操作'
        }
        title={isOAuthLoggedIn ? '登录成功' : 'OAuth 登录'}
      >
        {isOAuthLoggedIn ? (
          <Button
            block
            icon={<Icon icon={ScanFace} />}
            onClick={handleSignOut}
            style={{ marginTop: 8 }}
          >
            {'退出登录'}
          </Button>
        ) : (
          <Button
            block
            icon={<Icon icon={ScanFace} />}
            loading={status === 'loading'}
            onClick={() => signIn()}
            style={{ marginTop: 8 }}
            type={'primary'}
          >
            {'OAuth 登录'}
          </Button>
        )}
      </FormAction>
      <Flexbox gap={12} width={'100%'}>
        {isOAuthLoggedIn ? (
          <Button
            block
            onClick={() => {
              resend(id);
              deleteMessage(id);
            }}
            style={{ marginTop: 8 }}
            type={'primary'}
          >
            {'确认'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              deleteMessage(id);
            }}
          >
            {'关闭消息'}
          </Button>
        )}
      </Flexbox>
    </Center>
  );
});

export default OAuthForm;

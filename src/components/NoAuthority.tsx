'use client';

import { Button, FluentEmoji } from '@lobehub/ui';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { MAX_WIDTH } from '@/const/layoutTokens';
// import { logout } from '@/utils/client';

const NoAuthority = memo(() => {
  return (
    <Flexbox align={'center'} justify={'center'} style={{ minHeight: '100%', width: '100%' }}>
      <h1
        style={{
          filter: 'blur(8px)',
          fontSize: `min(${MAX_WIDTH / 6}px, 25vw)`,
          fontWeight: 900,
          margin: 0,
          opacity: 0.12,
          position: 'absolute',
          zIndex: 0,
        }}
      >
        无权限
      </h1>
      <FluentEmoji emoji={'🤧'} size={64} />
      <h2 style={{ fontWeight: 'bold', marginTop: '1em', textAlign: 'center' }}>
        {'您没有权限访问该页面'}
      </h2>
      <p style={{ marginBottom: '2em' }}>{'请联系管理员'}</p>
      <Flexbox gap={12} horizontal style={{ marginBottom: '1em' }}>
        <Link href="/chat">
          <Button type={'primary'}>返回首页</Button>
        </Link>
        {/* <Button onClick={logout}>退出登录</Button> */}
      </Flexbox>
    </Flexbox>
  );
});

NoAuthority.displayName = 'NoAuthority';

export default NoAuthority;

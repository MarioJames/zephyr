'use client';

import { Button, FluentEmoji } from '@lobehub/ui';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { MAX_WIDTH } from '@/const/layoutTokens';

const NotFound = memo(() => {
  return (
    <Flexbox align={'center'} justify={'center'} style={{ minHeight: '100%', width: '100%' }}>
      <h1
        style={{
          filter: 'blur(8px)',
          fontSize: `min(${MAX_WIDTH / 3}px, 50vw)`,
          fontWeight: 'bolder',
          margin: 0,
          opacity: 0.12,
          position: 'absolute',
          zIndex: 0,
        }}
      >
        404
      </h1>
      <FluentEmoji emoji={'👀'} size={64} />
      <h2 style={{ fontWeight: 'bold', marginTop: '1em', textAlign: 'center' }}>
      进入了未知领域？
      </h2>
      <p style={{ lineHeight: '1.8', marginBottom: '2em' }}>
      我们找不到你寻找的页面
        <br />
        <div style={{ textAlign: 'center' }}>请检查你的 URL 是否正确</div>
      </p>
      <Link href="/">
        <Button type={'primary'}>返回首页</Button>
      </Link>
    </Flexbox>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;

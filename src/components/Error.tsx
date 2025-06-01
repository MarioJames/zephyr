'use client';

import { Button, FluentEmoji } from '@lobehub/ui';
import Link from 'next/link';
import { memo, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { MAX_WIDTH } from '@/const/layoutTokens';

import { appEnv } from '@/config/app';

type ErrorType = Error & { digest?: string };

const sentryCaptureException = async (error: Error & { digest?: string }) => {
  const { captureException } = await import('@sentry/nextjs');
  return captureException(error);
};


interface ErrorCaptureProps {
  error: ErrorType;
  reset: () => void;
}

const ErrorCapture = memo<ErrorCaptureProps>(({ reset, error }) => {

  useLayoutEffect(() => {
    sentryCaptureException(error);
  }, [error]);

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
        ERROR
      </h1>
      <FluentEmoji emoji={'🤧'} size={64} />
      <h2 style={{ fontWeight: 'bold', marginTop: '1em', textAlign: 'center' }}>
      页面遇到一点问题..
      </h2>
      <p style={{ marginBottom: '2em' }}>待会来试试，或者回到已知的世界</p>
      <Flexbox gap={12} horizontal style={{ marginBottom: '1em' }}>
        <Button onClick={() => reset()}>重新加载</Button>
        <Link href="/">
          <Button type={'primary'}>返回首页</Button>
        </Link>
      </Flexbox>
    </Flexbox>
  );
});

ErrorCapture.displayName = 'ErrorCapture';

export default ErrorCapture;

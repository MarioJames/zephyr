import type { AlertProps } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { Suspense, memo, useMemo } from 'react';

import { ChatErrorType, ErrorType } from '@/types/fetch';
import { ChatMessage } from '@/types/message';

import ErrorJsonViewer from './ErrorJsonViewer';
import { ErrorActionContainer } from './style';

const getErrorAlertConfig = (errorType?: ErrorType): AlertProps | undefined => {
  if (
    typeof errorType === 'string' &&
    (errorType.includes('Biz') || errorType.includes('Invalid'))
  )
    return {
      extraDefaultExpand: true,
      extraIsolate: true,
      type: 'warning',
    };

  switch (errorType) {
    case ChatErrorType.SystemTimeNotMatchError: {
      return {
        type: 'warning',
      };
    }

    default: {
      return undefined;
    }
  }
};

export const useErrorContent = (error: any) => {
  return useMemo<AlertProps | undefined>(() => {
    if (!error) return;
    const messageError = error;
    const alertConfig = getErrorAlertConfig(messageError.type);
    return {
      message: '发生错误',
      ...alertConfig,
    };
  }, [error]);
};

export default memo<{ data: ChatMessage }>(({ data }) => (
  <Suspense
    fallback={
      <ErrorActionContainer>
        <Skeleton active style={{ width: '100%' }} />
      </ErrorActionContainer>
    }
  >
    <ErrorJsonViewer error={data.error} id={data.id} />
  </Suspense>
));

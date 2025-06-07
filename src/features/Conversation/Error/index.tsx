import { IPluginErrorType } from '@lobehub/chat-plugin-sdk';
import type { AlertProps } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { Suspense, memo, useMemo } from 'react';

import { AgentRuntimeErrorType, ILobeAgentRuntimeErrorType } from '@/libs/model-runtime';
import { ChatErrorType, ErrorType } from '@/types/fetch';
import { ChatMessage, ChatMessageError } from '@/types/message';

import ClerkLogin from './ClerkLogin';
import ErrorJsonViewer from './ErrorJsonViewer';
import InvalidAPIKey from './InvalidAPIKey';
import InvalidAccessCode from './InvalidAccessCode';
import { ErrorActionContainer } from './style';

const loading = () => <Skeleton active />;

// Config for the errorMessage display
const getErrorAlertConfig = (
  errorType?: IPluginErrorType | ILobeAgentRuntimeErrorType | ErrorType,
): AlertProps | undefined => {
  // OpenAIBizError / ZhipuBizError / GoogleBizError / ...
  if (typeof errorType === 'string' && (errorType.includes('Biz') || errorType.includes('Invalid')))
    return {
      extraDefaultExpand: true,
      extraIsolate: true,
      type: 'warning',
    };

  /* ↓ cloud slot ↓ */

  /* ↑ cloud slot ↑ */

  switch (errorType) {
    case ChatErrorType.SystemTimeNotMatchError:
    case AgentRuntimeErrorType.PermissionDenied:
    case AgentRuntimeErrorType.InsufficientQuota:
    case AgentRuntimeErrorType.ModelNotFound:
    case AgentRuntimeErrorType.QuotaLimitReached:
    case AgentRuntimeErrorType.ExceededContextWindow:
    case AgentRuntimeErrorType.LocationNotSupportError: {
      return {
        type: 'warning',
      };
    }

    case AgentRuntimeErrorType.OllamaServiceUnavailable:
    case AgentRuntimeErrorType.NoOpenAIAPIKey: {
      return {
        extraDefaultExpand: true,
        extraIsolate: true,
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

const ErrorMessageExtra = memo<{ data: ChatMessage }>(({ data }) => {
  const error = data.error as ChatMessageError;
  if (!error?.type) return;

  switch (error.type) {

    /* ↓ cloud slot ↓ */

    /* ↑ cloud slot ↑ */

    case ChatErrorType.InvalidClerkUser: {
      return <ClerkLogin id={data.id} />;
    }

    case ChatErrorType.InvalidAccessCode: {
      return <InvalidAccessCode id={data.id} provider={data.error?.body?.provider} />;
    }

    case AgentRuntimeErrorType.NoOpenAIAPIKey: {
      {
        return <InvalidAPIKey id={data.id} provider={data.error?.body?.provider} />;
      }
    }
  }

  if (error.type.toString().includes('Invalid')) {
    return <InvalidAPIKey id={data.id} provider={data.error?.body?.provider} />;
  }

  return <ErrorJsonViewer error={data.error} id={data.id} />;
});

export default memo<{ data: ChatMessage }>(({ data }) => (
  <Suspense
    fallback={
      <ErrorActionContainer>
        <Skeleton active style={{ width: '100%' }} />
      </ErrorActionContainer>
    }
  >
    <ErrorMessageExtra data={data} />
  </Suspense>
));

"use client";

import { Button, Icon } from '@lobehub/ui';
import { Loader2Icon, Network } from 'lucide-react';
import { ReactNode, memo, useContext, useState } from 'react';

import { FormInput, FormPassword } from '@/components/FormInput';
import { LoadingContext } from '@/features/Conversation/Error/APIKeyForm/LoadingContext';
import { useProviderName } from '@/hooks/useProviderName';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { FormAction } from '../style';
import { useApiKey } from './useApiKey';

interface ProviderApiKeyFormProps {
  apiKeyPlaceholder?: string;
  avatar?: ReactNode;
  provider: GlobalLLMProviderKey;
  showEndpoint?: boolean;
}

const ProviderApiKeyForm = memo<ProviderApiKeyFormProps>(
  ({ provider, avatar, showEndpoint = false, apiKeyPlaceholder }) => {
    const [showProxy, setShow] = useState(false);

    const { apiKey, baseURL, setConfig } = useApiKey(provider);
    // 挽歌TODO
    const showOpenAIProxyUrl = true;
    const providerName = useProviderName(provider);
    const { loading } = useContext(LoadingContext);

    return (
      <FormAction
        avatar={avatar}
        description={`请输入 ${providerName} 的 API Key`}
        title={`API Key 设置 - ${providerName}`}
      >
        <FormPassword
          autoComplete={'new-password'}
          onChange={(value) => {
            setConfig(provider, { apiKey: value });
          }}
          placeholder={apiKeyPlaceholder || 'sk-***********************'}
          suffix={<div>{loading && <Icon icon={Loader2Icon} spin />}</div>}
          value={apiKey}
        />

        {showEndpoint &&
          showOpenAIProxyUrl &&
          (showProxy ? (
            <FormInput
              onChange={(value) => {
                setConfig(provider, { baseURL: value });
              }}
              placeholder={'https://api.openai.com/v1'}
              suffix={<div>{loading && <Icon icon={Loader2Icon} spin />}</div>}
              value={baseURL}
            />
          ) : (
            <Button
              icon={<Icon icon={Network} />}
              onClick={() => {
                setShow(true);
              }}
              type={'text'}
            >
              {'添加代理地址'}
            </Button>
          ))}
      </FormAction>
    );
  },
);

export default ProviderApiKeyForm;

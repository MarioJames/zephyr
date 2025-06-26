import { useEffect, useState } from 'react';
import aiInfra, { ModelDetailsResponse } from '@/services/ai-infra';

export const useModelContextWindowTokens = (model: string, provider: string) => {
  const [contextWindowTokens, setContextWindowTokens] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!model || !provider) {
      setContextWindowTokens(undefined);
      return;
    }
    let cancelled = false;
    aiInfra.getModelDetails({ model, provider })
      .then((res: ModelDetailsResponse) => {
        if (!cancelled) {
          setContextWindowTokens(res.contextWindowTokens);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContextWindowTokens(undefined);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [model, provider]);

  return contextWindowTokens;
};

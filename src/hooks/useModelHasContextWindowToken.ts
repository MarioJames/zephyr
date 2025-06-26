import { useAgentStore } from '@/store/agent';
import aiInfra from '@/services/ai-infra';
import { useEffect, useState } from 'react';
import type { ModelDetailsResponse } from '@/services/ai-infra';

export const useModelHasContextWindowToken = () => {
  const model = useAgentStore((s) => s.currentAgent?.model);
  const provider = useAgentStore((s) => s.currentAgent?.provider);
  const [hasContextWindowToken, setHasContextWindowToken] = useState<boolean>(false);

  useEffect(() => {
    if (!model || !provider) {
      setHasContextWindowToken(false);
      return;
    }
    let cancelled = false;
    aiInfra.getModelDetails({ model, provider })
      .then((res: ModelDetailsResponse) => {
        if (!cancelled) {
          setHasContextWindowToken(res.hasContextWindowToken);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasContextWindowToken(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [model, provider]);

  return hasContextWindowToken;
};

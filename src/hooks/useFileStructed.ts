import { structuredDataAPI } from '@/services';
import { sessionSelectors, useSessionStore } from '@/store/session';

export const useFileStructed = () => {
  const activeAgent = useSessionStore(sessionSelectors.activeSessionAgent);

  const structureFile = (fileId: string) => {
    return structuredDataAPI.upsertStructuredData({
      fileId,
      model: activeAgent?.model,
      provider: activeAgent?.provider,
      chatConfig: activeAgent?.params,
    });
  };

  return {
    structureFile,
  };
};

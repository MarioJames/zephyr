import { chatAPI, filesAPI, structuredDataAPI } from '@/services';
import { sessionSelectors, useSessionStore } from '@/store/session';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * 文件内容结构化
 * @returns
 */
export const useFileStructure = () => {
  const [loading, setLoading] = useState(false);

  const activeAgent = useSessionStore(sessionSelectors.activeSessionAgent);

  const handleFileStructure = async (fileId: string) => {
    setLoading(true);

    try {
      // 1. 从本地解析缓存中获取文本内容
      const res = await filesAPI.batchGetFileAndParseContent([fileId]);
      const parsed = res.files[0].parseResult;
      const content = parsed?.content || '';

      if (!content) throw new Error('未找到解析后的文件内容');

      // 2. 先调用摘要服务，获得 { summary, entities }
      const aiResult = await chatAPI.summarizeFileContent({
        content,
        model: activeAgent?.model,
        provider: activeAgent?.provider,
        chatConfig: activeAgent?.params,
      });

      // 3. 再调用后端保存接口，写入数据库
      structuredDataAPI.upsertStructuredData({
        fileId,
        data: aiResult,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading: loading,
    run: handleFileStructure,
  };
};

/**
 * 获取文件内容结构化数据
 * @param fileId 文件ID
 * @returns
 */
export const useStructedData = (fileId?: string) => {
  return useQuery({
    queryKey: ['structuredData', fileId],
    queryFn: async () => {
      if (!fileId) return null;

      const structuredData =
        await structuredDataAPI.getStructuredDataByFileId(fileId);

      return structuredData;
    },
  });
};

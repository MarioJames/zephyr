'use client';

import { useFileCategory } from '@/app/[variants]/(main)/files/hooks/useFileCategory';
import FileManager from '@/features/FileManager';
import { FilesTabs } from '@/types/files';

const tabNames = {
  [FilesTabs.All]: '全部文件',
  [FilesTabs.Documents]: '文档',
  [FilesTabs.Images]: '图片',
  [FilesTabs.Audios]: '语音',
  [FilesTabs.Videos]: '视频',
  [FilesTabs.Websites]: '网页',
};

export default () => {
  const [category] = useFileCategory();

  return <FileManager category={category} title={tabNames[category as FilesTabs]} />;
};

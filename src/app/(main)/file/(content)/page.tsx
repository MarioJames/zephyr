'use client';

import FileManager from '@/features/FileManager';
import { FilesTabs } from '../type';

import { useQueryState } from 'nuqs';


const useFileCategory = () =>
  useQueryState('category', { clearOnDefault: true, defaultValue: FilesTabs.All });

const tabNames = {
  [FilesTabs.All]: '全部文件',
  [FilesTabs.Documents]: '文档',
  [FilesTabs.Images]: '图片',
  [FilesTabs.Audios]: '语音',
  [FilesTabs.Videos]: '视频',
  [FilesTabs.Websites]: '网页',
};

const FilePage = () => {
  const [category] = useFileCategory();

  return <FileManager category={category} title={tabNames[category as FilesTabs]} />;
};

FilePage.displayName = 'FilePage';

export default FilePage;

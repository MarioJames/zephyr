import { useQueryState } from 'nuqs';

enum FilesTabs {
  All = 'all',
  Audios = 'audios',
  Documents = 'documents',
  Images = 'images',
  Videos = 'videos',
  Websites = 'websites',
}

export const useFileCategory = () =>
  useQueryState('category', { clearOnDefault: true, defaultValue: FilesTabs.All });

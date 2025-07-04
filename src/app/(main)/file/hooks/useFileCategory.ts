import { useQueryState } from 'nuqs';
import { FilesTabs } from '../type';

export const useFileCategory = () =>
  useQueryState('category', { clearOnDefault: true, defaultValue: FilesTabs.All });

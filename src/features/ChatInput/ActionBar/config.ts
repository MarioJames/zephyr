// import { MainToken } from './Token';
import Search from './Search';
import Upload from './Upload';

export const actionMap = {
  fileUpload: Upload,
  search: Search,
  // mainToken: MainToken,
} as const;

export type ActionKeys = keyof typeof actionMap;

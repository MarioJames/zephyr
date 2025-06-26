// import { MainToken } from './Token';
import Upload from './Upload';

export const actionMap = {
  fileUpload: Upload,
  // mainToken: MainToken,
} as const;

export type ActionKeys = keyof typeof actionMap;

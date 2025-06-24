import { MainToken, PortalToken } from './Token';
import Upload from './Upload';

export const actionMap = {
  fileUpload: Upload,
  mainToken: MainToken,
  portalToken: PortalToken,
} as const;

export type ActionKeys = keyof typeof actionMap;

import Clear from './Clear';
import Model from './Model';
import Params from './Params';
import { MainToken, PortalToken } from './Token';

export const actionMap = {
  clear: Clear,
  mainToken: MainToken,
  model: Model,
  params: Params,
  portalToken: PortalToken,
  temperature: Params,
} as const;

export type ActionKeys = keyof typeof actionMap;

import Clear from './Clear';
import Model from './Model';
import Params from './Params';
import { MainToken } from './Token';

export const actionMap = {
  clear: Clear,
  mainToken: MainToken,
  model: Model,
  params: Params,
  temperature: Params,
} as const;

export type ActionKeys = keyof typeof actionMap;

import Clear from './Clear';
import Params from './Params';

export const actionMap = {
  clear: Clear,
  params: Params,
  temperature: Params,
} as const;

export type ActionKeys = keyof typeof actionMap;

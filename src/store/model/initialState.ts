import {
  ModelCoreState,
  initialModelCoreState,
} from './slices/core/initialState';

export type ModelState = ModelCoreState;

export const initialState: ModelState = {
  ...initialModelCoreState,
};

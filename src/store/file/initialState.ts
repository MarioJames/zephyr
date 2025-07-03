import {
  initialFileCoreState,
  FileCoreState,
} from './slices/core/initialState';

export type FileState = FileCoreState;

export const initialState: FileState = {
  ...initialFileCoreState,
};

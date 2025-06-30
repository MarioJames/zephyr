import {
  SessionCoreState,
  sessionCoreInitialState,
} from './slices/core/initialState';
import {
  SessionActiveState,
  sessionActiveInitialState,
} from './slices/active/initialState';

export type SessionState = SessionCoreState & SessionActiveState;

export const initialState: SessionState = {
  ...sessionCoreInitialState,
  ...sessionActiveInitialState,
};

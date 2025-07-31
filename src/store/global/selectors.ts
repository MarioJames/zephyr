import { generalSelectors } from './slices/general/selectors';
import { workspaceSelectors } from './slices/workspace/selectors';
import { userSelectors } from './slices/user/selectors';

export const globalSelectors = {
  ...generalSelectors,
  ...userSelectors,
  ...workspaceSelectors,
};

import { useCustomerStore } from './store';

export { useCustomerStore } from './store';
export type { CustomerStore } from './store';

export type { CustomerState, CustomerStatsItem } from './initialState';

export type { CoreAction } from './slices/core/action';
export type { CategoryAction } from './slices/category/action';

export { customerSelectors } from './selectors';

export const getCustomerStoreState = () => useCustomerStore.getState();

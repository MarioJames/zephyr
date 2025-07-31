import { useCustomerStore } from './store';

export type { CustomerState, CustomerStatsItem } from './initialState';
export { customerSelectors } from './selectors';
export type { CategoryAction } from './slices/category/action';
export type { CoreAction } from './slices/core/action';
export type { CustomerStore } from './store';
export { useCustomerStore } from './store';

export const getCustomerStoreState = () => useCustomerStore.getState();

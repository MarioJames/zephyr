import { SessionStore } from '../../store';

const isLoading = (state: SessionStore) => state.isLoading;
const isSearching = (state: SessionStore) => state.isSearching;
const isInitialized = (state: SessionStore) => state.isInitialized;
const needsRefresh = (state: SessionStore) => state.needsRefresh;
const searchResults = (state: SessionStore) => state.searchResults;
const searchKeyword = (state: SessionStore) => state.searchKeyword;
const sessions = (state: SessionStore) => state.sessions;

export const sessionCoreSelectors = {
  isLoading,
  isSearching,
  isInitialized,
  needsRefresh,
  searchResults,
  searchKeyword,
  sessions,
};

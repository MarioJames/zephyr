import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { FileCoreAction , fileCoreSlice } from './slices/core/action';
import { FileState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

export interface FileStore extends FileState, FileCoreAction {}

const createStore: StateCreator<FileStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...fileCoreSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('file');

export const useFileStore = createWithEqualityFn<FileStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);

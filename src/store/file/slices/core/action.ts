import { StateCreator } from 'zustand';
import { FileCoreState } from './initialState';
import { filesAPI } from '@/services';

export interface FileCoreAction {
  uploadFiles: (files: File[]) => Promise<void>;
  clearFileList: () => void;

  getFileAccessUrl: (fileId: string) => Promise<string>;
}

export const fileCoreSlice: StateCreator<
  FileCoreState & FileCoreAction,
  [],
  [],
  FileCoreAction
> = (set, get) => ({
  // 上传文件
  uploadFiles: async (files: File[]) => {
    set({ uploading: true });

    try {
      const res = await filesAPI.batchUpload({
        files,
      });

      set({
        fileList: [...get().fileList, ...res.successful],
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ uploading: false });
    }
  },

  // 清空文件列表
  clearFileList: () => set({ fileList: [] }),

  // 获取文件访问 URL
  getFileAccessUrl: async (fileId: string) => {
    const fileAccessUrlMap = get().fileAccessUrlMap;

    const fileAccess = fileAccessUrlMap.get(fileId);

    if (fileAccess && Number(fileAccess.expiresAt) > Date.now()) {
      return fileAccess.url;
    }

    const access = await filesAPI.getFileAccessUrl(fileId);

    fileAccessUrlMap.set(fileId, access);

    return access.url;
  },
});

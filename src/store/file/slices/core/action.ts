import { StateCreator } from 'zustand';
import { FileItem } from '@/services/files';
import { DockFileItem, FileCoreState } from './initialState';
import { filesAPI } from '@/services';

export interface FileCoreAction {
  // 获取文件列表
  useFetchFileManage: (params?: {
    search?: string | null;
    page?: number;
    pageSize?: number;
    fileType?: string;
  }) => Promise<{
    data: FileItem[];
    isLoading: boolean;
  }>;

  // 添加文件到 dock 列表
  pushDockFileList: (files: File[]) => Promise<void>;

  // 管理 dock 文件列表
  dispatchDockFileList: (action: {
    type: 'removeFiles';
    ids: string[];
  }) => void;

  // 删除文件
  removeFileItem: (hashId: string) => Promise<void>;

  // 更新文件列表
  setFiles: (files: FileItem[]) => void;

  // 更新总数
  setTotal: (total: number) => void;

  // 更新加载状态
  setLoading: (loading: boolean) => void;

  // 更新 dock 文件列表
  setDockFiles: (files: DockFileItem[]) => void;

  // 获取文件访问 URL
  getFileAccessUrl: (fileId: string) => Promise<string>;
}

export const fileCoreSlice: StateCreator<
  FileCoreState & FileCoreAction,
  [],
  [],
  FileCoreAction
> = (set, get) => ({
  useFetchFileManage: async (params) => {
    set({ loading: true });
    try {
      const response = await filesAPI.getFileList({
        search: params?.search,
        page: params?.page,
        pageSize: params?.pageSize,
        fileType: params?.fileType,
        // 其他参数映射
      });
      console.log('response',response);
      
      set({ 
        fileList: response.files,
        pagination: {
          ...get().pagination,
          total: response.total,
        },
        loading: false,
      });
      
      return {
        data: response.files,
        isLoading: false,
      };
    } catch (error) {
      console.error('Error fetching files:', error);
      set({ loading: false });
      return {
        data: [],
        isLoading: false,
      };
    }
  },

  pushDockFileList: async (files) => {
    const dockFileList = get().dockFileList;
    
    // 将文件添加到 dock 列表
    const newDockFiles = files.map((file) => ({
      hashId: Math.random().toString(36).slice(2),
      filename: file.name,
      fileType: file.type || 'unknown',
      size: file.size,
      hash: '',
      url: '',
      uploadedAt: new Date().toISOString(),
      metadata: {
        filename: file.name,
        dirname: '',
        path: '',
        date: new Date().toISOString(),
      },
      status: 'pending' as const,
      progress: 0,
    } as DockFileItem));

    set({ dockFileList: [...dockFileList, ...newDockFiles] });

    // 上传文件
    for (const [index, file] of files.entries()) {
      const dockFile = newDockFiles[index];
      
      try {
        // 更新状态为上传中
        set({
          dockFileList: get().dockFileList.map((item: DockFileItem) =>
            item.hashId === dockFile.hashId
              ? { ...item, status: 'uploading' as const }
              : item
          ),
        });

        // 上传文件
        const result = await filesAPI.batchUpload({
          files: [file],
        });

        if (result.successful.length > 0) {
          // 更新状态为成功
          set({
            dockFileList: get().dockFileList.map((item: DockFileItem) =>
              item.hashId === dockFile.hashId
                ? {
                    ...item,
                    ...result.successful[0],
                    status: 'success' as const,
                    progress: 100,
                  }
                : item
            ),
          });
        } else {
          throw new Error(result.failed[0]?.error || '上传失败');
        }
      } catch (error) {
        // 更新状态为错误
        set({
          dockFileList: get().dockFileList.map((item) =>
            item.hashId === dockFile.hashId
              ? {
                  ...item,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : '上传失败',
                }
              : item
          ),
        });
      }
    }
  },

  dispatchDockFileList: (action) => {
    switch (action.type) {
      case 'removeFiles': {
        set({
          dockFileList: get().dockFileList.filter(
            (item: DockFileItem) => !action.ids.includes(item.hashId)
          ),
        });
        break;
      }
    }
  },

  removeFileItem: async (hashId) => {
    try {
      await filesAPI.deleteFile(hashId);
      const { fileList, pagination } = get();
      set({
        fileList: fileList.filter((item) => item.hashId !== hashId),
        pagination: {
          ...pagination,
          total: pagination.total - 1,
        },
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  },

  setFiles: (files) => set({ fileList: files }),
  setTotal: (total) => set({ 
    pagination: {
      ...get().pagination,
      total,
    },
  }),
  setLoading: (loading) => set({ loading }),
  setDockFiles: (files) => set({ dockFileList: files }),

  getFileAccessUrl: async (fileId: string) => {
    try {
      const access = await filesAPI.getFileAccessUrl(fileId);
      return access.url;
    } catch (error) {
      console.error('Failed to get file access URL:', error);
      throw error;
    }
  },
});

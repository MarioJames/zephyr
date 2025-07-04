import { StateCreator } from 'zustand';
import { FileCoreState, ParsedFileContent, DockFileItem } from './initialState';
import { filesAPI } from '@/services';
import { FileItem, UploadAndParseRequest, UploadAndParseResponse } from '@/services/files';

export interface FileCoreAction {
  // 文件列表管理
  fetchFileList: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sorter?: { field: string; order: 'ascend' | 'descend' };
  }) => Promise<void>;
  setSearchKeyword: (keyword: string) => void;
  setSorter: (sorter: { field: string; order: 'ascend' | 'descend' }) => void;
  setPagination: (pagination: { current: number; pageSize: number }) => void;
  
  // 文件选择
  setSelectedFileIds: (ids: string[]) => void;
  toggleFileSelection: (id: string) => void;
  clearFileSelection: () => void;
  
  // 文件上传
  uploadFiles: (files: File[], knowledgeBaseId?: string) => Promise<void>;
  clearFileList: () => void;
  
  // 文件删除
  removeFileItem: (id: string) => Promise<void>;
  
  // 文件访问
  getFileAccessUrl: (fileId: string) => Promise<string>;
  
  // 文件解析相关
  parseDocument: (file: File) => Promise<ParsedFileContent>;
  getParsedFileContent: (fileId: string) => ParsedFileContent | undefined;
  clearParsedFileContent: (fileId: string) => void;
  clearAllParsedFileContent: () => void;
  
  // 一体化上传和解析
  uploadAndParse: (data: UploadAndParseRequest) => Promise<UploadAndParseResponse>;
  
  // Dock 文件列表管理
  pushDockFileList: (files: File[], knowledgeBaseId?: string) => Promise<void>;
  updateDockFileItem: (id: string, updates: Partial<DockFileItem>) => void;
  removeDockFileItem: (id: string) => void;
  clearDockFileList: () => void;
  dispatchDockFileList: (action: { type: 'removeFiles'; ids: string[] }) => void;
}

export const fileCoreSlice: StateCreator<
  FileCoreState & FileCoreAction,
  [],
  [],
  FileCoreAction
> = (set, get) => ({
  // 文件列表管理
  fetchFileList: async (params) => {
    set({ loading: true });
    try {
      const { current, pageSize } = get().pagination;
      const { field, order } = get().sorter;
      const searchKeyword = get().searchKeyword;
      
      const res = await filesAPI.getFileList({
        page: params?.page || current,
        pageSize: params?.pageSize || pageSize,
        search: params?.search || searchKeyword,
        fileType: undefined, // 可以根据需要添加文件类型过滤
      });
      
      set({
        fileList: res.files,
        pagination: {
          current: res.page,
          pageSize: res.pageSize,
          total: res.total,
        },
      });
    } catch (error) {
      console.error('获取文件列表失败:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setSorter: (sorter) => set({ sorter }),
  setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),
  
  // 文件选择
  setSelectedFileIds: (ids) => set({ selectedFileIds: ids }),
  toggleFileSelection: (id) => {
    const selectedIds = get().selectedFileIds;
    const index = selectedIds.indexOf(id);
    if (index > -1) {
      selectedIds.splice(index, 1);
    } else {
      selectedIds.push(id);
    }
    set({ selectedFileIds: [...selectedIds] });
  },
  clearFileSelection: () => set({ selectedFileIds: [] }),
  
  // 文件上传
  uploadFiles: async (files: File[], knowledgeBaseId?: string) => {
    set({ uploading: true });

    try {
      const res = await filesAPI.batchUpload({
        files,
        knowledgeBaseId,
      });

      set({
        fileList: [...get().fileList, ...res.successful],
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      set({ uploading: false });
    }
  },

  // 清空文件列表
  clearFileList: () => set({ fileList: [] }),
  
  // 删除文件
  removeFileItem: async (id: string) => {
    try {
      await filesAPI.deleteFile(id);
      set({
        fileList: get().fileList.filter((item) => item.id !== id),
      });
    } catch (error) {
      console.error('删除文件失败:', error);
      throw error;
    }
  },

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

  // 解析文档内容
  parseDocument: async (file: File) => {
    set({ parsing: true });

    try {
      const response = await filesAPI.parseDocument({ file });

      if (response.parseStatus === 'failed') {
        throw new Error(response.error || '文档解析失败');
      }

      const parsedContent: ParsedFileContent = {
        fileId: response.fileId,
        content: response.content,
        filename: response.filename,
        fileType: response.fileType,
        parseStatus: response.parseStatus,
        parsedAt: response.parsedAt,
        error: response.error,
        metadata: response.metadata,
      };

      const parsedFileContentMap = get().parsedFileContentMap;
      parsedFileContentMap.set(parsedContent.fileId, parsedContent);

      return parsedContent;
    } catch (error) {
      console.error('文档解析失败:', error);
      throw error;
    } finally {
      set({ parsing: false });
    }
  },

  // 获取解析后的文件内容
  getParsedFileContent: (fileId: string) => {
    return get().parsedFileContentMap.get(fileId);
  },

  // 清除单个解析后的文件内容
  clearParsedFileContent: (fileId: string) => {
    const parsedFileContentMap = get().parsedFileContentMap;
    parsedFileContentMap.delete(fileId);
  },

  // 清除所有解析后的文件内容
  clearAllParsedFileContent: () => {
    set({ parsedFileContentMap: new Map() });
  },

  // 一体化上传和解析
  uploadAndParse: async (data: UploadAndParseRequest) => {
    set({ uploading: true, parsing: true });

    try {
      const response = await filesAPI.uploadAndParse(data);

      // 将文件添加到文件列表
      set({
        fileList: [...get().fileList, response.fileItem],
      });

      // 将解析结果存储到解析内容映射中
      if (response.parseResult.parseStatus === 'completed') {
        const parsedContent: ParsedFileContent = {
          fileId: response.parseResult.fileId,
          content: response.parseResult.content,
          filename: response.parseResult.filename,
          fileType: response.parseResult.fileType,
          parseStatus: response.parseResult.parseStatus,
          parsedAt: response.parseResult.parsedAt,
          error: response.parseResult.error,
          metadata: response.parseResult.metadata,
        };

        const parsedFileContentMap = get().parsedFileContentMap;
        parsedFileContentMap.set(parsedContent.fileId, parsedContent);
      }

      return response;
    } catch (error) {
      console.error('文件上传和解析失败:', error);
      throw error;
    } finally {
      set({ uploading: false, parsing: false });
    }
  },
  
  // Dock 文件列表管理
  pushDockFileList: async (files: File[], knowledgeBaseId?: string) => {
    const dockItems: DockFileItem[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      filename: file.name,
      fileType: file.type,
      size: file.size,
      hash: '',
      url: '',
      uploadedAt: new Date().toISOString(),
      metadata: {
        date: new Date().toISOString(),
        dirname: '',
        filename: file.name,
        path: '',
      },
      status: 'pending',
      progress: 0,
    }));
    
    set({ dockFileList: [...get().dockFileList, ...dockItems] });
    
    for (const [index, file] of files.entries()) {
      const dockItem = dockItems[index];
      
      try {
        // 更新状态为上传中
        get().updateDockFileItem(dockItem.id, { status: 'uploading', progress: 0 });
        
        // 上传文件
        const uploadedFile = await filesAPI.upload({
          file,
          knowledgeBaseId,
        });
        
        // 更新状态为成功
        get().updateDockFileItem(dockItem.id, {
          ...uploadedFile,
          status: 'success',
          progress: 100,
        });
        
        // 更新文件列表
        set({ fileList: [...get().fileList, uploadedFile] });
      } catch (error: any) {
        console.error('文件上传失败:', error);
        get().updateDockFileItem(dockItem.id, {
          status: 'error',
          error: error.message || '上传失败',
        });
      }
    }
  },
  
  updateDockFileItem: (id, updates) => {
    set({
      dockFileList: get().dockFileList.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  },
  
  removeDockFileItem: (id) => {
    set({
      dockFileList: get().dockFileList.filter((item) => item.id !== id),
    });
  },
  
  clearDockFileList: () => set({ dockFileList: [] }),
  
  dispatchDockFileList: (action) => {
    switch (action.type) {
      case 'removeFiles': {
        set({
          dockFileList: get().dockFileList.filter(
            (item) => !action.ids.includes(item.id),
          ),
        });
        break;
      }
    }
  },
});

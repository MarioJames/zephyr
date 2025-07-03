import { StateCreator } from 'zustand';
import { FileCoreState, ParsedFileContent } from './initialState';
import { filesAPI } from '@/services';
import { UploadAndParseRequest, UploadAndParseResponse } from '@/services/files';

export interface FileCoreAction {
  uploadFiles: (files: File[]) => Promise<void>;
  clearFileList: () => void;
  
  getFileAccessUrl: (fileId: string) => Promise<string>;
  
  // 文件解析相关
  parseDocument: (file: File) => Promise<ParsedFileContent>;
  getParsedFileContent: (fileId: string) => ParsedFileContent | undefined;
  clearParsedFileContent: (fileId: string) => void;
  clearAllParsedFileContent: () => void;
  
  // 一体化上传和解析
  uploadAndParse: (data: UploadAndParseRequest) => Promise<UploadAndParseResponse>;
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
});

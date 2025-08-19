import { StateCreator } from 'zustand';
import { ChatStore } from '../../store';
import {
  FileItem,
  UploadAndParseRequest,
  UploadAndParseResponse,
} from '@/services/files';
import { filesAPI } from '@/services';
import { ParsedFileContent } from '@/store/file/slices/core/initialState';
import { useSessionStore } from '@/store/session';

// 扩展 FileItem 类型以包含前端需要的字段
export interface ChatFileItem extends FileItem {
  originalFile?: File;
  base64?: string;
  status?: 'pending' | 'uploading' | 'success' | 'error';
}

interface AddFile {
  atStart?: boolean;
  file: ChatFileItem;
  type: 'addFile';
}

interface AddFiles {
  atStart?: boolean;
  files: ChatFileItem[];
  type: 'addFiles';
}

interface UpdateFile {
  id: string;
  type: 'updateFile';
  value: Partial<ChatFileItem>;
}

interface UpdateFileStatus {
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  type: 'updateFileStatus';
}

interface UpdateFileUploadState {
  id: string;
  type: 'updateFileUploadState';
  uploadState: 'pending' | 'success' | 'error';
}

interface RemoveFile {
  id: string;
  type: 'removeFile';
}

interface RemoveFiles {
  ids: string[];
  type: 'removeFiles';
}

export type UploadFileListDispatch =
  | AddFile
  | UpdateFileStatus
  | UpdateFileUploadState
  | RemoveFile
  | AddFiles
  | UpdateFile
  | RemoveFiles;

export interface UploadAction {
  // 上传文件
  uploadChatFiles: (files: File) => Promise<void>;
  uploadChatFilesAndParse: (
    data: UploadAndParseRequest
  ) => Promise<UploadAndParseResponse>;

  // 清空文件列表
  clearChatUploadFileList: () => void;
  // 删除文件
  removeChatUploadFile: (id: string) => Promise<void>;

  // 文件解析相关
  getParsedFileContent: (fileId: string) => ParsedFileContent | undefined;
  clearParsedFileContent: (fileId: string) => void;
  clearAllParsedFileContent: () => void;

  // 批量获取文件和解析内容
  batchGetFileAndParseContent: (fileIds: string[]) => Promise<void>;
}

export const uploadSlice: StateCreator<ChatStore, [], [], UploadAction> = (
  set,
  get
) => ({
  // 上传文件
  uploadChatFiles: async (file: File) => {
    set({
      uploadingFiles: [...get().uploadingFiles, file],
    });

    try {
      set({
        chatUploadFileList: [
          ...get().chatUploadFileList,
          {
            originalFile: file,
            filename: file.name,
            fileType: file.type,
            size: file.size,
            status: 'uploading' as const,
          },
        ],
      });

      const res = await filesAPI.batchUpload({
        files: [file],
        sessionId: useSessionStore.getState().activeSessionId,
      });

      set({
        chatUploadFileList: [
          // 删除正在上传的文件
          ...get().chatUploadFileList.filter(
            (chatFile) => chatFile.originalFile !== file
          ),
          // 添加上传成功的文件
          ...res.successful.map((file) => ({
            ...file,
            status: 'success' as const,
          })),
        ],
      });
    } catch (error) {
      console.error(error);

      set({
        chatUploadFileList: get().chatUploadFileList.filter(
          (chatFile) => chatFile.originalFile !== file
        ),
      });

      throw error;
    } finally {
      set({
        uploadingFiles: get().uploadingFiles.filter(
          (uploadingFile) => uploadingFile !== file
        ),
      });
    }
  },

  // 一体化上传和解析
  uploadChatFilesAndParse: async (data: UploadAndParseRequest) => {
    set({
      uploadingFiles: [...get().uploadingFiles, data.file],
    });

    try {
      // 添加文件到列表
      set({
        chatUploadFileList: [
          ...get().chatUploadFileList,
          {
            originalFile: data.file,
            filename: data.file.name,
            fileType: data.file.type,
            size: data.file.size,
            status: 'uploading' as const,
          },
        ],
      });

      const response = await filesAPI.uploadAndParseDocument(data);

      if (response.parseResult.parseStatus !== 'completed') {
        throw new Error('文件解析失败');
      }

      // 将文件添加到文件列表
      set({
        chatUploadFileList: [
          ...get().chatUploadFileList.filter(
            (chatFile) => chatFile.originalFile !== data.file
          ),
          {
            ...response.fileItem,
            status: 'success' as const,
          },
        ],
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
      console.error('文件上传和解析失败', error);

      set({
        chatUploadFileList: get().chatUploadFileList.filter(
          (chatFile) => chatFile.originalFile !== data.file
        ),
      });

      throw error;
    } finally {
      set({
        uploadingFiles: get().uploadingFiles.filter(
          (uploadingFile) => uploadingFile !== data.file
        ),
      });
    }
  },

  clearChatUploadFileList: () => {
    set({ chatUploadFileList: [] });
  },

  removeChatUploadFile: async (fileId: string) => {
    const { chatUploadFileList } = get();

    set({
      chatUploadFileList: chatUploadFileList.filter(
        (chatFile) => chatFile.id !== fileId
      ),
    });
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

  // 批量获取文件和解析内容
  batchGetFileAndParseContent: async (fileIds: string[]) => {
    const res = await filesAPI.batchGetFileAndParseContent(fileIds);

    const parsedFileContentMap = new Map<string, ParsedFileContent>();

    const chatUploadFileList: ChatFileItem[] = [];

    for (const item of res.files) {
      const { fileItem, parseResult } = item;

      chatUploadFileList.push({
        ...fileItem,
        status: 'success' as const,
      });

      if (parseResult && parseResult.parseStatus === 'completed') {
        parsedFileContentMap.set(fileItem.id, parseResult);
      }
    }

    set({
      chatUploadFileList,
      parsedFileContentMap,
    });
  },
});

import { StateCreator } from 'zustand';
import { ChatStore } from '../../store';
import { uploadFileListReducer } from '../../helpers';
import { FileItem } from '@/services/files';
import { RcFile } from 'antd/es/upload';
import { FILE_UPLOAD_BLACKLIST } from '@/const/file';
import { filesAPI } from '@/services';

interface AddFile {
  atStart?: boolean;
  file: FileItem;
  type: 'addFile';
}

interface AddFiles {
  atStart?: boolean;
  files: FileItem[];
  type: 'addFiles';
}

interface UpdateFile {
  id: string;
  type: 'updateFile';
  value: Partial<FileItem>;
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
  uploadChatFiles: (files: RcFile[]) => Promise<void>;

  clearChatUploadFileList: () => void;

  dispatchChatUploadFileList: (payload: UploadFileListDispatch) => void;

  removeChatUploadFile: (id: string) => Promise<void>;

  // 简化的上传方法，不包含进度回调
  uploadFile: (file: RcFile) => Promise<{ id: string; url: string }>;
}

export const uploadSlice: StateCreator<ChatStore, [], [], UploadAction> = (
  set,
  get
) => ({
  clearChatUploadFileList: () => {
    set({ chatUploadFileList: [] });
  },

  dispatchChatUploadFileList: (payload) => {
    const nextValue = uploadFileListReducer(get().chatUploadFileList, payload);
    if (nextValue === get().chatUploadFileList) return;

    set({ chatUploadFileList: nextValue }, false);
  },

  removeChatUploadFile: async (id) => {
    const { dispatchChatUploadFileList } = get();

    dispatchChatUploadFileList({ id, type: 'removeFile' });
    await filesAPI.deleteFile(id);
  },

  // 简化的文件上传方法，只返回基本信息
  uploadFile: async (file: RcFile) => {
    try {
      const response = await filesAPI.upload({ file });
      return {
        id: response.id,
        url: response.url,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  uploadChatFiles: async (rawFiles) => {
    const { dispatchChatUploadFileList, uploadFile } = get();

    // 设置正在上传状态
    set({ isUploading: true });

    // 过滤黑名单文件
    const files = rawFiles.filter(
      (file) => !FILE_UPLOAD_BLACKLIST.includes(file.name)
    );

    // 添加文件到列表，初始状态为 pending
    const uploadFiles: FileItem[] = await Promise.all(
      files.map(async (file) => {
        let previewUrl: string | undefined = undefined;

        // 为图片和视频创建预览URL
        if (file.type.startsWith('image') || file.type.startsWith('video')) {
          const data = await file.arrayBuffer();
          previewUrl = URL.createObjectURL(
            new Blob([data!], { type: file.type })
          );
        }

        return {
          id: file.name,
          filename: file.name,
          fileType: file.type,
          size: file.size,
          hash: '',
          url: '',
          uploadedAt: '',
          metadata: {},
          status: 'pending',
          previewUrl,
        } as FileItem;
      })
    );

    dispatchChatUploadFileList({ files: uploadFiles, type: 'addFiles' });

    // 并行上传所有文件
    const uploadPromises = files.map(async (file) => {
      try {
        // 更新状态为上传中
        dispatchChatUploadFileList({
          id: file.name,
          type: 'updateFileStatus',
          status: 'uploading',
        });

        // 执行上传
        const result = await uploadFile(file);

        // 更新状态为成功
        dispatchChatUploadFileList({
          id: file.name,
          type: 'updateFile',
          value: {
            id: result.id,
            url: result.url,
            status: 'success',
          },
        });

        return result;
      } catch (error) {
        console.error('Upload failed for file:', file.name, error);

        // 更新状态为错误
        dispatchChatUploadFileList({
          id: file.name,
          type: 'updateFileStatus',
          status: 'error',
        });

        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Some uploads failed:', error);
      // 即使部分上传失败，也不中断整个过程
    } finally {
      // 重置上传状态
      set({ isUploading: false });
    }
  },
});

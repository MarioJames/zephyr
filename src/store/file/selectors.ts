import { FileItem } from '@/services/files';
import { DockFileItem, FileCoreState } from './slices/core/initialState';

export const fileCoreSelectors = {
  // 获取单个文件
  getFileById: (id: string) => (state: FileCoreState) => 
    state.fileList.find((file) => file.id === id) as FileItem,

  // 获取 Dock 文件列表
  dockFileList: (state: FileCoreState) => state.dockFileList as DockFileItem[],

  // 获取上传进度概览
  overviewUploadingProgress: (state: FileCoreState) => {
    const uploadingFiles = state.dockFileList.filter(
      (file) => file.status === 'uploading' || file.status === 'pending'
    );
    
    if (uploadingFiles.length === 0) return 100;

    const totalProgress = uploadingFiles.reduce((acc, file) => acc + file.progress, 0);
    return Math.round(totalProgress / uploadingFiles.length);
  },

  // 获取上传状态概览
  overviewUploadingStatus: (state: FileCoreState) => {
    const files = state.dockFileList;
    
    if (files.length === 0) return 'success';

    // 如果有任何文件处于上传中状态，则整体状态为上传中
    if (files.some((file) => file.status === 'uploading' || file.status === 'pending')) {
      return 'uploading';
    }

    // 如果有任何文件上传失败，则整体状态为错误
    if (files.some((file) => file.status === 'error')) {
      return 'error';
    }

    // 所有文件都上传成功
    return 'success';
  },

  // 获取文件列表
  fileList: (state: FileCoreState) => state.fileList,

  // 获取文件总数
  totalFiles: (state: FileCoreState) => state.fileList.length,

  // 获取正在上传的文件数量
  uploadingFilesCount: (state: FileCoreState) =>
    state.dockFileList.filter(
      (file) => file.status === 'uploading' || file.status === 'pending'
    ).length,

  // 获取上传失败的文件数量
  failedFilesCount: (state: FileCoreState) =>
    state.dockFileList.filter((file) => file.status === 'error').length,
};

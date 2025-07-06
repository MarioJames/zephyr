import { UploadState } from './initialState';

const isUploading = (s: UploadState) => s.uploadingFiles.length > 0;

export const uploadSelectors = {
  isUploading,
};

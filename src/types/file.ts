import { FileItem } from '@/services/files';

export interface UploadFileItem extends FileItem {
  status: 'pending' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
  uploadState?: {
    progress: number;
    speed?: number;
    restTime?: number;
  };
} 
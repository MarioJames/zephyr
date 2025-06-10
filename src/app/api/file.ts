import { request } from './index';
import fileMock from '../mock/file';

export const fileApi = {
  upload: (data: any) =>
    fileMock['/file/upload']?.(data) || request('/file/upload', data),
  delete: (data: any) =>
    fileMock['/file/delete']?.(data) || request('/file/delete', data),
  list: (data: any) =>
    fileMock['/file/list']?.(data) || request('/file/list', data),
}; 
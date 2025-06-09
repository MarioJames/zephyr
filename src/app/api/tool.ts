import { request } from './index';

export const toolApi = {
  getToolManifest: (manifest: any) => request('/tool/getToolManifest', { manifest }),
  getToolList: () => request('/tool/getToolList', {}),
}; 
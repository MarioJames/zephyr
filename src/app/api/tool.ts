import { request } from './index';
import toolMock from '../mock/tool';

export const toolApi = {
  getToolManifest: (manifest: any) =>
    toolMock['/tool/getToolManifest']?.({ manifest }) || request('/tool/getToolManifest', { manifest }),
  getToolList: () =>
    toolMock['/tool/getToolList']?.({}) || request('/tool/getToolList', {}),
}; 
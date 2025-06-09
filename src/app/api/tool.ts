import { request } from './index';

export const toolApi = {
  /**
   * 获取插件清单
   * @param manifest any 清单参数
   * @returns Promise<any> 插件清单
   */
  getToolManifest: (manifest: any) => request('/tool/getToolManifest', { manifest }),
  /**
   * 获取插件市场列表
   * @returns Promise<any[]> 插件数组
   */
  getToolList: () => request('/tool/getToolList', {}),
}; 
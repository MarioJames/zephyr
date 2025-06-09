import { request } from './index';

export const pluginApi = {
  /**
   * 安装插件
   * @param plugin any 插件信息
   * @returns Promise<any>
   */
  installPlugin: (plugin: any) => request('/plugin/installPlugin', plugin),
  /**
   * 获取已安装插件列表
   * @returns Promise<any[]> 插件数组
   */
  getInstalledPlugins: () => request('/plugin/getInstalledPlugins', {}),
  /**
   * 卸载插件
   * @param identifier string 插件唯一标识
   * @returns Promise<any>
   */
  uninstallPlugin: (identifier: string) => request('/plugin/uninstallPlugin', { identifier }),
  /**
   * 创建自定义插件
   * @param customPlugin any 插件信息
   * @returns Promise<any>
   */
  createCustomPlugin: (customPlugin: any) => request('/plugin/createCustomPlugin', customPlugin),
  /**
   * 更新插件
   * @param id string 插件ID
   * @param value any 更新内容
   * @returns Promise<any>
   */
  updatePlugin: (id: string, value: any) => request('/plugin/updatePlugin', { id, value }),
  /**
   * 更新插件清单
   * @param id string 插件ID
   * @param manifest any 清单内容
   * @returns Promise<any>
   */
  updatePluginManifest: (id: string, manifest: any) => request('/plugin/updatePluginManifest', { id, manifest }),
  /**
   * 移除所有插件
   * @returns Promise<any>
   */
  removeAllPlugins: () => request('/plugin/removeAllPlugins', {}),
  /**
   * 更新插件设置
   * @param id string 插件ID
   * @param settings any 设置内容
   * @returns Promise<any>
   */
  updatePluginSettings: (id: string, settings: any) => request('/plugin/updatePluginSettings', { id, settings }),
}; 
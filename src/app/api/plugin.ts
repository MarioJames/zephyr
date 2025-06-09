import { request } from './index';

export const pluginApi = {
  installPlugin: (plugin: any) => request('/plugin/installPlugin', plugin),
  getInstalledPlugins: () => request('/plugin/getInstalledPlugins', {}),
  uninstallPlugin: (identifier: string) => request('/plugin/uninstallPlugin', { identifier }),
  createCustomPlugin: (customPlugin: any) => request('/plugin/createCustomPlugin', customPlugin),
  updatePlugin: (id: string, value: any) => request('/plugin/updatePlugin', { id, value }),
  updatePluginManifest: (id: string, manifest: any) => request('/plugin/updatePluginManifest', { id, manifest }),
  removeAllPlugins: () => request('/plugin/removeAllPlugins', {}),
  updatePluginSettings: (id: string, settings: any) => request('/plugin/updatePluginSettings', { id, settings }),
}; 
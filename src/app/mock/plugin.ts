export default {
  '/plugin/installPlugin': () => ({ success: true }),
  '/plugin/getInstalledPlugins': () => [{ id: 'plugin-001', name: 'mock plugin' }],
  '/plugin/uninstallPlugin': () => ({ success: true }),
  '/plugin/createCustomPlugin': () => ({ success: true }),
  '/plugin/updatePlugin': () => ({ success: true }),
  '/plugin/updatePluginManifest': () => ({ success: true }),
  '/plugin/removeAllPlugins': () => ({ success: true }),
  '/plugin/updatePluginSettings': () => ({ success: true }),
}; 
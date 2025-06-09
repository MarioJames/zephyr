export default {
  '/global/getGlobalConfig': () => ({ siteName: 'Mock Site', version: '1.0.0' }),
  '/global/getLatestVersion': () => ({ version: '1.0.0', changelog: 'Initial release' }),
}; 
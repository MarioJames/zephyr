export default {
  '/global/getGlobalConfig': () => ({
    config: {
      themeMode: 'auto',
      showChatSideBar: true,
      showFilePanel: true,
      showHotkeyHelper: false,
      showSessionPanel: true,
      showSlotPanel: true,
      showSystemRole: false,
      zenMode: false,
    },
  }),
  '/global/getLatestVersion': () => ({ version: '1.0.0', changelog: 'Initial release' }),
}; 
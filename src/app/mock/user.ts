export default {
  '/user/getUserRegistrationDuration': () => 100,
  '/user/getUserState': () => ({ id: 'user-001', username: 'mockuser', avatar: '', isOnboard: true }),
  '/user/getUserSSOProviders': () => [],
  '/user/unlinkSSOProvider': () => ({ success: true }),
  '/user/updateUserSettings': () => ({ success: true }),
  '/user/resetUserSettings': () => ({ success: true }),
  '/user/updateAvatar': () => ({ success: true }),
  '/user/updatePreference': () => ({ success: true }),
  '/user/updateGuide': () => ({ success: true }),
  '/user/makeSureUserExist': () => ({ id: 'user-001' }),
}; 
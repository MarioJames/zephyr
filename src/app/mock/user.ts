export default {
  '/user/getUserRegistrationDuration': () => 100,
  '/user/getUserState': () => ({
    id: 'mock-user',
    username: 'mock',
    avatar: '',
    isOnboard: true,
    email: 'mock@mock.com',
    roles: ['user'],
  }),
  '/user/getUserSSOProviders': () => [],
  '/user/unlinkSSOProvider': () => ({ success: true }),
  '/user/updateUserSettings': () => ({ success: true }),
  '/user/resetUserSettings': () => ({ success: true }),
  '/user/updateAvatar': () => ({ success: true }),
  '/user/updatePreference': () => ({ success: true }),
  '/user/updateGuide': () => ({ success: true }),
  '/user/makeSureUserExist': () => ({ id: 'user-001' }),
}; 
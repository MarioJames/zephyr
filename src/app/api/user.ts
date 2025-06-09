import { request } from './index';

export const userApi = {
  getUserRegistrationDuration: () => request('/user/getUserRegistrationDuration', {}),
  getUserState: () => request('/user/getUserState', {}),
  getUserSSOProviders: () => request('/user/getUserSSOProviders', {}),
  unlinkSSOProvider: () => request('/user/unlinkSSOProvider', {}),
  updateUserSettings: (value: any) => request('/user/updateUserSettings', value),
  resetUserSettings: () => request('/user/resetUserSettings', {}),
  updateAvatar: (avatar: string) => request('/user/updateAvatar', { avatar }),
  updatePreference: (preference: any) => request('/user/updatePreference', { preference }),
  updateGuide: () => request('/user/updateGuide', {}),
  makeSureUserExist: () => request('/user/makeSureUserExist', {}),
}; 
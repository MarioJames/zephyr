import { request } from './index';
import userMock from '../mock/user';

export const userApi = {
  getUserRegistrationDuration: () =>
    userMock['/user/getUserRegistrationDuration']?.({}) || request('/user/getUserRegistrationDuration', {}),
  getUserState: () =>
    userMock['/user/getUserState']?.({}) || request('/user/getUserState', {}),
  getUserSSOProviders: () =>
    userMock['/user/getUserSSOProviders']?.({}) || request('/user/getUserSSOProviders', {}),
  unlinkSSOProvider: (data: any) =>
    userMock['/user/unlinkSSOProvider']?.(data) || request('/user/unlinkSSOProvider', data),
  updateUserSettings: (data: any) =>
    userMock['/user/updateUserSettings']?.(data) || request('/user/updateUserSettings', data),
  resetUserSettings: () =>
    userMock['/user/resetUserSettings']?.({}) || request('/user/resetUserSettings', {}),
  updateAvatar: (data: any) =>
    userMock['/user/updateAvatar']?.(data) || request('/user/updateAvatar', data),
  updatePreference: (data: any) =>
    userMock['/user/updatePreference']?.(data) || request('/user/updatePreference', data),
  updateGuide: (data: any) =>
    userMock['/user/updateGuide']?.(data) || request('/user/updateGuide', data),
  makeSureUserExist: () =>
    userMock['/user/makeSureUserExist']?.({}) || request('/user/makeSureUserExist', {}),
}; 
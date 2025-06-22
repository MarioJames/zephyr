import useSWR, { SWRResponse, mutate } from 'swr';
import { DeepPartial } from 'utility-types';
import type { StateCreator } from 'zustand/vanilla';

import { DEFAULT_PREFERENCE } from '@/const/base';
import { useOnlyFetchOnceSWR } from '@/libs/swr';
import { userApi } from '@/app/api/user';
import type { UserStore } from '@/store/user';
import type { GlobalServerConfig } from '@/types/serverConfig';
import { LobeUser, UserInitializationState } from '@/types/user';
import type { UserSettings } from '@/types/user/settings';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

import { preferenceSelectors } from '../preference/selectors';

const n = setNamespace('common');

const GET_USER_STATE_KEY = 'initUserState';
/**
 * 通用操作接口
 * 定义了用户相关的通用操作方法
 */
export interface CommonAction {
  /**
   * 刷新用户状态
   * 重新获取用户的所有状态数据
   */
  refreshUserState: () => Promise<void>;

  /**
   * 更新用户头像
   * @param avatar 新的头像URL
   */
  updateAvatar: (avatar: string) => Promise<void>;
  
  /**
   * 检查追踪状态Hook
   * @param shouldFetch 是否应该获取数据
   * @returns SWR响应对象
   */
  useCheckTrace: (shouldFetch: boolean) => SWRResponse;
  
  /**
   * 初始化用户状态Hook
   * @param isLogin 用户是否已登录
   * @param serverConfig 服务器配置
   * @param options 可选的回调选项
   * @param options.onSuccess 成功回调函数
   * @returns SWR响应对象
   */
  useInitUserState: (
    isLogin: boolean | undefined,
    serverConfig: GlobalServerConfig,
    options?: {
      onSuccess: (data: UserInitializationState) => void;
    },
  ) => SWRResponse;
}

/**
 * 创建通用操作slice的工厂函数
 * 返回包含所有通用操作的对象
 */
export const createCommonSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  CommonAction
> = (set, get) => ({
  /**
   * 刷新用户状态
   * 通过SWR的mutate函数重新获取用户状态数据
   */
  refreshUserState: async () => {
    await mutate(GET_USER_STATE_KEY);
  },
  
  /**
   * 更新用户头像
   * 先更新服务端数据，然后刷新用户状态
   */
  updateAvatar: async (avatar) => {
    // 1. 更新服务端/数据库中的头像
    await userApi.updateAvatar(avatar);

    // 2. 刷新用户状态以获取最新数据
    await get().refreshUserState();
  },

  /**
   * 检查追踪状态Hook
   * 检查用户是否允许启用追踪功能
   */
  useCheckTrace: (shouldFetch) =>
    useSWR<boolean>(
      shouldFetch ? 'checkTrace' : null, // 只在需要时获取
      () => {
        const userAllowTrace = preferenceSelectors.userAllowTrace(get());

        // 如果用户已经设置了追踪偏好，返回false（不需要显示引导）
        if (typeof userAllowTrace === 'boolean') return Promise.resolve(false);

        // 否则返回用户是否可以启用追踪
        return Promise.resolve(get().isUserCanEnableTrace);
      },
      {
        revalidateOnFocus: false, // 聚焦时不重新验证
      },
    ),

  /**
   * 初始化用户状态Hook
   * 获取并初始化用户的所有状态数据
   */
  useInitUserState: (isLogin, serverConfig, options) =>
    useOnlyFetchOnceSWR<UserInitializationState>(
      !!isLogin ? GET_USER_STATE_KEY : null, // 只在登录时获取
      () => userApi.getUserState(), // 获取用户状态
      {
        onSuccess: (data) => {
          // 执行成功回调
          options?.onSuccess?.(data);

          if (data) {
            // 合并服务器设置
            const serverSettings: DeepPartial<UserSettings> = {
              defaultAgent: serverConfig.defaultAgent, // 默认代理
              languageModel: serverConfig.languageModel, // 语言模型
              systemAgent: serverConfig.systemAgent, // 系统代理
            };

            // 将服务器设置合并到默认设置中
            const defaultSettings = merge(get().defaultSettings, serverSettings);

            // 合并偏好设置
            const isEmpty = Object.keys(data.preference || {}).length === 0;
            const preference = isEmpty ? DEFAULT_PREFERENCE : data.preference;

            // 如果有头像或用户ID（来自客户端数据库），更新到用户信息中
            const user =
              data.avatar || data.userId
                ? merge(get().user, {
                    avatar: data.avatar, // 头像
                    email: data.email, // 邮箱
                    firstName: data.firstName, // 名
                    fullName: data.fullName, // 全名
                    id: data.userId, // 用户ID
                    latestName: data.lastName, // 姓
                    username: data.username, // 用户名
                  } as LobeUser)
                : get().user;

            // 更新所有相关状态
            set(
              {
                defaultSettings, // 默认设置
                isOnboard: data.isOnboard, // 是否完成引导
                isShowPWAGuide: data.canEnablePWAGuide, // 是否显示PWA引导
                isUserCanEnableTrace: data.canEnableTrace, // 是否可以启用追踪
                isUserHasConversation: data.hasConversation, // 是否有对话记录
                isUserStateInit: true, // 标记用户状态已初始化
                preference, // 偏好设置
                serverLanguageModel: serverConfig.languageModel, // 服务器语言模型
                settings: data.settings || {}, // 用户设置
                user, // 用户信息
              },
              false,
              n('initUserState'),
            );

            // 刷新默认模型提供商列表
            get().refreshDefaultModelProviderList({ trigger: 'fetchUserState' });
          }
        },
      },
    ),
});

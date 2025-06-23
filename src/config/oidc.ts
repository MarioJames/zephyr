'use client';

import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';

// 启用 OIDC 客户端调试日志
Log.setLogger(console);
Log.setLevel(Log.DEBUG);

// OIDC 配置接口
export interface OIDCConfig {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  response_type: string;
  scope: string;
  // 自动静默续期配置
  automaticSilentRenew: boolean;
  silentRequestTimeout: number;
  silent_redirect_uri: string;
  // Token 生命周期配置
  accessTokenExpiringNotificationTime: number;
  // PKCE 配置
  loadUserInfo: boolean;
  // Subject 验证配置
  validateSubOnUserInfoRequestFailure?: boolean;
  // 兼容性配置
  clockSkew?: number;
  staleStateAge?: number;
  // 元数据配置
  metadata?: {
    authorization_endpoint: string;
    token_endpoint: string;
    end_session_endpoint: string;
    jwks_uri: string;
  };
  metadataUrl?: string;
}

// 获取环境配置
const getOIDCConfig = (): OIDCConfig => {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';
  const authority =
    process.env.NEXT_PUBLIC_OIDC_AUTHORITY || 'http://localhost:3010';

  return {
    authority,
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || 'zephyr',
    redirect_uri: `${baseUrl}/auth/callback`,
    post_logout_redirect_uri: baseUrl,
    silent_redirect_uri: `${baseUrl}/auth/silent-callback`,
    response_type: 'code',
    scope: 'openid profile email offline_access sync:read sync:write',

    // 自动静默续期配置
    automaticSilentRenew: true,
    silentRequestTimeout: 10000,

    // Token 过期前60秒开始尝试续期
    accessTokenExpiringNotificationTime: 60,

    // 禁用 OIDC UserInfo（使用独立的业务用户信息端点）
    loadUserInfo: false,

    // 兼容性配置
    validateSubOnUserInfoRequestFailure: false,
    clockSkew: 300,
    staleStateAge: 900,

    // 手动配置端点
    metadata: {
      authorization_endpoint: `${authority}/oidc/auth`,
      token_endpoint: `${authority}/oidc/token`,
      end_session_endpoint: `${authority}/oidc/logout`,
      jwks_uri: `${authority}/oidc/jwks`,
    },
  };
};

const oidcConfig = getOIDCConfig();

let userManager: UserManager | null = null;

if (typeof window !== 'undefined') {
  userManager = new UserManager({
    ...oidcConfig,
    userStore: new WebStorageStateStore({
      store: window.localStorage,
      prefix: 'oidc.',
    }),
    filterProtocolClaims: false,
  });

  // 基础事件监听
  userManager.events.addUserLoaded((user) => {
    console.log('OIDC: User loaded', user.profile);
  });

  userManager.events.addUserUnloaded(() => {
    console.log('OIDC: User unloaded');
  });

  userManager.events.addAccessTokenExpiring(() => {
    console.log('OIDC: Access token expiring');
  });

  userManager.events.addAccessTokenExpired(() => {
    console.log('OIDC: Access token expired');
  });

  userManager.events.addSilentRenewError((err) => {
    console.error('OIDC: Silent renew error', err);
  });

  userManager.events.addUserSignedOut(() => {
    console.log('OIDC: User signed out');
  });
}

export { userManager, oidcConfig };
export default oidcConfig;

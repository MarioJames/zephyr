import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// OIDC 环境变量配置
export const oidcEnv = createEnv({
  server: {
    // NextAuth 配置
    NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
    NEXTAUTH_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_OIDC_CLIENT_ID: z.string().optional(),
    NEXT_PUBLIC_LOBE_HOST: z.string().optional(),
    NEXT_PUBLIC_ZEPHYR_URL: z.string().optional(),
  },
  runtimeEnv: {
    // zephyr 环境变量
    NEXT_PUBLIC_ZEPHYR_URL: process.env.NEXT_PUBLIC_ZEPHYR_URL,

    // NextAuth 环境变量
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    // OIDC 环境变量
    NEXT_PUBLIC_OIDC_CLIENT_ID:
      process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || 'zephyr',
    NEXT_PUBLIC_LOBE_HOST: process.env.NEXT_PUBLIC_LOBE_HOST,
  },
});

// OIDC 配置接口
export interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret?: string;
  wellKnown: string;
  scope: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
}

// 获取 OIDC 配置
export const getOIDCConfig = (): OIDCConfig => {
  const lobeHost = oidcEnv.NEXT_PUBLIC_LOBE_HOST || '';
  const zephyrUrl = oidcEnv.NEXT_PUBLIC_ZEPHYR_URL || 'http://localhost:3000';
  const issuer = lobeHost ? `${lobeHost}/oidc` : '';

  return {
    issuer,
    clientId: oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_ID || 'zephyr',
    wellKnown: issuer ? `${issuer}/.well-known/openid_configuration` : '',
    scope: 'openid profile email offline_access sync:read sync:write',
    redirectUri: `${zephyrUrl}/api/auth/callback/oidc`,
    postLogoutRedirectUri: zephyrUrl,
  };
};

// 导出配置实例
export const oidcConfig = getOIDCConfig();

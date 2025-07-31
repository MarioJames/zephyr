import { createEnv } from '@t3-oss/env-nextjs';
import { Provider } from 'next-auth/providers';
import { z } from 'zod';

// OIDC 环境变量配置

function getOidcEnv() {
  return createEnv({
    client: {
      NEXT_PUBLIC_LOBE_HOST: z.string().optional(),
      NEXT_PUBLIC_ZEPHYR_URL: z.string().optional(),
      NEXT_PUBLIC_OIDC_CLIENT_ID: z.string().optional(),
      NEXT_PUBLIC_OIDC_CLIENT_SECRET: z.string().optional(),
    },
    runtimeEnv: {
      // zephyr 环境变量
      NEXT_PUBLIC_ZEPHYR_URL: process.env.NEXT_PUBLIC_ZEPHYR_URL,

      // OIDC Provider 环境变量
      NEXT_PUBLIC_LOBE_HOST: process.env.NEXT_PUBLIC_LOBE_HOST,
      NEXT_PUBLIC_OIDC_CLIENT_ID:
        process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || 'zephyr',
      NEXT_PUBLIC_OIDC_CLIENT_SECRET:
        process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET || 'zephyr-secret',
    },
  });
}

export const oidcEnv = getOidcEnv();

// 获取 OIDC 配置
export const getProviderConfig = (): Provider => {
  const lobeHost = oidcEnv.NEXT_PUBLIC_LOBE_HOST;
  const zephyrUrl = oidcEnv.NEXT_PUBLIC_ZEPHYR_URL;
  const issuer = `${lobeHost}/oidc`;

  return {
    id: 'oidc',
    name: 'Lobe Hub',
    type: 'oauth',
    issuer,
    clientId: oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_ID,
    clientSecret: oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_SECRET,
    authorization: {
      url: `${issuer}/oidc/auth`,
      params: {
        scope: 'openid profile email',
      },
    },
    token: `${zephyrUrl}/oidc/token`,
    userinfo: {
      url: `${zephyrUrl}/api/v1/users/me`,
      request: () => ({}),
    },
  };
};

export const providerConfig = getProviderConfig();

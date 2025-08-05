import { createEnv } from '@t3-oss/env-nextjs';
import { Provider } from 'next-auth/providers';
import { z } from 'zod';

// OIDC 环境变量配置
function getOidcEnv() {
  return createEnv({
    client: {
      NEXT_PUBLIC_OIDC_ISSUER: z.string().optional(),
      NEXT_PUBLIC_OIDC_CLIENT_ID: z.string().optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_OIDC_ISSUER: process.env.NEXT_PUBLIC_OIDC_ISSUER,
      NEXT_PUBLIC_OIDC_CLIENT_ID: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
    },
  });
}

export const oidcEnv = getOidcEnv();

// 获取 OIDC 配置
export const getProviderConfig = (): Provider => {
  const issuer = oidcEnv.NEXT_PUBLIC_OIDC_ISSUER;

  return {
    id: 'lobe',
    name: 'Lobe Hub',
    type: 'oauth',
    issuer,
    clientId: oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_ID,
    authorization: {
      url: `${issuer}/auth`,
      params: {
        scope: 'profile offline_access',
        response_type: 'code',
        resource: 'urn:lobehub:chat',
      },
    },
    token: `${issuer}/token`,
    userinfo: {
      request: () => ({}),
    },
    client: {
      token_endpoint_auth_method: 'none',
    },
  };
};

export const providerConfig = getProviderConfig();

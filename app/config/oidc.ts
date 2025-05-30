'use client';

import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const oidcConfig = {
  authority: 'http://localhost:3010',
  client_id: 'lobehub-desktop',
  redirect_uri: 'http://localhost:3000/auth/callback',
  response_type: 'code',
  scope: 'openid profile email offline_access sync:read sync:write',
  post_logout_redirect_uri: 'http://localhost:3000',
  metadata: {
    authorization_endpoint: 'http://localhost:3010/oidc/auth',
    token_endpoint: 'http://localhost:3010/oidc/token',
    userinfo_endpoint: 'http://localhost:3010/oidc/userinfo',
    end_session_endpoint: 'http://localhost:3010/oidc/logout',
    jwks_uri: 'http://localhost:3010/oidc/jwks',
  },
  metadataUrl: undefined, // 禁用自动发现
};

let userManager: UserManager | null = null;

if (typeof window !== 'undefined') {
  userManager = new UserManager({
    ...oidcConfig,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  });
}

export { userManager };
export default oidcConfig;

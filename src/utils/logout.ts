// Reusable helpers for OIDC RP-Initiated Logout
// - Fetch discovery document
// - Revoke tokens
// - Build end_session URL

import { oidcEnv } from '@/env/oidc';

type Discovery = {
  end_session_endpoint?: string;
  revocation_endpoint?: string;
};

export async function fetchDiscovery(issuer: string): Promise<Discovery> {
  return {
    end_session_endpoint: `${issuer}/session/end`,
    revocation_endpoint: `${issuer}/token/revocation`,
  };
}

export async function revokeToken(opts: {
  revocationEndpoint: string;
  clientId: string;
  token: string;
  tokenTypeHint?: 'refresh_token' | 'access_token';
}): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      client_id: opts.clientId,
      token: opts.token,
    });
    if (opts.tokenTypeHint) body.set('token_type_hint', opts.tokenTypeHint);

    const res = await fetch(opts.revocationEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    // RFC 7009: successful response MAY be 200 even if token is invalid/expired
    return res.ok;
  } catch {
    // Do not block logout on revocation errors
    return false;
  }
}

export function buildEndSessionUrl(opts: {
  endSessionEndpoint: string;
  idTokenHint?: string;
  postLogoutRedirectUri: string;
  state?: string;
}): string {
  const url = new URL(opts.endSessionEndpoint);
  url.searchParams.set('client_id', oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_ID!);
  if (opts.idTokenHint) url.searchParams.set('id_token_hint', opts.idTokenHint);
  url.searchParams.set('post_logout_redirect_uri', opts.postLogoutRedirectUri);
  if (opts.state) url.searchParams.set('state', opts.state);
  return url.toString();
}

/**
 * 触发标准 OIDC RP‑Initiated Logout 流程
 * 跳转到服务端路由 /auth/logout（将发现端点、可选撤销、end_session 重定向封装在服务端）
 */
export const logout = async () => {
  try {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/logout';
    }
  } catch (error) {
    console.error('[Logout] 退出登录失败:', error);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

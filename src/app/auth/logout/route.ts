import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';
import {
  buildEndSessionUrl,
  fetchDiscovery,
  revokeToken,
} from '@/utils/logout';
import { oidcEnv } from '@/env/oidc';

export async function GET() {
  const session = await auth();
  if (!session) {
    return new NextResponse('Session not found', { status: 401 });
  }

  const issuer = oidcEnv.NEXT_PUBLIC_OIDC_ISSUER;
  if (!issuer) {
    return new NextResponse('OIDC issuer not configured', { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  if (!appUrl) {
    return new NextResponse('App URL not configured', { status: 500 });
  }

  const discovery = await fetchDiscovery(issuer);
  if (!discovery?.end_session_endpoint) {
    return new NextResponse('end_session_endpoint not available', {
      status: 500,
    });
  }

  // revoke refresh_token before ending session (non-blocking)
  const clientId = oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_ID;
  const refreshToken = (session as any)?.refreshToken as string | undefined;
  if (refreshToken && discovery.revocation_endpoint && clientId) {
    // Fire and forget, do not block RP-initiated logout on revocation
    await revokeToken({
      revocationEndpoint: discovery.revocation_endpoint,
      clientId,
      token: refreshToken,
      tokenTypeHint: 'refresh_token',
    });
  }

  const state = crypto.randomUUID();
  const postLogout = new URL('/auth/logout/callback', appUrl).toString();
  const idToken = (session as any)?.idToken as string | undefined;

  const redirectUrl = buildEndSessionUrl({
    endSessionEndpoint: discovery.end_session_endpoint!,
    idTokenHint: idToken,
    postLogoutRedirectUri: postLogout,
    state,
  });

  const res = NextResponse.redirect(redirectUrl);
  // Store state in httpOnly cookie for CSRF protection (short TTL)
  res.cookies.set({
    name: 'logout_state',
    value: state,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 5, // 5 minutes
  });
  return res;
}

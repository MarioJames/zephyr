import NextAuth from 'next-auth';
import { providerConfig } from '@/env/oidc';
import { oidcEnv } from '@/env/oidc';
import { NextResponse } from 'next/server';

// 直接跳转到 /login 页面触发刷新
async function refreshAccessToken() {
  const url = new URL(oidcEnv.NEXT_PUBLIC_ZEPHYR_URL!);

  url.searchParams.set('callbackUrl', window.location.href);

  NextResponse.redirect(url.toString());

  return {};
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [providerConfig],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // 初次登录
        return {
          ...token,
          accessToken: account.access_token,
          bearerToken: account.id_token,
          accessTokenExpires: Date.now() + (account.expires_in ?? 0) * 1000,
        };
      }

      // 检查是否需要刷新
      if (Date.now() < (token as any).accessTokenExpires) {
        return token;
      }

      // 自动调用刷新函数
      refreshAccessToken();

      return {};
    },
    async session({ session, token }) {
      (session as any).bearerToken = token.bearerToken;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // 处理重定向逻辑
      // 如果 URL 是相对路径，则基于 baseUrl 构建完整 URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // 如果 URL 是外部链接，则重定向到首页
      else if (new URL(url).origin !== baseUrl) {
        return baseUrl;
      }
      return url;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

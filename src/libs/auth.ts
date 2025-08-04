import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { providerConfig, oidcEnv } from '@/env/oidc';

// 扩展 JWT 类型定义
interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
}

// 使用 refresh_token 刷新 access_token
async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const lobeHost = oidcEnv.NEXT_PUBLIC_LOBE_HOST;
    const tokenEndpoint = `${lobeHost}/oidc/token`;

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
        client_id: oidcEnv.NEXT_PUBLIC_OIDC_CLIENT_ID || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const refreshedTokens = await response.json();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires:
        Date.now() + (refreshedTokens.expires_in ?? 90_000) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);

    // 刷新失败，返回错误标记，触发重新登录
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
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
      // 初次登录，存储所有必要的 token 信息
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + (account.expires_in ?? 90_000) * 1000,
        };
      }

      // 检查 token 是否有错误（刷新失败）
      if ((token as any).error) {
        return { ...token };
      }

      // 检查是否需要刷新 token
      if (Date.now() < (token as any).accessTokenExpires) {
        return token;
      }

      // 调用刷新函数
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // 如果 token 刷新失败，标记 session 错误
      if ((token as any).error) {
        (session as any).error = (token as any).error;
      }

      // 传递 access token 给 session
      (session as any).accessToken = (token as any).accessToken;
      (session as any).error = (token as any).error;

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

// 工具函数：检查用户是否需要重新登录
export const shouldReLogin = (session: any) => {
  return session?.error === 'RefreshAccessTokenError';
};

// 工具函数：获取有效的 access token
export const getValidAccessToken = (session: any) => {
  if (shouldReLogin(session)) {
    return null;
  }
  return session?.accessToken;
};

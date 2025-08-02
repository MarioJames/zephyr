import NextAuth from 'next-auth';
import { providerConfig } from '@/env/oidc';

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
      // 登录时，将 OIDC provider 返回的 access_token 和 id_token 保存到 JWT 中
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      return token;
    },
    async session({ session, token }) {
      // 将 JWT 中的数据扩展到客户端可访问的 session 对象中
      // 注意：不要将敏感信息（如 secret）暴露给客户端
      if (session.user) {
        session.user.id = token.sub!; // 确保 session 中有 user.id
      }
      (session as any).accessToken = token.accessToken;
      (session as any).idToken = token.idToken;

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

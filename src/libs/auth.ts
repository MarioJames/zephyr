import NextAuth from 'next-auth';
import { providerConfig } from '@/env/oidc';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [providerConfig],
  session: {
    strategy: 'jwt',
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
  },
  debug: process.env.NODE_ENV === 'development',
});

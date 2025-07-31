import NextAuth from 'next-auth';

interface Tokens {
  id_token: string;
  expires_in: number;
  access_token: string;
  token_type: 'bearer';
  scope: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: 'oidc',
      name: 'Lobe Hub',
      type: 'oauth',
      clientId: 'zephyr',
      clientSecret: 'zephyr-secret',
      issuer: 'http://localhost:3010/oidc',
      authorization: {
        url: 'http://localhost:3010/oidc/auth',
        params: {
          scope: 'openid profile email',
          resource: 'urn:lobehub:chat',
          response_type: 'code',
        },
      },
      token: 'http://localhost:3010/oidc/token',
      userinfo: {
        url: 'http://localhost:3010/api/v1/users/me',
        async request({ tokens }: { tokens: Tokens }) {
          console.log(tokens, 'tokens');

          const response = await fetch(
            'http://localhost:3010/api/v1/users/me',
            {
              headers: {
                Authorization: `Bearer ${tokens.id_token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const data = (await response.json()) as { data: any };

          return data.data;
        },
      },
    },
  ],
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

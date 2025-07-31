import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 排除不需要认证的路径
  const publicPaths = ['/api/auth', '/oidc', '/oauth', '/login'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 检查用户认证状态
  if (!req.auth) {
    // 未认证用户重定向到登录页面
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

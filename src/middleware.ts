import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 仅用于日志记录，不做认证拦截
  console.log('Middleware: Request to', request.nextUrl.pathname);
  
  // 直接放行所有请求，让客户端处理认证
  return NextResponse.next();
}

// 配置 middleware 匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 其他静态资源
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';

/**
 * 清除所有认证相关的cookie和session
 * @route DELETE /api/auth/logout
 */
export async function DELETE() {
  
  try {
    // 需要清除的cookie列表
    const cookiesToClear = [
      // NextAuth相关cookie
      'authjs.session-token',
      'authjs.csrf-token',
      'authjs.callback-url',
      'authjs.pkce.code_verifier',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      '__Secure-authjs.session-token',
      '__Secure-next-auth.session-token',
      
      // 应用相关cookie
      'zephyr-session',
      'theme-mode',
      'user-preferences',
      
      // JWT相关
      'next-auth.jwt',
      '__Secure-next-auth.jwt',
      'authjs.jwt',
      '__Secure-authjs.jwt'
    ];


    // 创建一个响应对象来设置cookie
    const response = new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: '所有认证信息已成功清除' 
      })
    );

    // 遍历并删除所有cookie
    let clearedCookies = 0;
    let failedCookies = 0;
    
    for (const cookieName of cookiesToClear) {
      try {
        // 设置cookie为过期
        response.cookies.set({
          name: cookieName,
          value: '',
          expires: new Date(0),
          path: '/'
        });

        // 同时尝试设置secure版本
        response.cookies.set({
          name: cookieName,
          value: '',
          expires: new Date(0),
          path: '/',
          secure: true
        });
        
        clearedCookies += 2; // 普通版本和secure版本
      } catch (cookieError) {
        console.error(`[Logout API] 清除cookie ${cookieName} 时出错:`, {
          error: cookieError,
          stack: cookieError instanceof Error ? cookieError.stack : undefined
        });
        failedCookies++;
      }
    }

    console.log(`[Logout API] Cookie清除统计: 成功=${clearedCookies}, 失败=${failedCookies}`);

    // 获取并清除session
    try {
      const session = await auth();
      
      if (session) {
        // 设置session相关cookie为过期
        response.cookies.set({
          name: 'next-auth.session-token',
          value: '',
          expires: new Date(0),
          path: '/'
        });
        response.cookies.set({
          name: 'authjs.session-token',
          value: '',
          expires: new Date(0),
          path: '/'
        });
      }
    } catch (sessionError) {
      console.error('[Logout API] 清除session时出错:', {
        error: sessionError,
        stack: sessionError instanceof Error ? sessionError.stack : undefined
      });
    }

    // 设置响应头，确保cookie被正确处理
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    // 详细记录错误信息
    console.error('[Logout API] 清除认证信息失败:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : String(error)
    });

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '清除认证信息失败',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
} 
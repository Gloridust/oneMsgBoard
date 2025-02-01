import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// 不需要认证的路径
const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 检查认证令牌
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 验证令牌
    verifyToken(token);
    return NextResponse.next();
  } catch {
    // 令牌无效，重定向到登录页面
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api 路由 (这些路由有自己的认证处理)
     * - 静态文件 (._next/static, favicon.ico 等)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 
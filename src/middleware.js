import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();

  // 为服务器组件和API路由创建一个Supabase客户端
  // 用于在用户访问受保护的路由时刷新过期的会话cookie
  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();

  return res;
}

// 确保中间件只在需要的路由上运行
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// export { default } from "next-auth/middleware"
// import { getToken } from "next-auth/jwt"
 
// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     const token = await getToken({req: request});
//     //fetchinh the current url to know whether middleware is require/not
//     const url = request.nextUrl

//     //redirection strategy based on token/not there
//     if(token && (
//         url.pathname.startsWith('/sign-in') ||
//         url.pathname.startsWith('/sign-up') || 
//         url.pathname.startsWith('/verify') ||
//         url.pathname.startsWith('/')
//     )){
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//     }
//   return NextResponse.redirect(new URL('/home', request.url))
// }
 
// // config actually defines where do u want your middlewares to run
// export const config = {
//   matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*']
// }



import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
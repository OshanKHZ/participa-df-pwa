import NextAuth from 'next-auth'

export const { auth } = NextAuth({
  providers: [],
})

export default auth(req => {
  if (!req.auth && req.nextUrl.pathname !== '/') {
    // const newUrl = new URL('/api/auth/signin', req.nextUrl.origin);
    // return Response.redirect(newUrl);
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

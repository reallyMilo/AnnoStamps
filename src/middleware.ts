import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|tmp|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes('---') &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`
  }

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`
  console.log(path)
  // rewrites for app pages
  console.log(hostname)

  if (path === '/auth/signin') {
    return NextResponse.rewrite(new URL(`${path}`, req.url))
  }
  if (hostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log(
      // NextResponse.rewrite(
      //   new URL(`/${path === '/' ? '' : `117${path}`}`, req.url),
      // ),

      new URL(`${path}`, req.url),
    )
    return NextResponse.rewrite(
      new URL(`/${path === '/' ? '' : `117${path}`}`, req.url),
    )
  }

  // special case for `vercel.pub` domain
  if (hostname === 'vercel.pub') {
    return NextResponse.redirect(
      'https://vercel.com/blog/platforms-starter-kit',
    )
  }

  // rewrite for auth

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
}

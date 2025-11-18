import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: [
    "/media/return",
    "/media/create",
    "/media/inventory",
    "/media/edit/:path*",
    "/user/create",
    "/rentedmedia/create",
  ],
}

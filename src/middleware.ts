import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SEC as string

const protectedRoutes = ["/a/home", "/s/home", "/"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/sigin", req.url))
    }
    try {
      jwt.verify(token, JWT_SECRET) 
      return NextResponse.next() 
    } catch (err) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/a/home", "/s/home"],
}

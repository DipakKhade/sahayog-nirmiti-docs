import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import * as jose from "jose"
import { USER_TYPE } from "./generated/prisma"

// const JWT_SECRET = process.env.JWT_SEC as string
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SEC)

const protectedRoutes = ["/a/home", "/s/home", "/"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  if (!token && pathname === "/signin") {
    return NextResponse.next()
  } else if(token && pathname === "/signin") {
    const data = await jose.jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    })
    if (data.payload) {
        if(data.payload.user_type === USER_TYPE.SUPPLIER){
          return NextResponse.redirect(new URL("/s/home", req.url))
        } else if(data.payload.user_type === USER_TYPE.ADMIN)
          return NextResponse.redirect(new URL("/a/home", req.url))
        {
      }
      // return NextResponse.next()
    } else {
      return NextResponse.next()
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url))
    }

    try {
      const data = await jose.jwtVerify(token, JWT_SECRET, {
        algorithms: ["HS256"],
      })
      const userId = data.payload.user_id as string
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set("user_id", userId) 
      if (data.payload) {
        if (
          (pathname === "/" || pathname === "/signin") &&
          data.payload.user_type === USER_TYPE.SUPPLIER
        ) {
          return NextResponse.redirect(new URL("/s/home", req.url))
        } else if (
          (pathname === "/" || pathname === "/signin") &&
          data.payload.user_type === USER_TYPE.ADMIN
        ) {
          return NextResponse.redirect(new URL("/a/home", req.url))
        }
        return NextResponse.next({
          request : {
            headers: requestHeaders
          }
        })
      }
    } catch (err) {
      console.log("JWT error", err)
      // Clear cookie and send to signin
      const response = NextResponse.redirect(new URL("/signin", req.url))
      response.cookies.set("token", "", { path: "/", expires: new Date(0) })
      return response
    }
  }

  return NextResponse.next()
}


export const config = {
  matcher: ["/", "/a/home", "/s/home", "/signin"],
  // matcher:[]
}

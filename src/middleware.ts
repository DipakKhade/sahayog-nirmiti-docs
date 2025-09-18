import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import * as jose from "jose"
import { USER_TYPE } from "./generated/prisma"

// const JWT_SECRET = process.env.JWT_SEC as string
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SEC)

const protectedRoutes = ["/a/home", "/s/home", "/"]

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl

//   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//     const token = req.cookies.get("token")?.value
//     if (!token) {
//       return NextResponse.redirect(new URL("/signin", req.url))
//     }
//     try {
//       const data = await jose.jwtVerify(token, JWT_SECRET, {
//         algorithms:['HS256']
//       });

//       if(data.payload){

//         console.log('payload ---', data.payload)

//         // if(pathname !== 'signin'){
//           if((pathname === '/'  ) && data.payload.user_type === USER_TYPE.SUPPLIER){
//             return NextResponse.redirect(new URL("/s/home", req.url)) 
//           } else if (pathname === '/' && data.payload.user_type === USER_TYPE.ADMIN) {
//             return NextResponse.redirect(new URL("/a/home", req.url))
//           }
//           return NextResponse.next() 
//         // } else {
          
//         // }


//       } else {
//         if(data.payload) {

//         }
//         return NextResponse.redirect(new URL("/signin", req.url))
//       }
//     } catch (err) {
//       console.log(err)
//       return NextResponse.redirect(new URL("/", req.url))
//     }
//   } else {

//   }

//   return NextResponse.next()
// }

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
      console.log('i am here')
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
        return NextResponse.next()
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

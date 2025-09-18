import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
    const { username, password: user_password } = await req.json();

    if(!username || !user_password) {
        return NextResponse.json({
            success: false,
            message: "insufficient parameters"
        })
    }

    const user = await prisma.user.findFirst({
        where:{
            username
        }, 
        select: {
            username: true,
            password: true,
            type:true,
            vendorCode: true
        }
    })

    if(user_password !== user?.password || !user) {
        return NextResponse.json({
            success: false,
            message: "invalid credentionals"
        })
    }

    const token = jwt.sign({username, user_type: user.type, vendor_code: user.vendorCode ?? 0, }, process.env.JWT_SEC!, {
        algorithm:'HS256'
    })

    
    let res =  NextResponse.json({
        success: true,
        message: "Sign in successful",
        user_type: user.type,
        token
    })

    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    })
    return res

}
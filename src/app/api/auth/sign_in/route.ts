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
            vendorCode: true
        }
    })
    console.log(user)
    if(user_password !== user?.password || !user) {
        return NextResponse.json({
            success: false,
            message: "invalid cred"
        })
    }

    const token = jwt.sign({username,vendor_code: user.vendorCode}, process.env.JWT_SEC!)

    
    return NextResponse.json({
        success: true,
        message: "Sign in successful",
        token
    })

}
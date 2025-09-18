import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let page = req.nextUrl.searchParams.get('page');

    if(!page) {
        return NextResponse.json({
            sccess: false,
            message:"page count not found"
        })
    }

    try {
        const data = await prisma.document.findMany({
            include : {
                user: {
                    select: {
                        username: true,
                        vendorCode: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: "data retrived successfully",
            data
        })
    } catch(err){
        console.log(err)
        return NextResponse.json({
            sccess: false,
            message:"data retrivial failed"
        })
    }
}
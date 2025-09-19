import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({ success: true })
        response.cookies.set("token", "", { path: "/", expires: new Date(0) })
        return response
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "sign out failed"
        })
    }
} 
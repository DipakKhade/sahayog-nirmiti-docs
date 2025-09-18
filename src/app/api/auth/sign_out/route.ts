import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
    console.log('in sign out route')
    const response = NextResponse.json({ success: true })
    response.cookies.set("token", "", { path: "/", expires: new Date(0) })
    return response
} 
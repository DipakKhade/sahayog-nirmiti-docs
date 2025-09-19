import { NextRequest, NextResponse } from "next/server"
import { getPresignedUrls } from "@/lib/s3"

export async function GET(req: NextRequest) {
    try {
        const bucketKey = req.nextUrl.searchParams.get('bucketKey')

        if(!bucketKey) {
            return NextResponse.json({
                success: false,
                message: "key not found"
            })
        }

        const urls = await getPresignedUrls(bucketKey)

        return NextResponse.json({ 
            success: true,
            urls
         })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "error occured"
        })
    }
}

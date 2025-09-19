import { perPageRows } from "@/lib/config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { subMonths } from "date-fns"

export async function GET(req: NextRequest) {
    let page = req.nextUrl.searchParams.get('page');

    if(!page) {
        return NextResponse.json({
            sccess: false,
            message:"page count not found"
        })
    }

    try {

        const data = await prisma.$transaction(async tx => {
            const data = await tx.document.findMany({
                include : {
                    user: {
                        select: {
                            // username: true,
                            vendorCode: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    user: {
                        vendorCode: "asc"
                    }
                },
                skip:(+page - 1) * perPageRows,
                take: perPageRows,
                where: {
                    createdAt : {
                        gte: subMonths(new Date(), 8)
                    }
                }
            })


            const total_docs  = Math.ceil((await tx.document.count())/perPageRows);

            const total_pages = total_docs  
            const pagination_data = {
                totalPages: total_pages,
                hasNext: +page < total_pages,
                hasPrev: +page > 1,
                totalCount: await tx.document.count()
            }

            return {data, pagination_data}

        })
       


        return NextResponse.json({
            success: true,
            message: "data retrived successfully",
            data: data.data,
            pagination_data: data.pagination_data
        })
    } catch(err){
        console.log(err)
        return NextResponse.json({
            sccess: false,
            message:"data retrivial failed"
        })
    }
}
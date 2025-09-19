import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 } from 'uuid';
import { uploadFilesToS3 } from "@/lib/s3";
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const invoiceNo = formData.get("invoiceNo") as string;
    const purchaseOrderNo = formData.get("purchaseOrderNo") as string;
    const partNo = formData.get("partNo") as string;
    const partName = formData.get("partName") as string;
    const documentType = formData.get("documentType") as string;

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if(!token) {
        return NextResponse.json({
            success: false,
            message:"unAuthorized"
        })
    }
    const payload = jwt.verify(token, process.env.JWT_SEC!) as {user_id: any}
    const userId = payload.user_id

    if (!file || !invoiceNo || !purchaseOrderNo || !partName || !partNo || !documentType) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
        const dirKey = v4();
        const uploadDir = path.join(process.cwd(), `uploads/${dirKey}`);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        
        const filePath = path.join(uploadDir, file.name);
        console.log('filePath', filePath)
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        fs.writeFileSync(filePath, buffer);

        const is_files_uploaded = await uploadFilesToS3([filePath]);

        if(!is_files_uploaded){
            return NextResponse.json({ success: false });
        }

        const r =  prisma.$transaction(async tx => {
            await tx.document.create({
                data :{
                    documentType,
                    invoiceNo,
                    partName,
                    partNo,
                    purchaseOrderNo,
                    userId,
                    bucketKey: dirKey
                }
            })
        })

        return NextResponse.json({ success: true, fileName: file.name });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ success: false });
    }

}
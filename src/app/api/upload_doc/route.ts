import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 } from 'uuid';
import { uploadFilesToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
        const uploadDir = path.join(process.cwd(), `uploads/ ${v4()}`);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        
        const filePath = path.join(uploadDir, file.name);
        console.log('filePath', filePath)
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        fs.writeFileSync(filePath, buffer);
        
        await uploadFilesToS3([filePath]);

        return NextResponse.json({ success: true, fileName: file.name });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ success: false });
    }



}
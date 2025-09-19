import aws from 'aws-sdk'
import path from 'path'
import { bucketName } from './config';
import fs from 'fs'


aws.config.update({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new aws.S3();

export const uploadFilesToS3 = async (filePaths: string[]): Promise<boolean> =>{
    try {
    const id = path.basename(path.dirname(filePaths[0]));
    const uploadPromises = filePaths
        .filter(filePath => fs.statSync(filePath).isFile()) 
        .map(filePath => {
            const fileStream = fs.createReadStream(filePath);
            const relativePath = path.relative(path.dirname(filePaths[0]), filePath);
            const s3Key = path.join(id, relativePath); 

            return s3.upload({
                Bucket: bucketName,
                Key: s3Key.replace(/\\/g, '/'),
                Body: fileStream,
            }).promise();
        });
        await Promise.all(uploadPromises);
        return true;
    } catch (error) {
        return false;
    }
}

export const getPresignedUrls = async(folder: string, expiresIn = 3600) => {
    try {
        const prefix = folder.endsWith("/") ? folder : folder + "/"
        const listedObjects = await s3
        .listObjectsV2({
            Bucket: bucketName,
            Prefix: prefix,
        })
        .promise()
        
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            return []
        }
        
        const urls = listedObjects.Contents.filter(obj => obj.Key && !obj.Key.endsWith("/"))
        .map(obj => {
            const url = s3.getSignedUrl("getObject", {
                Bucket: bucketName,
                Key: obj.Key!,
                Expires: expiresIn, 
            })
            return { key: obj.Key!, url }
        })
        
        return urls
    } catch (error) {
        throw error
    }
  }
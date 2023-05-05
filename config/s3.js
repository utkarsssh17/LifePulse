import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
    apiVersion: '2006-03-01',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    region: process.env.AWS_REGION,
    ACL: 'public-read',
});

const upload = async (file) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    const response = await s3.send(command);
    return response;
};

const getPresignedUrl = async (fileName) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
};

export { upload, getPresignedUrl };
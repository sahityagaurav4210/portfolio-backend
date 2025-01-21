import { S3Client } from '@aws-sdk/client-s3';

let client: S3Client;

const S3 = () => {
  if (!client)
    client = new S3Client({
      region: process.env.AWS_REGION || '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  return client;
};

export default S3;

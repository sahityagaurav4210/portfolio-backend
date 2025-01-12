import { GetObjectCommand } from '@aws-sdk/client-s3';

const params = {
  Bucket: process.env.AWS_BUCKET_NAME,
};

export async function getObject(path: string): Promise<Record<string, any>> {
  const command = new GetObjectCommand({ ...params, Key: path });
  const { AWS_S3 } = globalThis as Record<string, any>;
  const { logger } = globalThis as Record<string, any>;

  try {
    const data = await AWS_S3.send(command);
    const stream = data.Body;
    const chunks: Uint8Array[] = [];

    return new Promise<Record<string, any>>((resolve, reject) => {
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('error', (error: any) => reject(error));
      stream.on('end', () => {
        const fileContents = Buffer.concat(chunks).toString('utf-8');
        resolve(JSON.parse(fileContents));
      });
    });
  } catch (error: any) {
    logger.error({ message: error.message || "An error occurred in getObject aws helper function" });
    return {};
  }
}

export async function getObjectAsBlob(path: string): Promise<Buffer> {
  const command = new GetObjectCommand({ ...params, Key: path });
  const { AWS_S3 } = globalThis as Record<string, any>;
  const { logger } = globalThis as Record<string, any>;
  try {
    const data = await AWS_S3.send(command);
    const stream = data.Body;
    const chunks: Uint8Array[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('error', (error: any) => reject(error));
      stream.on('end', () => {
        const fileContents = Buffer.concat(chunks);
        resolve(fileContents);
      });
    });
  } catch (error: any) {
    console.log(error.message);
    logger.error({ message: error.message || "An error occurred in getObjectAsBlob aws helper function" });
    return Buffer.from(JSON.stringify({}), 'binary');
  }
}

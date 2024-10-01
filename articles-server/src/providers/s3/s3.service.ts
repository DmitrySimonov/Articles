import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  constructor(private readonly s3Client: S3Client) {}

  public async generatePreSignedPutUrl(bucket: string, fileName: string) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  public async getFile(bucket: string, fileName: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileName,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 300 }); // expires 5 min
  }

  public async deleteFile(bucket: string, fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: fileName,
    });
    return await this.s3Client.send(command);
  }
}

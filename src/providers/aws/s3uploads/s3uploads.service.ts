import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3uploadsService {
  private readonly s3;

  constructor(private readonly configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadImage(file: Express.Multer.File) {
    const key = `${
      file.originalname.split('.')[0] +
      '_' +
      Date.now() +
      '.' +
      file.originalname.split('.')[1]
    }`;
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }
}

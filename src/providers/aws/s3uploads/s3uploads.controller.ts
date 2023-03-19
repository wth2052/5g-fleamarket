import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Controller('uploads')
export class S3uploadsController {
  constructor(private readonly configService: ConfigService) {}
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    AWS.config.update({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    try {
      const key = `${Date.now() + file.originalname}`;
      // AWS 객체 생성
      const upload = await new AWS.S3()
        .putObject({
          Key: key,
          Body: file.buffer,
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
        })
        .promise();

      const imgurl = this.configService.get('AWS_CLOUDFRONT') + key;
      return Object.assign({
        statusCode: 201,
        message: `이미지 등록 성공`,
        data: { url: imgurl },
      });
    } catch (error) {
      console.log('에러가 발생했습니다.', error);
    }
  }
}

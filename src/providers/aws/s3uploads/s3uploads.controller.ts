import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { S3uploadsService } from './s3uploads.service';

@Controller('uploads')
export class S3uploadsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3UploadsService: S3uploadsService,
  ) {}
  @Post('')
  @UseInterceptors(FilesInterceptor('files', 10)) // 10은 최대파일개수
  async uploadFile(@UploadedFiles() files) {
    console.log(files);
    const imgurl: string[] = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const key = await this.s3UploadsService.uploadImage(file);
        imgurl.push(this.configService.get('AWS_CLOUDFRONT') + key);
      }),
    );

    return {
      statusCode: 201,
      message: `이미지 등록 성공`,
      data: imgurl,
    };
  }
}

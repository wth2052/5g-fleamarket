import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/global/util/multer/multer.options';
import { S3uploadsService } from './s3uploads.service';
import { S3uploadsController } from './s3uploads.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [S3uploadsController],
  providers: [S3uploadsService],
})
export class S3uploadsModule {}

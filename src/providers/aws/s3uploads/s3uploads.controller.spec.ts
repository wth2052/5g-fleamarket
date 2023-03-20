import { Test, TestingModule } from '@nestjs/testing';
import { S3uploadsController } from './s3uploads.controller';

describe('S3uploadsController', () => {
  let controller: S3uploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3uploadsController],
    }).compile();

    controller = module.get<S3uploadsController>(S3uploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { S3uploadsService } from './s3uploads.service';

describe('S3uploadsService', () => {
  let service: S3uploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3uploadsService],
    }).compile();

    service = module.get<S3uploadsService>(S3uploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

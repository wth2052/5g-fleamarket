import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LikesEntity } from '../global/entities/likes.entity';
import { NoticesEntity } from '../global/entities/notices.entity';
import { ReportsEntity } from '../global/entities/reports.entity';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtDecodeDto } from 'src/user/dto';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;
  let jwtService: JwtService;
  let userRepository: Repository<UserEntity>;
  let reportRepository: Repository<ReportsEntity>;
  let noticeRepository: Repository<NoticesEntity>;
  let likeRepository: Repository<LikesEntity>;
  

  beforeEach(async () => {
    const mockJwtService = { decode: () => ({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ReportsEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(NoticesEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(LikesEntity),
          useClass: Repository,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    reportRepository = module.get<Repository<ReportsEntity>>(getRepositoryToken(ReportsEntity));
    noticeRepository = module.get<Repository<NoticesEntity>>(getRepositoryToken(NoticesEntity));
    likeRepository = module.get<Repository<LikesEntity>>(getRepositoryToken(LikesEntity));

  });

  describe('createReport', () => {
    it('should create a report successfully', async () => {
      const mockmessage = { message: '신고가 접수되었습니다.' };
      const data: CreateReportDto = {
        reported: 'test@test.com',
        title: 'test',
        description: 'this is test',
      };
      const mockJwt: JwtDecodeDto = {
        id: 1,
        email: 'tes@gmail.com',
        nickname: 'test',
        iat: 1,
        exp: 1
      }
      // const mockDecodedJwt = { id: 1 };
      const userId = 1

      jest.spyOn(service, 'createReport').mockResolvedValue(mockmessage);
      // jest.spyOn(jwtService, 'decode').mockReturnValue(mockDecodedJwt);
      const result = await controller.createReport(mockJwt, data );

      expect(service.createReport).toHaveBeenCalledWith(
        userId,
        data.reported,
        data.title,
        data.description,
      );
      expect(result).toEqual(mockmessage);
    });
  });


  describe('getNotices', () => {
    it('should return notices and totalNotice', async () => {

      const mockResponse = {
        notices: [new NoticesEntity(), new NoticesEntity()],
        totalNotice: 2,
      };

      jest.spyOn(service, 'getNotices').mockResolvedValue(mockResponse.notices);
      jest.spyOn(service, 'getTotalNotice').mockResolvedValue(mockResponse.totalNotice);
    
      const result = await controller.getNotices();     
      expect(service.getNotices).toHaveBeenCalledWith(10, 0);
      expect(service.getTotalNotice).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should return an error message when an error is thrown', async () => {
      
      const mockError = new Error('Test error');
      jest.spyOn(service, 'getNotices').mockRejectedValue(mockError);
      const result = await controller.getNotices();
      expect(service.getNotices).toHaveBeenCalledWith(10, 0);
      expect(result).toEqual({ errorMessage: mockError.message });
    });
  });

  describe('getNoticeById', () => {
    it('should return a notice with the given id', async () => {
      const mockNotice = new NoticesEntity();
      jest.spyOn(service, 'getNoticeById').mockResolvedValueOnce(mockNotice);

      const result = await controller.getNoticeById(1);
      expect(result).toEqual({ notice: mockNotice });
    });
  });

  describe('findMyLike', () => {
    it('should return a notice with the given id', async () => {
      const mockLike = [new LikesEntity(), new LikesEntity() ]
      const mockJwt: JwtDecodeDto = {
        id: 1,
        email: 'tes@gmail.com',
        nickname: 'test',
        iat: 1,
        exp: 1
      }
      const userId = 1

      jest.spyOn(service, 'findMyLike').mockResolvedValueOnce(mockLike);

      const result = await controller.findMyLike(mockJwt);
      expect(result).toEqual({ product: mockLike });
      expect(service.findMyLike).toHaveBeenCalledWith(
        userId
      );
    });
  });

});

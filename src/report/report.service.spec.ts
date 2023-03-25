import { Test, TestingModule } from '@nestjs/testing';
import { LikesEntity } from '../global/entities/likes.entity';
import { NoticesEntity } from '../global/entities/notices.entity';
import { ReportsEntity } from '../global/entities/reports.entity';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import { ReportService } from './report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsEntity } from '../global/entities/products.entity';

describe('ReportService', () => {
  let service: ReportService;
  let userRepository: Repository<UserEntity>;
  let reportRepository: Repository<ReportsEntity>;
  let noticeRepository: Repository<NoticesEntity>;
  let likesRepository: Repository<LikesEntity>;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportService,
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
      
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    reportRepository = module.get<Repository<ReportsEntity>>(getRepositoryToken(ReportsEntity));
    noticeRepository = module.get<Repository<NoticesEntity>>(getRepositoryToken(NoticesEntity));
    likesRepository = module.get<Repository<LikesEntity>>(getRepositoryToken(LikesEntity));
  });
//신고 접수
describe('createReport', () => {
  it('should create a report successfully', async () => {
    const mockmessage = { message: '신고가 접수되었습니다.' }

    jest.spyOn(reportRepository, 'insert').mockResolvedValue(undefined);

    const userId = 1
    const reported = "xxxx@naver.com"
    const title= "테스트 신고"
    const description = "테스트 신고입니다."

    const result = await service.createReport(userId, reported, title,  description);

    expect(reportRepository.insert).toHaveBeenCalledWith({ 
      reporterId: userId,
      reported: reported,
      title: title,
      description: description,});
    expect(result).toEqual(mockmessage);
  });


});

//공지사항 모두 조회
describe('getNotices', () => {
    it('should return an array of notices', async () => {
      const mockNotices = [new NoticesEntity(), new NoticesEntity()];
      jest.spyOn(noticeRepository, 'find').mockResolvedValueOnce(mockNotices);

      const result = await service.getNotices(2, 0);
      expect(noticeRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNotices);
    });

    it('should throw a NotFoundException when no notices are found', async () => {
      jest.spyOn(noticeRepository, 'find').mockResolvedValueOnce([]);

      await expect(service.getNotices(2, 0)).rejects.toThrowError(NotFoundException);
      expect(noticeRepository.find).toHaveBeenCalledTimes(1);
    });
  });

//공지사항 상세조회
describe('getNoticeById', () => {
  it('should return a notice when given a valid id', async () => {
    const mocknotice = new NoticesEntity();
    jest.spyOn(noticeRepository, 'findOne').mockResolvedValueOnce(mocknotice);

    const result = await service.getNoticeById(1);
    expect(noticeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mocknotice);
  });

  it('should throw a NotFoundException when given an invalid id', async () => {
    jest.spyOn(noticeRepository, 'findOne').mockResolvedValueOnce(undefined);

    await expect(service.getNoticeById(1)).rejects.toThrowError(NotFoundException);
    expect(noticeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});

 //찜 목록 보기
 describe('findMyLike', () => {
  it('should return an array of products that the user likes', async () => {
    const user = new UserEntity();
    user.id = 1;
    const product1 = new ProductsEntity();
    product1.id = 1
    const product2 = new ProductsEntity();
    product1.id = 2
    const likes = [
      {
        id: 1,
        userId: user.id,
        productId: product1.id,
      },
      {
        id: 2,
        userId: user.id,
        productId: product2.id,
      },
    ];

    jest.spyOn(likesRepository, 'createQueryBuilder').mockReturnValueOnce({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      // leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce(likes),
    } as any);

    const result = await service.findMyLike(user.id);

    expect(result).toEqual(likes);
  });

  it('should throw a NotFoundException if the user has no liked products', async () => {
    const user = new UserEntity();
    user.id = 1;

    jest.spyOn(likesRepository, 'createQueryBuilder').mockReturnValueOnce({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      // leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce([]),
    } as any);

    await expect(service.findMyLike(user.id)).rejects.toThrowError(
      NotFoundException,
    );
  });
});
});

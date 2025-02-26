import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsEntity } from '../global/entities/admins.entity';
import { CategoriesEntity } from '../global/entities/categories.entity';
import { NoticesEntity } from '../global/entities/notices.entity';
import { ProductsEntity } from '../global/entities/products.entity';
import { UserEntity } from '../global/entities/users.entity';
import { Repository, Like } from 'typeorm';
import { ReportsEntity } from '../global/entities/reports.entity';
import { ProductImagesEntity } from '../global/entities/productimages.entity';
import { EmailService } from '../email/email.service';
import { Cache } from 'cache-manager';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(CategoriesEntity)
    private categoryRepository: Repository<CategoriesEntity>,
    @InjectRepository(AdminsEntity)
    private adminRepository: Repository<AdminsEntity>,
    @InjectRepository(NoticesEntity)
    private noticeRepository: Repository<NoticesEntity>,
    @InjectRepository(ReportsEntity)
    private reportRepository: Repository<ReportsEntity>,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // 상품정보 가져오기 API
  async getProducts(limit: number, offset: number) {
    // const products = await this.productRepository.find(
    //   {
    //     take: limit,
    //     skip: offset,
    //   }
    // );

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    const products = await queryBuilder
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect(
        'product.seller',
        'seller',
        'seller.id = product.sellerId',
      )
      .leftJoinAndSelect('product.images', 'images')
      .take(limit)
      .skip(offset)
      .select([
        'product.id',
        'product.title',
        'product.price',
        'product.viewCount',
        'product.likes',
        'product.dealCount',
        'product.createdAt',
        'product.updatedAt',
        'category.id',
        'category.name',
        'seller.nickname',
        'images.imagePath',
      ])
      .getMany();

    if (products.length === 0) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    } else {
      return products;
    }
  }
  async getTotalProducts() {
    return this.productRepository.count();
  }

  //상품정보 상세보기 API
  async getProductById(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });
    //리팩토링 필요
    const sellerId = product.sellerId;
    const seller = await this.userRepository.findOne({
      where: { id: sellerId },
    });
    const categoryId = product.categoryId;
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    // const images = await this.imageRepository.find({where: {productId: productId}})
    //

    const images = product.images.map((image) => ({
      imagePath: image.imagePath,
    }));
    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    } else {
      //return product ==> return {product, seller}

      return { product, seller, category, images };
    }
  }

  //상품 삭제 API
  async deleteProduct(productId: number) {
    this.productRepository.delete(productId);
    return { message: '상품이 삭제되었습니다' };
  }

  //회원정보 가져오기 API
  async getUsers(limit: number, offset: number) {
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });
    if (users.length === 0) {
      throw new NotFoundException('회원정보가 존재하지 않습니다.');
    } else {
      return users;
    }
  }
  async getTotalUsers() {
    return this.userRepository.count();
  }

  //회원정보 상세보기 API
  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    } else {
      return user;
    }
  }

  //회원정보 수정(블랙리스트) API
  async banUser(userId: number, ban: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    } else {
      const nickname = user.nickname;
      const banStatus = user.ban;

      if (ban === 1) {
        if (banStatus === 1) {
          throw new UnauthorizedException('이미 블랙리스트 처리된 유저입니다.');
        } else {
          await this.userRepository.update(userId, { ban });
          await this.cacheManager.del(`${userId}`);
          return { message: `${nickname}님이 블랙리스트 처리되었습니다.` };
        }
      } else if (ban === 0) {
        await this.userRepository.update(userId, { ban });
        await this.userRepository.update(userId, { warning: 0 });
        return { message: `${nickname}님의 블랙리스트 처리가 취소되었습니다.` };
      }
    }
  }

  //회원 삭제 API
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    } else {
      const nickname = user.nickname;
      this.userRepository.delete(userId);
      return { message: `${nickname}님의 회원정보가 삭제되었습니다.` };
    }
  }

  //카테고리 조회 API
  async getCategory(limit: number, offset: number) {
    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
    });
    if (categories.length === 0) {
      throw new NotFoundException('카테고리가 없습니다.');
    } else {
      return categories;
    }
  }
  async getTotalcategory() {
    return this.categoryRepository.count();
  }

  //카테고리 생성 API
  async createCategory(name: string) {
    if (name.length === 0) {
      throw new NotFoundException('내용이 비어있습니다.');
    } else {
      await this.categoryRepository.insert({ name });
      return { message: '카테고리가 추가되었습니다' };
    }
  }

  //카테고리 수정 API
  async updateCategory(categoryId: number, name: string) {
    if (name.length === 0) {
      throw new NotFoundException('내용이 비어있습니다.');
    } else {
      await this.categoryRepository.update(categoryId, { name });
      return { message: '카테고리가 수정되었습니다' };
    }
  }

  //카테고리 삭제 API
  async deleteCategory(categoryId: number) {
    this.categoryRepository.delete(categoryId);
    return { message: '카테고리가 삭제되었습니다' };
  }

  //공지사항 모두 조회

  async getNotices(limit: number, offset: number) {
    const notices = await this.noticeRepository.find({
      take: limit,
      skip: offset,
    });
    if (notices.length === 0) {
      throw new NotFoundException('공지사항이 없습니다.');
    } else {
      return notices;
    }
  }
  async getTotalNotice() {
    return this.noticeRepository.count();
  }

  //공지사항 상세조회
  async getNoticeById(noticeId: number) {
    const notice = await this.noticeRepository.findOne({
      where: { id: noticeId },
    });
    if (!notice) {
      throw new NotFoundException('존재하지 않는 공지사항입니다.');
    } else {
      return notice;
    }
  }

  //공지사항 작성
  async createNotice(adminId: number, title: string, description: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new UnauthorizedException(
        '존재하지 않는 관리자입니다. 공지를 작성하실 수 없습니다.',
      );
    } else if (title.length === 0) {
      throw new NotFoundException('제목이 없습니다.');
    } else if (description.length === 0) {
      throw new NotFoundException('내용이 없습니다.');
    } else {
      this.noticeRepository.insert({ adminId, title, description });
      return { message: '새로운 공지가 작성되었습니다' };
    }
  }

  //공지사항 수정
  async updateNotice(noticeId: number, title: string, description: string) {
    if (title.length === 0) {
      throw new NotFoundException('제목이 없습니다.');
    } else if (description.length === 0) {
      throw new NotFoundException('내용이 없습니다.');
    } else {
      await this.noticeRepository.update(noticeId, { title, description });
      return { message: '공지가 수정되었습니다' };
    }
  }

  //공지사항 삭제
  async deleteNotice(noticeId: number) {
    this.noticeRepository.delete(noticeId);
    return { message: '공지가 삭제되었습니다' };
  }

  ///testcode 없음////

  //상품검색
  async productSearch(search: string) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      const products = await queryBuilder
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect(
          'product.seller',
          'seller',
          'seller.id = product.sellerId',
        )
        .leftJoinAndSelect('product.images', 'images')
        .where({ title: Like(`%${search}%`) })
        .select([
          'product.id',
          'product.title',
          'product.price',
          'product.viewCount',
          'product.likes',
          'product.dealCount',
          'product.createdAt',
          'product.updatedAt',
          'category.id',
          'category.name',
          'seller.nickname',
          'images.imagePath',
        ])
        .getMany();

      // const products = await this.productRepository.find({
      //   where: { title: Like(`%${search}%`) },
      // });
      if (products.length === 0) {
        throw new NotFoundException(`검색한 상품이 없습니다.'${search}'`);
      }
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //회원 검색

  async userSearch(search: string) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const users = await this.userRepository.find({
        where: { nickname: Like(`%${search}%`) },
      });
      if (users.length === 0) {
        throw new NotFoundException(`검색한 회원이 없습니다.'${search}'`);
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //카테고리 검색

  async categorySearch(search: string) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const category = await this.categoryRepository.find({
        where: { name: Like(`%${search}%`) },
      });
      if (category.length === 0) {
        throw new NotFoundException(`검색한 카테고리가 없습니다.'${search}'`);
      }
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //공지 검색

  async noticeSearch(search: string) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const notice = await this.noticeRepository.find({
        where: { title: Like(`%${search}%`) },
      });
      if (notice.length === 0) {
        throw new NotFoundException(`검색한 공지사항이 없습니다.'${search}'`);
      }
      return notice;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //신고 검색

  async reportSearch(search: string) {
    try {
      if (!search) {
        throw new NotFoundException('검색어를 입력해주세요.');
      }
      const report = await this.reportRepository.find({
        where: { title: Like(`%${search}%`) },
      });
      if (report.length === 0) {
        throw new NotFoundException(`검색한 공지사항이 없습니다.'${search}'`);
      }
      return report;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // 블랙리스트 회원 목록 보기
  async getBanUsers() {
    const banUsers = await this.userRepository.find({ where: { ban: 1 } });
    if (banUsers.length === 0) {
      throw new NotFoundException('블랙리스트 회원이 없습니다.');
    } else {
      return banUsers;
    }
  }

  //신고목록 확인
  async getReports(limit: number, offset: number) {
    const reports = await this.reportRepository.find({
      take: limit,
      skip: offset,
    });
    if (reports.length === 0) {
      throw new NotFoundException('접수된 신고가 없습니다.');
    } else {
      return reports;
    }
  }

  //확인안된 신고
  async getUncheckedReports() {
    const Uncheckedreports = await this.reportRepository.find({
      where: { status: 0 },
    });
    if (Uncheckedreports.length === 0) {
      throw new NotFoundException('모든 신고가 확인되었습니다.');
    } else {
      return Uncheckedreports;
    }
  }

  //확인된 신고
  async getCheckedReports() {
    const Checkedreports = await this.reportRepository.find({
      where: { status: 1 },
    });
    if (Checkedreports.length === 0) {
      throw new NotFoundException('확인된 신고가 없습니다..');
    } else {
      return Checkedreports;
    }
  }

  async getTotalReports() {
    return this.reportRepository.count();
  }

  //신고 상세 보기
  async getReportById(reportId: number) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });
    const reporterId = report.reporterId;
    const reporter = await this.userRepository.findOne({
      where: { id: reporterId },
    });
    if (!report) {
      throw new NotFoundException('존재하지 않는 신고입니다.');
    } else {
      return { report, reporter };
    }
  }

  //신고 수정(확인하기) API
  async checkReport(reportId: number, status: number, reported: string) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });
    const user = await this.userRepository.findOne({
      where: { email: reported },
    });
    if (!report) {
      throw new NotFoundException('존재하지 않는 신고입니다.');
    } else {
      const reportStatus = report.status;

      if (status === 1) {
        if (reportStatus === 1) {
          throw new UnauthorizedException('이미 확인된 신고입니다.');
        } else {
          if (!user) {
            throw new NotFoundException('회원이 존재하지 않습니다.');
          } else {
            await this.reportRepository.update(reportId, { status });
            if (user.warning < 5) {
              await this.userRepository.update(user.id, {
                warning: () => 'warning + 1',
              });

              return {
                message: `신고가 확인되었습니다. 경고가 누적되었습니다.`,
              };
            } else if (user.warning >= 5) {
              await this.emailService.sendBanEmail(user);
              await this.userRepository.update(user.id, { ban: 1 });
              await this.cacheManager.del(`${user.id}`);
              return {
                message: `신고가 확인되었습니다. 블랙리스트 처리 되었습니다.`,
              };
            }
          }
        }
      } else if (status === 0) {
        await this.reportRepository.update(reportId, { status });
        return { message: `신고 확인이 취소되었습니다.` };
      }
    }
  }

  //신고 삭제
  async deleteReport(reportId: number) {
    this.reportRepository.delete(reportId);
    return { message: '신고가 삭제되었습니다' };
  }
}

import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { SmsService } from 'src/sms/sms.service';
import { ConfigService } from '@nestjs/config';
import { JwtDecodeDto } from './dto';
import { OAuthAddInformationDto, UpdateUserDto } from './dto/create-user.dto';
import { Cache } from 'cache-manager';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>, // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    await this.userRepository.save(user);
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    await this.cacheManager.set(`${id}`, currentHashedRefreshToken, {
      ttl: this.configService.get('REDIS_REFRESH_EXPIRE'),
    });
    // await this.userRepository.update(id, { currentHashedRefreshToken });
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.cacheManager.get(`${id}`);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: number) {
    await this.cacheManager.del(`${id}`);
  }
  //TODO: 중간 발표 이후 클린 코드 리팩토링 대상 흑흑
  async getUserInformation(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
  }
  async updateUserInformation(User: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    User.password = await bcrypt.hash(User.password, 10);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.update(
        { id: user.id },
        {
          nickname: User.nickname,
          password: User.password,
          phone: User.phone,
          address: User.address,
        },
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateGoogleUserInformation(
    User: OAuthAddInformationDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.update(
        { id: user.id },
        {
          nickname: User.nickname,
          phone: User.phone,
          address: User.address,
        },
      );
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

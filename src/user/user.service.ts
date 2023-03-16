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
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { SmsService } from 'src/sms/sms.service';
import { ConfigService } from '@nestjs/config';
import { JwtDecodeDto } from './dto';
import { UpdateUserDto } from './dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>, // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    await this.userRepository.save(user);
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(id, { currentHashedRefreshToken });
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: number) {
    return this.userRepository.update(id, {
      currentHashedRefreshToken: null,
    });
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
  async updateUserInfomtaion(User: UpdateUserDto) {

  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SmsService } from 'src/sms/sms.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly smsService: SmsService,
    private readonly config: ConfigService,
  ) {}
  async createUser(
    nickname: string,
    email: string,
    password: string,
    phone: string,
    address: string,
  ) {
    const newUser = await this.usersRepository.findOne({ where: { email } });
    if (newUser) {
      throw new UnauthorizedException('이미 존재하는 유저입니다.');
    } else {
      // await this.smsService.sendSMS(phone); //TODO : SMS 인증 로직 마저 처리하기
      const hashedPwd = await bcrypt.hash(password, 12);
      await this.usersRepository.save({
        nickname,
        email,
        password: hashedPwd,
        phone,
        address,
      });
    }
  }
  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { email } });
  }
}

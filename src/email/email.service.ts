import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//null/undefined 판별을 위한 lodash
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import {
  EmailVerifyUserDto,
  VerifyEmailNumberDto,
} from '../user/dto/create-user.dto';

@Injectable()
export class EmailService {
  constructor(
    //메일 제한시간/Redis 저장을 위한 CacheManager
    //https://docs.nestjs.com/techniques/caching
    //https://www.npmjs.com/package/@nestjs-modules/mailer
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async sendEmail(user: EmailVerifyUserDto): Promise<void> {
    // const findUser = await this.userRepository.findOne({
    //   where: { email: user.email },
    // });
    const getRandomCode = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };

    const randomCode = getRandomCode(111111, 999999);

    const transport = nodemailer.createTransport({
      service: this.configService.get('NODEMAILER_SERVICE'),
      secure: true,
      auth: {
        user: this.configService.get('NODEMAILER_EMAIL'),
        pass: this.configService.get('NODEMAILER_PASSWORD'),
        expires: this.configService.get('NODEMAILER_EXPIRES'),
      },
    });
    await this.cacheManager.set(`${user.email}`, randomCode, {
      ttl: this.configService.get('MAIL_TTL'),
    });
    console.log(
      `${user.email}의 인증번호 : `,
      await this.cacheManager.get(`${user.email}`),
    );
    console.log(
      `${user.email}의 MAIL_TTL : `,
      this.configService.get('MAIL_TTL'),
    );
    return await transport.sendMail({
      from: {
        name: '5지는 플리마켓 운영자',
        address: this.configService.get('NODEMAILER_EMAIL'),
      },
      subject: '회원가입 인증 메일',
      to: [user.email],
      text: `이메일 인증번호는 ${randomCode} 입니다.`,
    });
  }
  async verifyEmailNumber(user: VerifyEmailNumberDto): Promise<object> {
    //Redis 내 : number userInput : String
    const fromRedisCacheCode = await this.cacheManager.get(`${user.email}`);
    console.log('Redis로부터 : ', fromRedisCacheCode);
    const userInputCode = user.verifyNumber;
    console.log('userInput으로부터 : ', userInputCode);
    console.log(typeof fromRedisCacheCode, typeof userInputCode);
    console.log(fromRedisCacheCode.toString() === userInputCode);
    //Redis의 값과 user가 입력한 값이 일치한다면
    if (fromRedisCacheCode.toString() === userInputCode) {
      return;
    } else {
      // throw new
    }
  }
}

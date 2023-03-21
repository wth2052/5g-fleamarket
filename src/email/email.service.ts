import {
  BadRequestException,
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      `${user.email}의 MAIL_TTL`,
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
  async verifyEmailNumber(user: VerifyEmailNumberDto): Promise<void> {
    //Redis 내 : number userInput : String
    const fromRedisCacheCode = await this.cacheManager.get(`${user.email}`);
    const userInputCode = user.verifyNumber;
    //레디스에 있는 코드 = number
    if (fromRedisCacheCode.toString() === userInputCode) {
      return;
    } else {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: '인증번호가 일치하지 않습니다. 다시 시도해주세요.',
      });
    }
  }

  ///블랙리스트 처리 이메일 

  async sendBanEmail(user): Promise<void> {
    
    const transport = nodemailer.createTransport({
      service: this.configService.get('NODEMAILER_SERVICE'),
      secure: true,
      auth: {
        user: this.configService.get('NODEMAILER_EMAIL'),
        pass: this.configService.get('NODEMAILER_PASSWORD'),
        expires: this.configService.get('NODEMAILER_EXPIRES'),
      },
    });
    // await this.cacheManager.set(`${user.email}`, {
    //   ttl: this.configService.get('MAIL_TTL'),
    // });
    return await transport.sendMail({
      from: {
        name: '5지는 플리마켓 운영자',
        address: this.configService.get('NODEMAILER_EMAIL'),
      },
      subject: '블랙리스트 처리 이메일',
      to: [user.email],
      text: `${user.nickname}님은 냐옹상회에서 5번 이상 경고 누적이 쌓이셔서 블랙리스트 처리 당하셨습니다.`,
    });
  }
}

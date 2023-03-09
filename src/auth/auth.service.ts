import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../global/entities/users.entity';
import * as jwt from 'jsonwebtoken';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from 'src/user/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //로그인시 비밀번호와 아이디를 확인하여 일치하지 않을시 400 에러를 던집니다.
  async vaildateUser(email: string, plainTextPassword: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      await this.verifyPassword(plainTextPassword, user.password);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(
        '아이디나 비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //회원가입, 아이디가 중복일 시 400에러와 함께 transaction rollback을 수행합니다.
  async register(user: UserEntity) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    try {
      const { password, ...returnUser } = await this.userService.create({
        ...user,
        password: hashedPassword,
      });
      return returnUser;
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          '이미 가입된 이메일입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  getCookieWithJwtAccessToken(user: UserEntity) {
    const payload = { id: user.id, email: user.email, nickname: user.nickname };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRETKEY'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}h`,
    });
    return {
      accessToken: token,
      httpOnly: true,
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/',
      maxAge:
        Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) *
        60 *
        60,
    };
  }

  getCookieWithJwtRefreshToken(user: UserEntity) {
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRETKEY'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}d`,
    });

    return {
      refreshToken: token,
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/',
      httpOnly: true,
      //env값 * 1일
      maxAge:
        Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
        60 *
        60 *
        24,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: this.configService.get('COOKIE_DOMAIN'),
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: this.configService.get('COOKIE_DOMAIN'),
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}

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
import {
  AuthUserDto,
  LoginUserDto,
  TokenGenerateDto,
} from '../user/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //로그인시 비밀번호와 아이디를 확인하여 일치하지 않을시 400 에러를 반환합니다.
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

  //패스워드를 검증하여 일치하지 않을시 400에러를 반환합니다.
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
  async register(user: AuthUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(hashedPassword);
    try {
      const { email, nickname, phone, address } = user;
      const createdUser = await this.userRepository.create({
        email,
        password: hashedPassword,
        nickname,
        phone,
        address,
      });
      await this.userRepository.insert(createdUser);
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          '이미 가입된 이메일입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  //payload 에서 유저의 아이디 이메일 닉네임을 가져와 Access token을 발행합니다.
  getCookieWithJwtAccessToken(user: TokenGenerateDto) {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
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
  //payload 에서 유저의 아이디를 가져와  Refresh token을 발행합니다.
  getCookieWithJwtRefreshToken(user: TokenGenerateDto) {
    const payload = { email: user.email };
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

  //로그아웃 버튼을 눌렀을 시 쿠키의 maxAge를 0로 만들어 쿠키에서 즉시 제거합니다.
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

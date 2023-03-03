import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../global/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async vaildateUser(email: string, plainTextPassword: string): Promise<any> {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.BAD_REQUEST);
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
      throw new HttpException('잘못된 요청입니다.', HttpStatus.BAD_REQUEST);
    }
  }

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
          '유저가 이미 존재합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  getCookieWithJwtAccessToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRETKEY'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return {
      accessToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) *
        1000,
    };
  }

  getCookieWithJwtRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRETKEY'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}d`,
    });

    return {
      refreshToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
        1000,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}

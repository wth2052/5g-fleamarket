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
import { LoginUserDto } from '../user/dto';
import { UserEntity } from '../global/entities/users.entity';
import { Payload } from './passport/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(userDto: LoginUserDto): Promise<{ accessToken: string }> {
    const userFind: UserEntity = await this.userService.findUserByEmail(
      userDto.email,
    );
    console.log('유저 찾았쪙', userFind);
    //패스워드가 DTO와 userfind를 통해 얻은 값이 같은지 검증
    const validatePassword = await bcrypt.compare(
      userDto.password,
      userFind.password,
    );
    if (!userFind || !validatePassword) {
      throw new UnauthorizedException(
        '아이디 혹은 패스워드가 올바르지 않습니다.',
      );
    }

    const payload: Payload = {
      id: userFind.id,
      nickname: userFind.nickname,
      email: userFind.email,
    };

    //페이로드에 아이디와 이메일을 넣은 토큰 정보를 리턴
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

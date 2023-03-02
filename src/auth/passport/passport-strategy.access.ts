import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_ACCESS_SECRETKEY'),
    });
  }
  async validate(payload: LoginUserDto, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.validateUser(payload);
    console.log(user);
    if (!user) {
      return done(
        new UnauthorizedException({ message: '유저를 찾을 수 없습니다.' }),
        false,
      );
    }
    return done(null, user);
  }
}

import {  Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
  
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_SECRETKEY'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    
    const refreshToken = req.cookies?.refreshToken;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}

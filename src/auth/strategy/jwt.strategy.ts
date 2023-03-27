import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { SocialService } from '../../social/social.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../global/entities/users.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //jwt 토큰이 만료되었을경우 request를 거부한다.
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRETKEY'),
    });
  }

  async validate(payload: any) {
    console.log('페이로드', payload);
    const verify = await this.cacheManager.get(`${payload.id}`);
    
    if(!verify){
      console.log("리프레시 토큰이 없음")
      } 
    else{
        return {
      id: payload.id,
      email: payload.email,
      nickname: payload.nickname,
    };
    }
  
  }
}

import { SocialController } from './social.controller';
import { AppService } from '../app.service';
import { JwtGoogleStrategy } from '../auth/strategy/jwt-google.strategy';
import { Module } from '@nestjs/common';
import { SocialService } from './social.service';

@Module({
  imports: [],
  controllers: [SocialController],
  providers: [SocialService, JwtGoogleStrategy],
})
export class SocialModule {}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { SocialService } from './social.service';

@Controller('google')
export class SocialController {

  constructor(private readonly socialService: SocialService) {}

  @Get('')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.socialService.googleLogin(req);
  }
}

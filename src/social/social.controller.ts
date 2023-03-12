import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SocialService } from './social.service';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Controller('google')
export class SocialController {
  constructor(
    private readonly socialService: SocialService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Get('')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Res({ passthrough: true }) res: Response) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.socialService.googleSignup(req.user);
    const user = req.user;
    console.log('구글 유저', user);
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    // console.log(accessOption);
    console.log(accessToken);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user);
    console.log(refreshToken);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('refreshToken', refreshToken, refreshOption);
  }
}

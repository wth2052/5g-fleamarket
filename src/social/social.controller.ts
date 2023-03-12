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
  // @Get('')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req, @Res({ passthrough: true }) res: Response) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    // console.log(accessOption);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('refreshToken', refreshToken, refreshOption);
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log(req.existUser);
    //
    // if ((req.existUser = true)) {
    //   res.redirect('/google/login');
    // }
    return this.socialService.googleSignup(req);
  }
}

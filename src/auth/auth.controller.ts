import {
  Body,
  Controller,
  Get,
  Param,
  HttpCode,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../global/common/decorator/skip-auth.decorator';
import { UserEntity } from '../global/entities/users.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '../user/dto/create-user.dto';
interface IOAuthUser {
  //interface 설정
  user: {
    name: string;
    email: string;
    password: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('login')
  //이제 Nest 기본 응답 개체와 상호 작용할 수 있지만 (예: 특정 조건에 따라 쿠키 또는 헤더 설정) 나머지는 프레임워크에 맡김
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user = req.user;
    console.log(user);
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    // console.log(accessOption);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user);
    await this.userService.setCurrentRefreshToken(refreshToken, user);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('refreshToken', refreshToken, refreshOption);
  }

  // @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logOut(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();
    await this.userService.removeRefreshToken(req.user.id);
    res.cookie('Authentication', '', accessOption);
    res.cookie('refreshToken', '', refreshOption);
  }

  @Public()
  @UsePipes(ValidationPipe)
  @Post('signup')
  async register(@Body() user: AuthUserDto): Promise<void> {
    await this.authService.register(user);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    res.cookie('Authentication', accessToken, accessOption);
    return user;
  }
  //TODO: OAUTH USER 닉네임 휴대폰 주소 API 하나 더 만들기
}

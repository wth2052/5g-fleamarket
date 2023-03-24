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
  Delete,
  UnauthorizedException,
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
import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { JwtDecodeDto } from '../user/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from '../global/entities/products.entity';
import { ProductImagesEntity } from '../global/entities/productimages.entity';
import { OrdersEntity } from '../global/entities/orders.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiCookieAuth } from '@nestjs/swagger';
interface IOAuthUser {
  //interface 설정
  user: {
    name: string;
    email: string;
    password: string;
  };
}

//TODO: auth를 없애서 API를 조금 더 RESTFUL하게 만드는게 맞을까?
@ApiCookieAuth()
@Controller('/api/auth')
export class AuthController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('login')
  //이제 Nest 기본 응답 개체와 상호 작용할 수 있지만 (예: 특정 조건에 따라 쿠키 또는 헤더 설정) 나머지는 프레임워크에 맡김
  //리프레시 토큰 재발급 잘됨
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user = req.user;
    if (user.ban === 1) {
      throw new UnauthorizedException(
        '블랙리스트 유저입니다. 로그인 하실 수 없습니다.',
      );
    } else {
      const { accessToken, ...accessOption } =
        this.authService.getCookieWithJwtAccessToken(user);
      // console.log(accessOption);
      const { refreshToken, ...refreshOption } =
        this.authService.getCookieWithJwtRefreshToken(user);
      await this.userService.setCurrentRefreshToken(refreshToken, user.id);
      res.cookie('Authentication', accessToken, accessOption);
      res.cookie('refreshToken', refreshToken, refreshOption);
      res.setHeader('Authentication', accessToken);
    }
  }

  // @Public()
  // @Public()
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Cookies('refreshToken') jwt: JwtDecodeDto,
  ): Promise<void> {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    res.cookie('Authentication', accessToken, accessOption);
    return user;
  }

  //TODO: OAUTH USER 닉네임 휴대폰 주소 API 하나 더 만들기
  //TODO: 회원 탈퇴 API 만들기
  //TODO: 현재 hard delete로 구현되었음, 추후 판매/구매자 게시글 보존을 위해 soft delete로 바꿔도
  //TODO: 괜찮은지 고민해보기
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async userSoftDelete(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Cookies('Authentication') jwt: JwtDecodeDto,
  ) {
    const userId = jwt.id;
    await this.authService.removeUserFromDB(userId);
  }
}

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SocialService } from './social.service';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';

@Controller('google')
export class SocialController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    //결과적으로 가입시키고 userId 리턴시킴
    const userSignupReturnId = await this.socialService.googleSignup(req.user);
    const user = req.user;
    //TODO: 유저 찾는 트랜잭션 개선시켜야함
    //TODO: 현재 메인페이지에서 order/my/pick 트랜잭션이 발생되는데 원인 찾아봐야함
    // const findUser = await this.userRepository.findOne({
    //   where: { email: req.user.email },
    // });
    // console.log('findUser', findUser);
    // if (!findUser) {
    //   console.log('취업할라면', userSignupReturnId);
    // }
    //아이디가 있던없던, 구글로그인시에는 유저아이디를 리턴해줄것임.
    user.id = userSignupReturnId;

    // console.log('구글 유저 콘솔★', user);
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(user);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('refreshToken', refreshToken, refreshOption);
    res.setHeader('Authentication', accessToken);
    res.setHeader('refreshToken', refreshToken);

    res.redirect('/mypage');
  }
}

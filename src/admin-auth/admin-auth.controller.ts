import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginAdminDto } from '../admin/dto/login-admin.dto';
import { AdminAuthService } from './admin-auth.service';
import { Request, Response } from 'express';
import { Public } from '../global/common/decorator/skip-auth.decorator';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('/api/admin')
@ApiTags('관리자 로그인 API')
@Public()
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  //admin 로그인
  @Post('/login')
  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자 로그인을 요청합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '아이디 혹은 패스워드가 올바르지 않습니다.',
  })
  async login(
    @Body() adminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.adminAuthService.login(adminDto);
    const { accessToken, message, ...accessOption } = jwt;
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('accessToken', accessToken, accessOption);
    return message;
  }

  //admin 로그아웃
  @Post('/logout')
  @ApiOperation({
    summary: '관리자 로그아웃',
    description: '관리자 로그아웃을 요청합니다.',
  })
  async logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessOption, message } = await this.adminAuthService.logOut();
    res.cookie('accessToken', '', accessOption);
    return message;
  }
}

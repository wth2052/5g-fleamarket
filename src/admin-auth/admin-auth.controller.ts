import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginAdminDto } from '../admin/dto/login-admin.dto';
import { AdminAuthService } from './admin-auth.service';
import { Request, Response } from 'express';
import { Public } from '../global/common/decorator/skip-auth.decorator';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('/api/admin')
@Public()
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  //admin 로그인
  @Post('/login')
  @ApiOperation({summary: '관리자 로그인',
  description: '관리자로 로그인함'})
  @ApiCreatedResponse({description: '관리자로 로그인되며 쿠키에 엑세스토큰을 부여받음'})
  @ApiUnauthorizedResponse({description: '아이디나 비밀번호가 틀림'})
  @ApiBody({type: LoginAdminDto})
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
  @ApiOperation({summary: '관리자 로그아웃',
  description: '관리자 페이지에서 로그아웃함'})
  @ApiCreatedResponse({description: '로그아웃되며 엑세스 토큰이 쿠키에서 비워짐'})
  async logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessOption, message } = await this.adminAuthService.logOut();
    res.cookie('accessToken', '', accessOption);
    return message;
  }
}
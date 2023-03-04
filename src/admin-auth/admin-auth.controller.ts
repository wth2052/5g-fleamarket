import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginAdminDto } from '../admin/dto/login-admin.dto';
import { AdminAuthService } from './admin-auth.service';

import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/global/common/decorator/skip-auth.decorator';

@Controller('admin-auth')
@Public()
export class AdminAuthController {

    constructor(private readonly adminAuthService: AdminAuthService) {}

    //admin 로그인
@Post('/login')
async login(
    @Body() adminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const jwt = await this.adminAuthService.login(adminDto);
    const {accessToken, ...accessOption} = jwt
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('accessToken', accessToken, accessOption);
    return accessToken;
  }

@Post('/test')
@UseGuards(AuthGuard())
test(@Req() req){
    console.log(1234, req.admin)
}
}
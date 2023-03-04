import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsEntity } from '../global/entities/admins.entity';
import { Repository } from 'typeorm';

import { JwtService } from "@nestjs/jwt";
import { LoginAdminDto } from '../admin/dto/login-admin.dto'

import { ConfigService } from '@nestjs/config';
import { Payload } from './passport/payload.interface';

@Injectable()
export class AdminAuthService {

    constructor(
        @InjectRepository(AdminsEntity) private adminRepository: Repository<AdminsEntity>,
        private jwtService: JwtService,
        private configService: ConfigService
      ) {};

    // 관리자 찾기 
async getAdminById  (loginId: string){
    return await this.adminRepository.findOne({where:{loginId: loginId}})
}

//admin 로그인 

async login(adminDto: LoginAdminDto) {
    const adminFind: AdminsEntity = await this.getAdminById(
      adminDto.loginId,
    );
    console.log('관리자 찾았쪙');

    if (!adminFind ||adminDto.loginPw !== adminFind.loginPw ) {
      throw new UnauthorizedException(
        '아이디 혹은 패스워드가 올바르지 않습니다.',
      );
    }

    const payload: Payload = {
      loginId: adminDto.loginId
    };

    const token = this.jwtService.sign(payload)

    //페이로드에 아이디와 이메일을 넣은 토큰 정보를 리턴
    return {
      accessToken: token,
      httpOnly: true,
      domain:'127.0.0.1',
      path: '/'
    };
  }

}

import {Body, Controller, Get, Put, Render, UseGuards} from '@nestjs/common';
import {CreateUserDto, JwtDecodeDto, UpdateUserDto} from './dto';
import { UserService } from './user.service';
import { UserEntity } from '../global/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('/api/user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const User = await this.userService.getUserInformation(userId);
    console.log('유저 정보', User);
    const data = {
      nickname: User.nickname,
      email: User.email,
      phone: User.phone,
      address: User.address,
    };
    return { data: data };
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/edit')
  async geteditInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const User = await this.userService.getUserInformation(userId);
    const data = {
      nickname: User.nickname,
      email: User.email,
      phone: User.phone,
      address: User.address,
    };
    return { data: data };
  }
  @Put('api/me/edit')
  @UseGuards(JwtAuthGuard)
  async editInformation(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = jwt.id;
    // TODO 2023.03.16 작업 할일

    await this.userService.updateUserInfomtaion(updateUserDto, userId);
  }
  @Get('/googleuser/edit')
  @UseGuards(JwtAuthGuard)
  async getGoogleInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const User = await this.userService.getUserInformation(userId);
    const data = {
      nickname: User.nickname,
      // email: User.email,
      phone: User.phone,
      address: User.address,
    };
    console.log('결과적으론 데이터가 리턴중', data);
    return { data: data };
  }


}

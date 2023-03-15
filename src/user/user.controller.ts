import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { CreateUserDto, JwtDecodeDto } from './dto';
import { UserService } from './user.service';
import { UserEntity } from '../global/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  @Get('/me')
  @Render('mypage.ejs')
  @UseGuards(JwtAuthGuard)
  async getInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
    console.log('아디쓰', jwt.id);
    const userId = jwt.id;
    const User = await this.userService.getUserInformation(userId);
    const data = {
      nickname: User.nickname,
      email: User.email,
      phone: User.phone,
      address: User.address,
    };
    console.log('결과적으론 데이터가 리턴중', data);
    return { data: data };
  }
}

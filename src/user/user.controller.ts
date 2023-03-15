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


}

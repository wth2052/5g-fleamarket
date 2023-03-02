import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';

// #TODO 복수형으로 바꾸기?
@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Post('/signup')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { nickname, email, password, phone, address } = dto;
    await this.UserService.createUser(
      nickname,
      email,
      password,
      phone,
      address,
    );
  }
}

import { Body, Controller, Post, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
// #TODO 복수형으로 바꾸기?
// TODO : 유저 비밀번호 확인
@Controller('users')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private authService: AuthService,
  ) {}

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

  @Post('/login')
  async login(
    @Body() userDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const jwt = await this.authService.validateUser(userDto);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }
}

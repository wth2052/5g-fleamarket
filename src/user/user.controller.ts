import { Body, Controller, Get, Put, Render, UseGuards } from '@nestjs/common';
import { CreateUserDto, JwtDecodeDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { UserEntity } from '../global/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cookies } from '../global/common/decorator/find-cookie.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OAuthAddInformationDto } from './dto/create-user.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
@Controller('/api/user')
@ApiTags('마이페이지 API')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: '마이페이지 정보 가져오기',
    description: '유저가 마이페이지 정보를 가져옵니다.',
  })
  @ApiOkResponse({ description: '마이페이지 정보 가져오기 성공.' })
  @ApiNotFoundResponse({ description: '마이페이지 정보 가져오기 실패.' })
  @UseGuards(JwtAuthGuard)
  async getInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
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
  @UseGuards(JwtAuthGuard)
  @Get('me/edit')
  @ApiOperation({
    summary: '마이페이지 정보 수정하기',
    description: '유저가 마이페이지 정보를 수정합니다.',
  })
  @ApiOkResponse({ description: '마이페이지 정보 수정하기 성공.' })
  @ApiNotFoundResponse({ description: '마이페이지 정보 수정하기 실패.' })
  async geteditInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const user = await this.userService.getUserInformation(userId);
    const data = {
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
    return { data: data };
  }
  @Put('me/edit')
  @ApiOperation({
    summary: '마이페이지 정보 수정하기',
    description: '유저가 마이페이지 정보를 수정합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async editInformation(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = jwt.id;
    // TODO 2023.03.16 작업 할일

    await this.userService.updateUserInformation(updateUserDto, userId);
  }
  @Put('google/edit')
  @UseGuards(JwtAuthGuard)
  async editGoogleInformation(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() updateUserDto: OAuthAddInformationDto,
  ) {
    const userId = jwt.id;
    // TODO 2023.03.16 작업 할일

    await this.userService.updateGoogleUserInformation(updateUserDto, userId);
  }
}

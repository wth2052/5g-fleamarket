import {
  Body,
  Controller,
  Get,
  Put,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './global/common/decorator/skip-auth.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Cookies } from './global/common/decorator/find-cookie.decorator';
import { JwtDecodeDto, UpdateUserDto } from './user/dto';
import { UserService } from './user/user.service';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Get()
  @Render('main.ejs')
  async main() {}

  @Public()
  @Get('login')
  @Render('login.ejs')
  async view() {
    return { name: 'peter', age: 28, job: 'software engineer' };
  }
  @Public()
  @Get('view/signup')
  @Render('signup.ejs')
  async viewSignup() {}
  @Get('order')
  @Render('order/order-layout.ejs')
  async index() {}

  @Get('product')
  @Render('main.ejs')
  async product() {}

  @Get('product/create')
  @Render('product-create.ejs')
  async productCreate() {}

  //TODO: 마이페이지에서 한번, 정보 수정에서 똑같은 로직이 한번씩 더 들어가는데 줄일 방법이 없을까?
  @Get('/me')
  @Render('mypage.ejs')
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
  //회원정보 수정
  @Get('/me/edit')
  @Render('mypage-edit.ejs')
  @UseGuards(JwtAuthGuard)
  async geteditInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
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
  @Put('/me/edit')
  @Render('mypage-edit.ejs')
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
  @Render('mypage-edit-google.ejs')
  @UseGuards(JwtAuthGuard)
  async getGoogleInformation(@Cookies('Authentication') jwt: JwtDecodeDto) {
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

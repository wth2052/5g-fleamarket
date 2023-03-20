import {
  Body,
  Controller,
  Get, Param,
  Post,
  Put,
  Render,
  Req,
  UseGuards
} from "@nestjs/common";
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

  @Get('order/mydeal')
  @Render('order/order-mydeal.ejs')
  async index() {}

  @Get('product')
  @Render('main.ejs')
  async product() {}

  @Get('product/create')
  @Render('product-create.ejs')
  async productCreate() {}

  //TODO: 마이페이지에서 한번, 정보 수정에서 똑같은 로직이 한번씩 더 들어가는데 줄일 방법이 없을까?
  @Get('me')
  @Render('mypage.ejs')
  async renderMyPage() {}

  //회원정보 수정
  @Get('/me/edit')
  @Render('mypage-edit.ejs')
  async renderEditMyPage() {}

  @Get('/googleuser/edit')
  @Render('mypage-edit-google.ejs')
  async getEditGoogleUserInformation() {}

  @Public()
  @Get('data')
  @Render('DummyData.ejs')
  async toy() {}

  @Public()
  @Post('seop/user')
  async seopUser() {
    await this.appService.seopUser();
    await this.appService.seopCate();
  }

  // @Public()
  // @Post('seop/cate')
  // async seopCate() {
  //   return await this.appService.seopCate();
  // }

  @Public()
  @Post('seop/product')
  async seopProductPhone() {
    await this.appService.seopProductPhone();
    await this.appService.seopOrder();
    await this.appService.seopLike();
    await this.appService.seopimg();
  }

  // @Public()
  // @Post('seop/order')
  // async seopOrder() {
  //   await this.appService.seopOrder();
  //   await this.appService.seopLike();
  //   await this.appService.seopimg();
  // }
  //
  // @Public()
  // @Post('seop/like')
  // async seopLike() {
  //   return await this.appService.seopLike();
  // }
  //
  // @Public()
  // @Post('seop/img')
  // async seopimg() {
  //   return await this.appService.seopimg();
  // }

  @Public()
  @Post('seop/admin')
  async seopAdmin() {
    await this.appService.seopAdmin();
    await this.appService.seopNotice();
    await this.appService.seoprepoter();
  }

  // @Public()
  // @Post('seop/noti')
  // async seopNotice() {
  //   return await this.appService.seopNotice();
  // }
  //
  // @Public()
  // @Post('seop/repo')
  // async seoprepoter() {
  //   return await this.appService.seoprepoter();
  // }
}

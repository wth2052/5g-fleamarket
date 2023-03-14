import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './global/common/decorator/skip-auth.decorator';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @Render('login.ejs')
  async view() {
    return { name: 'peter', age: 28, job: 'software engineer' };
  }

  @Get('order')
  @Render('order/order-layout.ejs')
  async index() {}

  @Get('mypage')
  @Render('mypage.ejs')
  async mypage() {}

  @Get('product')
  @Render('product-main.ejs')
  async product() {}

  @Get('product/create')
  @Render('product-create.ejs')
  async productCreate() {}

  @Public()
  @Get('product/detail')
  // @Render('product-create.ejs')
  async detail(@Query('productId') productId: number) {
    return await this.appService.prDetail(productId);
  }
}

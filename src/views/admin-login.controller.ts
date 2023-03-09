import { Controller, Get, Render } from '@nestjs/common';
import * as skipAuthDecorator from '../global/common/decorator/skip-auth.decorator';

@Controller('admin-login')
export class AdminLoginController {
  @skipAuthDecorator.Public()
  @Get()
  @Render('admin-login.ejs')
  async view() {
    return { name: 'peter', age: 28, job: 'software engineer' };
  }
}

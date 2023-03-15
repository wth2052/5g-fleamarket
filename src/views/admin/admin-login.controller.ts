import { Controller, Get, Render } from '@nestjs/common';
import { Public } from 'src/global/common/decorator/skip-auth.decorator';

// import * as skipAuthDecorator from 'src/global/common/decorator/skip-auth.decorator';

@Controller('admin/login')
@Public()
export class AdminLoginController {
  // @skipAuthDecorator.Public()
  
  @Get()
  @Render('admin/admin-login.ejs')
  async view() {
    return { name: 'peter', age: 28, job: 'software engineer' };
  }
}

import { Controller, Get, Render } from '@nestjs/common';
import { Public } from 'src/global/common/decorator/skip-auth.decorator';

@Public()
@Controller('view')
export class ViewController {
  @Get()
  @Render('login.ejs')
  async view() {
    return { name: 'peter', age: 28, job: 'soft' };
  }
  @Get('index')
  @Render('index.ejs')
  async index() {
    return { dddd: 1111 };
  }
}

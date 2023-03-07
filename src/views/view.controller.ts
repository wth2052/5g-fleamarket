import { Controller, Get, Render } from '@nestjs/common';
import {Public} from "../global/common/decorator/skip-auth.decorator";

@Controller('view')
export class ViewController {
  @Public()
  @Get()
  @Render('login.ejs')
  async view() {
    return { name: 'peter', age: 28, job: 'software engineer'};
  }
}
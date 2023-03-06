import { Controller, Get, Res, Req } from '@nestjs/common';
import { Public } from 'src/global/common/decorator/skip-auth.decorator';

@Public()
@Controller('view')
export class ViewController {
  @Get('main')
  render(@Req() req, @Res() res) {
    res.render('main', { title: 'Main' });
  }
}

import {
  Body,
  Catch,
  Controller,
  Get,
  HttpException,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtDecodeDto } from '../user/dto';
import { Cookies } from '../global/common/decorator/find-cookie.decorator';

import { Public } from '../global/common/decorator/skip-auth.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Catch(HttpException)
@Controller()
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private jwtService: JwtService,
  ) {}

  @Get('/report')
  @Render('report-create.ejs')
  async reportCreate() {}

  @Post('/report')
  createReport(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() data: CreateReportDto,
  ) {
    const userId = jwt.id;
    console.log(userId);
    return this.reportService.createReport(
      userId,
      data.reported,
      data.title,
      data.description,
    );
  }
}

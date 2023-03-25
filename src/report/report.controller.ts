import {
  Body,
  Catch,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
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
@Controller('/api')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private jwtService: JwtService,
  ) {}

  

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

  @Get('/notices')
  async getNotices(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const notices = await this.reportService.getNotices(limit, offset);
      const totalNotice = await this.reportService.getTotalNotice();
      return { notices, totalNotice };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  @Get('/notices/:noticeId')
  async getNoticeById(@Param('noticeId') noticeId: number) {
    return { notice: await this.reportService.getNoticeById(noticeId) };
  }

  @Get('/likes')
  async findMyLike(@Cookies('Authentication') jwt: JwtDecodeDto,) {
    const userId = jwt.id;
    const product = await this.reportService.findMyLike(userId)

    return { product };
  }


}

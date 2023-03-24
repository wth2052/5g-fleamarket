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
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Catch(HttpException)
@Controller('/api')
@UseGuards(JwtAuthGuard)
@ApiTags('신고하기 API')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private jwtService: JwtService,
  ) {}

  @Post('/report')
  @ApiOperation({
    summary: '신고하기',
    description: '유저가 불법유저를 신고합니다.',
  })
  @ApiOkResponse({ description: '신고하기 성공.' })
  createReport(
    @Cookies('Authentication') jwt: JwtDecodeDto,
    @Body() data: CreateReportDto,
  ) {
    const userId = jwt.id;
    return this.reportService.createReport(
      userId,
      data.reported,
      data.title,
      data.description,
    );
  }

  @Get('/notices')
  @ApiOperation({
    summary: '공지사항 목록보기',
    description: '유저가 공지사항 목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '공지사항 목록 확인.' })
  @ApiNotFoundResponse({ description: '공지사항이 없습니다.' })
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
  @ApiOperation({
    summary: '공지사항 상세보기',
    description: '유저가 공지사항 상세보기를 요청합니다.',
  })
  @ApiOkResponse({ description: '공지사항 상세보기 확인.' })
  @ApiNotFoundResponse({ description: '존재하지 않는 공지사항입니다.' })
  async getNoticeById(@Param('noticeId') noticeId: number) {
    return { notice: await this.reportService.getNoticeById(noticeId) };
  }

  @Get('/likes')
  @ApiOperation({
    summary: '좋아요 목록보기',
    description: '유저가 "좋아요" 목록을 요청합니다.',
  })
  @ApiOkResponse({ description: '좋아요 목록 확인.' })
  @ApiNotFoundResponse({ description: '찜하신 상품이 없습니다.' })
  async findMyLike(@Cookies('Authentication') jwt: JwtDecodeDto) {
    const userId = jwt.id;
    const product = await this.reportService.findMyLike(userId);

    return { product };
  }
}

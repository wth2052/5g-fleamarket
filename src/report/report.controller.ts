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
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Catch(HttpException)
@Controller('/api')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private jwtService: JwtService,
  ) {}

  

  @Post('/report')
  @ApiOperation({summary: '신고 접수',
  description: '신고하기 '})
  @ApiCreatedResponse({description: '새로운 신고가 접수됨'})
  @ApiBody({type: CreateReportDto})
  @ApiQuery({ 
    name: 'Authentication', 
    description: '관리자로 로그인하면 받는 액세스토큰',
    // schema: { .... },
    // type: JwtDecodeDto,
    required: true
  })
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
  @ApiOperation({summary: '공지목록 보여주기',
description: '등록된 모든 공지목록 보여주기'})
  @ApiOkResponse({
    description: '공지목록 불러오기'})
  @ApiNotFoundResponse({description: '공지가 존재하지 않음'})
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
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
  @ApiOperation({summary: '공지사항 상세 조회하기',
  description: '공지의 상세정보 보여줌'})
  @ApiOkResponse({description: '공지사항 상세정보를 불러옴'})
  @ApiNotFoundResponse({description: '공지가 존재하지 않음'})
  @ApiParam({name: 'noticeId', type: Number ,description: '공지 Id'})
  async getNoticeById(@Param('noticeId') noticeId: number) {
    return { notice: await this.reportService.getNoticeById(noticeId) };
  }

  @Get('/likes')
  @ApiOperation({summary: '관심목록 보여주기',
  description: '찜한 상품목록 보여주기'})
    @ApiOkResponse({
      description: '찜한 상품목록 불러오기'})
    @ApiNotFoundResponse({description: '찜한 상품이 존재하지 않음'})
    @ApiQuery({ 
      name: 'Authentication', 
      description: '관리자로 로그인하면 받는 액세스토큰',
      // schema: { .... },
      // type: JwtDecodeDto,
      required: true
    })
  async findMyLike(@Cookies('Authentication') jwt: JwtDecodeDto,) {
    const userId = jwt.id;
    const product = await this.reportService.findMyLike(userId)

    return { product };
  }


}

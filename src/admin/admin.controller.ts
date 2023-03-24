import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Render,
  Res,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  Catch,
  Query,
  Header,
} from '@nestjs/common';
import { AdminAuthGuard } from '../admin-auth/guards/admin-auth.guards';
import { Public } from '../global/common/decorator/skip-auth.decorator';
import { AdminService } from './admin.service';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminCookies } from './decorator/find-cookie.decorator';
import { catchError } from 'rxjs';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CheckReportDto } from './dto/check-report.dto';

@Catch(HttpException)
@Controller()
@ApiTags('관리자 API')
@Public()
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  // 상품정보 가져오기 API
  @Get('/admin/products')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-products.ejs')
  async getProducts(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const products = await this.adminService.getProducts(limit, offset);
      const totalProducts = await this.adminService.getTotalProducts();
      return { products, totalProducts };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }
  @Get('/api/admin/products')
  @ApiOperation({
    summary: '상품정보 가져오기',
    description: '유저가 등록한 상품정보를 가져옵니다.',
  })
  @ApiNotFoundResponse({ description: '상품이 존재하지 않습니다.' })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  async getProducts2(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const products = await this.adminService.getProducts(limit, offset);
      const totalProducts = await this.adminService.getTotalProducts();
      return { products, totalProducts };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //상품정보 상세보기 API
  @Get('/admin/products/:productId')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-productById.ejs')
  async getProductById(@Param('productId') productId: number) {
    // 원래: return await this.adminService.getProductById(productId)
    const result = await this.adminService.getProductById(productId);
    const product = result.product;
    const seller = result.seller;
    const category = result.category;
    const images = result.images;
    return { product, seller, category, images };
  }
  //상품 삭제 API
  @Delete('/api/admin/products/:productId')
  @ApiOperation({
    summary: '상품 삭제',
    description: '해당 상품을 삭제합니다.',
  })
  @ApiNotFoundResponse({ description: '상품이 삭제되었습니다.' })
  deleteProduct(@Param('productId') productId: number) {
    return this.adminService.deleteProduct(productId);
  }

  //회원정보 가져오기 API
  @Get('/users')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-users.ejs')
  async getUsers(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const users = await this.adminService.getUsers(limit, offset);
      const totalUsers = await this.adminService.getTotalUsers();
      return { users, totalUsers };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  @Get('/api/users')
  @ApiOperation({
    summary: '회원정보 가져오기',
    description: '유저회원정보를 가져옵니다.',
  })
  @ApiNotFoundResponse({ description: '회원정보가 존재하지 않습니다.' })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  async getUsers2(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    try {
      const users = await this.adminService.getUsers(limit, offset);
      const totalUsers = await this.adminService.getTotalUsers();
      return { users, totalUsers };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //회원정보 상세보기 API
  @Get('/users/:userId')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-userById.ejs')
  async getUserById(@Param('userId') userId: number) {
    return { user: await this.adminService.getUserById(userId) };
  }

  //회원정보 수정(블랙리스트) API
  @Put('/api/users/:userId')
  @ApiOperation({
    summary: '회원정보 수정',
    description: '유저회원정보를 수정합니다.',
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저입니다.' })
  @ApiUnauthorizedResponse({
    description: '이미 블랙리스트 처리된 유저입니다.',
  })
  async banUser(@Param('userId') userId: number, @Body() data: BanUserDto) {
    return await this.adminService.banUser(userId, data.ban);
  }

  //회원 삭제 API
  @Delete('/api/users/:userId')
  @ApiOperation({
    summary: '회원 삭제',
    description: '유저회원정보를 삭제합니다.',
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저입니다.' })
  async deleteUser(@Param('userId') userId: number) {
    return await this.adminService.deleteUser(userId);
  }

  //카테고리 조회 API
  @Get('/category')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-category.ejs')
  async getCategory(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const category = await this.adminService.getCategory(limit, offset);
      const totalcategory = await this.adminService.getTotalcategory();
      return { category, totalcategory };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  @Get('/api/category')
  @ApiOperation({
    summary: '카테고리 조회',
    description: '상품카테고리를 조회합니다.',
  })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  async getCategory2(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    try {
      const category = await this.adminService.getCategory(limit, offset);
      const totalcategory = await this.adminService.getTotalcategory();
      return { category, totalcategory };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //카테고리 생성 API
  @Get('/post/category')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-categoryPost.ejs')
  async viewCategory() {
    return { message: '카테고리 작성 페이지' };
  }

  @Post('/api/category')
  @ApiOperation({
    summary: '카테고리 생성',
    description: '상품카테고리를 생성합니다.',
  })
  @ApiNotFoundResponse({ description: '카테고리가 생성되었습니다.' })
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.adminService.createCategory(data.name);
  }

  //카테고리 수정 API
  @Put('/api/category/:id')
  @ApiOperation({
    summary: '카테고리 수정',
    description: '상품카테고리를 수정합니다.',
  })
  @ApiNotFoundResponse({ description: '내용이 비어있습니다.' })
  async updateCategory(
    @Param('id') categoryId: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return await this.adminService.updateCategory(categoryId, data.name);
  }

  //카테고리 삭제 API
  @Delete('/api/category/:id')
  @ApiOperation({
    summary: '카테고리 삭제',
    description: '상품카테고리를 삭제합니다.',
  })
  deleteCategory(@Param('id') categoryId: number) {
    return this.adminService.deleteCategory(categoryId);
  }

  //공지사항 모두 조회

  @Get('/notice')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-notices.ejs')
  async getNotices(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const notices = await this.adminService.getNotices(limit, offset);
      const totalNotice = await this.adminService.getTotalNotice();
      return { notices, totalNotice };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  @Get('/api/notice')
  @ApiOperation({
    summary: '공지사항 조회',
    description: '관리자가 작성한 공지사항을 조회합니다.',
  })
  @ApiNotFoundResponse({ description: '공지사항이 없습니다.' })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  async getNotices2(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const notices = await this.adminService.getNotices(limit, offset);
      const totalNotice = await this.adminService.getTotalNotice();
      return { notices, totalNotice };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //공지사항 상세조회

  @Get('/notice/:noticeId')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-noticeById.ejs')
  async getNoticeById(@Param('noticeId') noticeId: number) {
    return { notice: await this.adminService.getNoticeById(noticeId) };
  }

  //공지사항 작성
  @Get('/post/notice')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-noticePost.ejs')
  async viewNotice() {
    return { message: '공지작성 페이지' };
  }

  @Post('/api/notice')
  @ApiOperation({
    summary: '공지사항 생성',
    description: '관리자가 공지사항을 생성합니다.',
  })
  @ApiNotFoundResponse({ description: '작성한 내용이 없습니다.' })
  async createNotice(
    @Body() data: CreateNoticeDto,
    @AdminCookies('accessToken') jwt: string,
  ) {
    const decodeToken = this.jwtService.decode(jwt, { json: true }) as {
      id: number;
    };
    const adminId = decodeToken.id;

    return await this.adminService.createNotice(
      adminId,
      data.title,
      data.description,
    );
  }

  //공지사항 수정
  @Put('/api/notice/:noticeId')
  @ApiOperation({
    summary: '공지사항 수정',
    description: '관리자가 작성한 공지사항을 수정합니다.',
  })
  @ApiNotFoundResponse({ description: '작성한 내용이 없습니다.' })
  async updateNotice(
    @Param('noticeId') noticeId: number,
    @Body() data: UpdateNoticeDto,
  ) {
    return await this.adminService.updateNotice(
      noticeId,
      data.title,
      data.description,
    );
  }

  //공지사항 삭제
  @Delete('/api/notice/:noticeId')
  @ApiOperation({
    summary: '공지사항 삭제',
    description: '관리자가 작성한 공지사항을 삭제합니다.',
  })
  deleteNotice(@Param('noticeId') noticeId: number) {
    return this.adminService.deleteNotice(noticeId);
  }

  // 상품검색

  @Get('/api/admin/productSearch')
  @ApiOperation({
    summary: '상품 검색',
    description: '유저가 등록한 상품을 검색합니다.',
  })
  @ApiNotFoundResponse({ description: '검색한 상품이 없습니다.' })
  async productSearch(@Query('search') search: string) {
    const product = await this.adminService.productSearch(search);
    return { data: product };
  }

  //회원검색

  @Get('/api/userSearch')
  @ApiOperation({
    summary: '회원 검색',
    description: '관리자가 회원을 검색합니다.',
  })
  @ApiNotFoundResponse({ description: '검색한 회원이 없습니다.' })
  async userSearch(@Query('search') search: string) {
    const user = await this.adminService.userSearch(search);
    return { data: user };
  }

  //카테고리 검색

  @Get('/api/categorySearch')
  @ApiOperation({
    summary: '카테고리 검색',
    description: '관리자가 카테고리를 검색합니다.',
  })
  @ApiNotFoundResponse({ description: '검색한 카테고리가 없습니다.' })
  async categorySearch(@Query('search') search: string) {
    const category = await this.adminService.categorySearch(search);
    return { data: category };
  }

  //공지 검색

  @Get('/api/noticeSearch')
  @ApiOperation({
    summary: '공지 검색',
    description: '관리자가 공지를 검색합니다.',
  })
  @ApiNotFoundResponse({ description: '검색한 공지가 없습니다.' })
  async noticeSearch(@Query('search') search: string) {
    const notice = await this.adminService.noticeSearch(search);
    return { data: notice };
  }
  //신고 검색

  @Get('/api/reportSearch')
  @ApiOperation({
    summary: '신고 검색',
    description: '관리자가 유저가 신고한 내역을 검색합니다.',
  })
  @ApiNotFoundResponse({ description: '검색한 신고 내역이 없습니다.' })
  async reportSearch(@Query('search') search: string) {
    const report = await this.adminService.reportSearch(search);
    return { data: report };
  }

  // 블랙리스트 모아보기
  @Get('/api/ban/users')
  @ApiOperation({
    summary: '블랙리스트 모아보기',
    description: '블랙리스트 명단을 출력합니다.',
  })
  @ApiNotFoundResponse({ description: '블랙리스트 회원이 없습니다.' })
  async getBanUsers() {
    try {
      return { banUsers: await this.adminService.getBanUsers() };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }
  //신고 목록 보기
  @Get('/reports')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-reports.ejs')
  async getReports(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const reports = await this.adminService.getReports(limit, offset);
      // const reportsUnchecked = await this.adminService.getUncheckedReports(limit, offset)
      // const reportsChecked = await this.adminService.getCheckedReports(limit, offset)
      const totalReports = await this.adminService.getTotalReports();
      return { reports, totalReports };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  @Get('/api/reports')
  @ApiOperation({
    summary: '신고 목록 보기',
    description: '유저가 신고한 목록을 보여줍니다.',
  })
  @ApiNotFoundResponse({ description: '접수된 신고 내역이 없습니다.' })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
  async getReports2(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    try {
      const reports = await this.adminService.getReports(limit, offset);
      // const Uncheckedreports = await this.adminService.getUncheckedReports(limit, offset)
      // const Checkedreports = await this.adminService.getCheckedReports(limit, offset)
      const totalReports = await this.adminService.getTotalReports();
      return { reports, totalReports };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //신고 상세보기 API
  @Get('/reports/:reportId')
  @ApiOperation({
    summary: 'Render',
    description: 'Render',
  })
  @Render('admin/admin-reportById.ejs')
  async getReportById(@Param('reportId') reportId: number) {
    const result = await this.adminService.getReportById(reportId);
    const report = result.report;
    const reporter = result.reporter;
    return { report, reporter };
  }

  //신고 수정 (확인하기)
  @Put('/api/reports/:reportId')
  @ApiOperation({
    summary: '신고 확인하기',
    description: '관리자가 신고내용을 확인합니다.',
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 신고입니다.' })
  @ApiUnauthorizedResponse({ description: '이미 확인된 신고입니다.' })
  async checkReport(
    @Param('reportId') reportId: number,
    @Body() data: CheckReportDto,
  ) {
    return await this.adminService.checkReport(
      reportId,
      data.status,
      data.reported,
    );
  }

  //확인된 신고 모아보기
  @Get('/api/checked/reports')
  @ApiOperation({
    summary: '확인된 신고 모아보기',
    description: '관리자가 확인한 신고 목록을 보여줍니다.',
  })
  @ApiNotFoundResponse({ description: '확인된 신고 내역이 없습니다.' })
  async getCheckedreports() {
    try {
      const checkedReports = await this.adminService.getCheckedReports();
      return { checkedReports };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //확인이 되지 않은 신고 모아보기
  @Get('/api/unchecked/reports')
  @ApiOperation({
    summary: '확인이 되지 않은 신고 모아보기',
    description: '관리자가 확인하지 않은 신고 목록을 보여줍니다.',
  })
  @ApiNotFoundResponse({ description: '모든 신고가 확인되었습니다.' })
  async getUncheckedreports() {
    try {
      const uncheckedReports = await this.adminService.getUncheckedReports();
      return { uncheckedReports };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  //신고 삭제하기
  @Delete('/api/reports/:reportId')
  @ApiOperation({
    summary: '신고 삭제하기',
    description: '괸리자가 신고를 삭제합니다.',
  })
  deleteReport(@Param('reportId') reportId: number) {
    return this.adminService.deleteReport(reportId);
  }
}

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
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
  @ApiOperation({summary: '상품목록 보여주기 페이지 ',
description: '상품목록 보여주기 페이지 랜더링'})
  @ApiOkResponse({
    description: '상품 목록 불러오기'})
  @ApiNotFoundResponse({description: '상품이 존재하지 않음'})
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
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
  @ApiOperation({summary: '상품목록 보여주기',
description: '등록된 모든 상품목록 보여주기'})
  @ApiOkResponse({
    description: '상품 목록 불러오기'})
  @ApiNotFoundResponse({description: '상품이 존재하지 않음'})
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
  @ApiOperation({summary: '상품상세 보여주기',
  description: '상품의 상세정보 보여주기'})
  @ApiOkResponse({description: '상품정보 상세 보여줌'})
  @ApiNotFoundResponse({description: '상품이 존재하지 않음'})
  @ApiParam({name: 'productId', type: Number ,description: '상품 Id'})
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
  @ApiOperation({summary: '상품 삭제하기',
  description: '상품을 완전히 삭제함'})
  @ApiOkResponse({description: '상품 삭제'})
  @ApiParam({name: 'productId', type: Number ,description: '상품 Id'})
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
  @ApiOperation({summary: '회원목록 보여주기 페이지 ',
  description: '회원목록 보여주기 페이지 랜더링'})
  @ApiOkResponse({description: '회원목록 불러오기'})
  @ApiNotFoundResponse({description: '회원이 존재하지 않음'})

  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
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
  @ApiOperation({summary: '회원목록 보여주기 ',
  description: '가입한 모든 회원목록 보여주기'})
  @ApiOkResponse({description: '회원목록 불러오기'})
  @ApiNotFoundResponse({description: '회원이 존재하지 않음'})
  
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
  @ApiOperation({summary: '회원상세 보여주기',
  description: '회원의 상세정보 보여주기'})
  @ApiOkResponse({description: '회원정보 상세 보여줌'})
  @ApiNotFoundResponse({description: '회원이 존재하지 않음'})
  @ApiParam({name: 'userId', type: Number ,description: '회원 Id'})

  async getUserById(@Param('userId') userId: number) {
    return { user: await this.adminService.getUserById(userId) };
  }

  //회원정보 수정(블랙리스트) API
  @Put('/api/users/:userId')
  @ApiOperation({summary: '회원정보 수정(블랙리스트)',
  description: '회원 블랙리스트 처리'})
  @ApiOkResponse({description: '회원이 블랙리스트 처리 됨'})
  @ApiNotFoundResponse({description: '회원이 존재하지 않음'})
  @ApiUnauthorizedResponse({description: '이미 블랙리스트 처리된 회원'})
  @ApiParam({name: 'userId', type: Number ,description: '회원 Id'})
  @ApiBody({type: BanUserDto})
  async banUser(@Param('userId') userId: number, @Body() data: BanUserDto) {
    return await this.adminService.banUser(userId, data.ban);
  }

  //회원 삭제 API
  @Delete('/api/users/:userId')
  @ApiOperation({summary: '회원정보 삭제',
  description: '회원정보를 완전히 삭제함'})
  @ApiOkResponse({description: '회원정보가 삭제됨'})
  @ApiNotFoundResponse({description: '회원이 이미 존재하지 않음'})
  @ApiParam({name: 'userId', type: Number ,description: '회원 Id'})
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
  @ApiOperation({summary: '카테고리 목록 보여주기 페이지 ',
  description: '카테고리 목록 보여주기 페이지 랜더링'})
  @ApiOkResponse({
      description: '카테고리 목록 불러오기'})
  @ApiNotFoundResponse({description: '카테고리가 존재하지 않음'})

  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
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
  @ApiOperation({summary: '카테고리 목록 보여주기',
  description: '등록된 모든 카테고리 목록 보여주기'})
  @ApiOkResponse({
      description: '카테고리 목록 불러오기'})
  @ApiNotFoundResponse({description: '카테고리가 존재하지 않음'})
  
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
  @ApiOperation({summary: '카테고리 생성 페이지',
description: '카테고리 생성 페이지 랜더링'})
  @ApiOkResponse({description: '카테고리 생성 페이지 띄워줌'})
  async viewCategory() {
    return { message: '카테고리 작성 페이지' };
  }

  @Post('/api/category')
  @ApiOperation({summary: '카테고리 생성',
  description: '새로운 카테고리를 생성함'})
  @ApiCreatedResponse({description: '새로운 카테고리가 생성됨'})
  @ApiNotFoundResponse({description: '카테고리 입력란이 비어있음'})
  @ApiBody({type: CreateCategoryDto})
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.adminService.createCategory(data.name);
  }

  //카테고리 수정 API
  @Put('/api/category/:id')
  @ApiOperation({summary: '카테고리 수정',
  description: '카테고리를 수정함'})
  @ApiCreatedResponse({description: '카테고리 이름이 수정됨'})
  @ApiNotFoundResponse({description: '카테고리 입력란이 비어있음'})
  @ApiParam({name: 'categoryId', type: Number ,description: '카테고리 Id'})
  @ApiBody({type: UpdateCategoryDto})
  async updateCategory(
    @Param('id') categoryId: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return await this.adminService.updateCategory(categoryId, data.name);
  }

  //카테고리 삭제 API
  @Delete('/api/category/:id')
  @ApiOperation({summary: '카테고리 삭제',
  description: '카테고리를 완전히 삭제함'})
  @ApiOkResponse({description: '카테고리가 삭제됨'})
  @ApiParam({name: 'categoryId', type: Number ,description: '카테고리 Id'})
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
  @ApiOperation({summary: '공지목록 보여주기 페이지 ',
description: '공지목록 보여주기 페이지 랜더링'})
  @ApiOkResponse({
    description: '공지 목록 불러오기'})
  @ApiNotFoundResponse({description: '공지가 존재하지 않음'})
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
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
  @ApiOperation({summary: '공지목록 보여주기',
description: '등록된 모든 공지목록 보여주기'})
  @ApiOkResponse({
    description: '공지목록 불러오기'})
  @ApiNotFoundResponse({description: '공지가 존재하지 않음'})
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
  @ApiOperation({summary: '공지사항 상세 조회하기',
  description: '공지의 상세정보 보여줌'})
  @ApiOkResponse({description: '공지사항 상세정보를 불러옴'})
  @ApiNotFoundResponse({description: '공지가 존재하지 않음'})
  @ApiParam({name: 'noticeId', type: Number ,description: '공지 Id'})
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
  @ApiOperation({summary: '공지사항 생성 페이지',
description: '공지사항 생성 페이지 랜더링'})
  @ApiOkResponse({description: '공지사항 생성 페이지 띄워줌'})
  async viewNotice() {
    return { message: '공지작성 페이지' };
  }

  @Post('/api/notice')
  @ApiOperation({summary: '공지사항 생성',
  description: '새로운 공지를 생성함'})
  @ApiCreatedResponse({description: '새로운 공지가 생성됨'})
  @ApiNotFoundResponse({description: '공지 제목이나 내용 입력란이 비어있음'})
  @ApiUnauthorizedResponse({description: '존재하는 관리자가 아니여서 공지 생성을 할 수 없음'})
  @ApiBody({type: CreateNoticeDto})
  @ApiQuery({ 
    name: 'accessToken', 
    description: '관리자로 로그인하면 받는 액세스토큰',
    // schema: { .... },
    type: 'string',
    required: true
  })
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
  @ApiOperation({summary: '공지사항 수정',
  description: '공지사항를 수정함'})
  @ApiCreatedResponse({description: '공지사항 제목이나 내용이 수정됨'})
  @ApiNotFoundResponse({description: '공지사항 제목이나 내용 입력란이 비어있음'})
  @ApiParam({name: 'noticeId', type: Number ,description: '공지 Id'})
  @ApiBody({type: UpdateNoticeDto})
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
  @ApiOperation({summary: '공지 삭제',
  description: '공지를 완전히 삭제함'})
  @ApiOkResponse({description: '공지가 삭제됨'})
  @ApiParam({name: 'noticeId', type: Number ,description: '공지 Id'})
  deleteNotice(@Param('noticeId') noticeId: number) {
    return this.adminService.deleteNotice(noticeId);
  }

  // 상품검색

  @Get('/api/admin/productSearch')
  @ApiOperation({summary: '상품 검색',
  description: '검색한 단어에 해당하는 제목을 가진 상품 목록을 보여줌'})
    @ApiOkResponse({
      description: '검색한 상품 목록을 보여줌'})
    @ApiNotFoundResponse({description: '검색어란이 비어있음'})
    @ApiNotFoundResponse({description: '검색한 상품이 없음'})
    @ApiQuery({ name: 'search', type: 'string', required: true })
    @ApiInternalServerErrorResponse({description: '서버 에러'})
  async productSearch(@Query('search') search: string) {
    const product = await this.adminService.productSearch(search);
    return { data: product };
  }

  //회원검색

  @Get('/api/userSearch')
  @ApiOperation({summary: '회원 검색',
  description: '검색한 단어에 해당하는 닉네임을 가진 회원 목록을 보여줌'})
    @ApiOkResponse({
      description: '검색한 회원 목록을 보여줌'})
    @ApiNotFoundResponse({description: '검색어란이 비어있음'})
    @ApiNotFoundResponse({description: '검색한 회원이 없음'})
    @ApiQuery({ name: 'search', type: 'string', required: true })
    @ApiInternalServerErrorResponse({description: '서버 에러'})
  async userSearch(@Query('search') search: string) {
    const user = await this.adminService.userSearch(search);
    return { data: user };
  }

  //카테고리 검색

  @Get('/api/categorySearch')
  @ApiOperation({summary: '카테고리 검색',
  description: '검색한 단어에 해당하는 이름을 가진 카테고리 목록을 보여줌'})
    @ApiOkResponse({
      description: '검색한 카테고리 목록을 보여줌'})
    @ApiNotFoundResponse({description: '검색어란이 비어있음'})
    @ApiNotFoundResponse({description: '검색한 카테고리가 없음'})
    @ApiQuery({ name: 'search', type: 'string', required: true })
    @ApiInternalServerErrorResponse({description: '서버 에러'})
  async categorySearch(@Query('search') search: string) {
    const category = await this.adminService.categorySearch(search);
    return { data: category };
  }

  //공지 검색

  @Get('/api/noticeSearch')
  @ApiOperation({summary: '공지 검색',
  description: '검색한 단어에 해당하는 제목을 가진 공지 목록을 보여줌'})
    @ApiOkResponse({
      description: '검색한 공지 목록을 보여줌'})
    @ApiNotFoundResponse({description: '검색어란이 비어있음'})
    @ApiNotFoundResponse({description: '검색한 공지가 없음'})
    @ApiQuery({ name: 'search', type: 'string', required: true })
    @ApiInternalServerErrorResponse({description: '서버 에러'})
  async noticeSearch(@Query('search') search: string) {
    const notice = await this.adminService.noticeSearch(search);
    return { data: notice };
  }
  //신고 검색

  @Get('/api/reportSearch')
  @ApiOperation({summary: '신고 검색',
  description: '검색한 단어에 해당하는 제목을 가진 신고 목록을 보여줌'})
    @ApiOkResponse({
      description: '검색한 신고 목록을 보여줌'})
    @ApiNotFoundResponse({description: '검색어란이 비어있음'})
    @ApiNotFoundResponse({description: '검색한 신고가 없음'})
    @ApiQuery({ name: 'search', type: 'string', required: true })
    @ApiInternalServerErrorResponse({description: '서버 에러'})
  async reportSearch(@Query('search') search: string) {
    const report = await this.adminService.reportSearch(search);
    return { data: report };
  }

  // 블랙리스트 모아보기
  @Get('/api/ban/users')
  @ApiOperation({summary: '블랙리스트 목록 보여주기',
description: '블랙리스트 처리된 회원 목록 보여주기'})
  @ApiOkResponse({
    description: '블랙리스트 회원 목록 불러오기'})
  @ApiNotFoundResponse({description: '블랙리스트 회원이 존재하지 않음'})
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
  @ApiOperation({summary: '신고목록 보여주기 페이지 ',
description: '신고목록 보여주기 페이지 랜더링'})
  @ApiOkResponse({
    description: '신고 목록 불러오기'})
  @ApiNotFoundResponse({description: '신고가 존재하지 않음'})
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false })
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
  @ApiOperation({summary: '신고목록 보여주기',
description: '등록된 모든 신고목록 보여주기'})
  @ApiOkResponse({
    description: '신고목록 불러오기'})
  @ApiNotFoundResponse({description: '신고가 존재하지 않음'})
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
  @ApiOperation({summary: '신고 상세 조회하기',
  description: '신고의 상세정보 보여줌'})
  @ApiOkResponse({description: '신고 상세정보를 불러옴'})
  @ApiNotFoundResponse({description: '신고가 존재하지 않음'})
  @ApiParam({name: 'reportId', type: Number ,description: '신고 Id'})
  async getReportById(@Param('reportId') reportId: number) {
    const result = await this.adminService.getReportById(reportId);
    const report = result.report;
    const reporter = result.reporter;
    return { report, reporter };
  }

  //신고 수정 (확인하기)
  @Put('/api/reports/:reportId')
  @ApiOperation({summary: '신고 수정(확인하기)',
  description: '신고 확인하기'})
  @ApiOkResponse({description: '신고가 확인 됨'})
  @ApiNotFoundResponse({description: '신고가 존재하지 않음'})
  @ApiUnauthorizedResponse({description: '이미 확인된 신고'})
  @ApiParam({name: 'reportId', type: Number ,description: '신고 Id'})
  @ApiBody({type: CheckReportDto})
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
  @ApiOperation({summary: '확인된 신고목록 보여주기',
  description: '확인된 신고목록 보여주기'})
    @ApiOkResponse({
      description: '확인된 신고 목록 불러오기'})
    @ApiNotFoundResponse({description: '확인된 신고가 존재하지 않음'})
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
  @ApiOperation({summary: '확인안된 신고 목록 보여주기',
  description: '확인안된 신고 목록 보여주기'})
    @ApiOkResponse({
      description: '확인안된 신고 목록 불러오기'})
    @ApiNotFoundResponse({description: '블확인안된 신고가 존재하지 않음'})
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
  @ApiOperation({summary: '신고 삭제',
  description: '신고를 완전히 삭제함'})
  @ApiOkResponse({description: '신고가 삭제됨'})
  @ApiParam({name: 'reportId', type: Number ,description: '신고 Id'})
  deleteReport(@Param('reportId') reportId: number) {
    return this.adminService.deleteReport(reportId);
  }
}

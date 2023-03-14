import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Render, Res, NotFoundException, UnauthorizedException, HttpException, Catch, Query, Header} from '@nestjs/common';
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
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Catch(HttpException)
@Controller()
@Public()
@UseGuards(AdminAuthGuard)


export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService,
  ) {}


  // 상품정보 가져오기 API
  @Get('/products')
  @Render('admin/admin-products.ejs')
  async getProducts(
    @Query('limit') limit: number =10,
    @Query('offset') offset: number = 0,
  ) {
    try{ 
      const products = await this.adminService.getProducts(limit, offset)
      const totalProducts = await this.adminService.getTotalProducts();
      return {products, totalProducts}
    
    }
    catch (error) {
       return { errorMessage: error.message };
    }
  }

  @Get('/api/products')
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false})
  async getProducts2(
    @Query('limit') limit: number ,
    @Query('offset') offset: number ,
  ) {
    try{ 
      const products = await this.adminService.getProducts(limit, offset)
      const totalProducts = await this.adminService.getTotalProducts();
      return {products, totalProducts}
    
    }
    catch (error) {
       return { errorMessage: error.message };
    }
  }
  

  //상품정보 상세보기 API
  @Get('/products/:productId')
  @Render('admin/admin-productById.ejs')
  async getProductById(
    @Param('productId') productId: number,
    
  ) {

       // 원래: return await this.adminService.getProductById(productId)
  const result = await this.adminService.getProductById(productId)
  const product = result.product
  const seller = result.seller
  const category = result.category
    return {product, seller, category}
    }


  //상품 삭제 API
  @Delete('/products/:productId')
  deleteProduct(@Param('productId') productId: number) {
    return this.adminService.deleteProduct(productId);
  }

  //회원정보 가져오기 API
  @Get('/users')
  @Render('admin/admin-users.ejs')
  async getUsers(
    @Query('limit') limit: number =10,
    @Query('offset') offset: number = 0,
  ) {try{
    const users = await this.adminService.getUsers(limit, offset)
    const totalUsers = await this.adminService.getTotalUsers();
    return {users, totalUsers} 
  }
  catch (error) {
    return { errorMessage: error.message };
  }
  }

  @Get('/api/users')
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false})
  async getUsers2(
    @Query('limit') limit: number ,
    @Query('offset') offset: number ,
  ) {try{
    const users = await this.adminService.getUsers(limit, offset)
    const totalUsers = await this.adminService.getTotalUsers();
    return {users, totalUsers} 
  }
  catch (error) {
    return { errorMessage: error.message };
  }
  }

  //회원정보 상세보기 API
  @Get('/users/:userId')
  @Render('admin/admin-userById.ejs')
  async getUserById(@Param('userId') userId: number) {
    return { user: await this.adminService.getUserById(userId) };
  }

  //회원정보 수정(블랙리스트) API
  @Put('/users/:userId')
  async banUser(@Param('userId') userId: number, @Body() data: BanUserDto) {
    return await this.adminService.banUser(userId, data.ban);
  }

  //회원 삭제 API
  @Delete('/users/:userId')
  async deleteUser(@Param('userId') userId: number) {
    return await this.adminService.deleteUser(userId);
  }

  //카테고리 조회 API
  @Get('/category')
  @Render('admin/admin-category.ejs')
  async getCategory(
    @Query('limit') limit: number =10,
    @Query('offset') offset: number = 0,
  ) {
    try {
      const category = await this.adminService.getCategory(limit, offset)
      const totalcategory= await this.adminService.getTotalcategory();
    return {category, totalcategory} 
  }
  catch (error) {
    return { errorMessage: error.message };
  }
  }

  @Get('/api/category')
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false})
  async getCategory2(
    @Query('limit') limit: number ,
    @Query('offset') offset: number ,
  ) {
    try {
      const category = await this.adminService.getCategory(limit, offset)
      const totalcategory= await this.adminService.getTotalcategory();
    return {category, totalcategory} 
  }
  catch (error) {
    return { errorMessage: error.message };
  }
  }

  //카테고리 생성 API
  @Get('/post/category')
  @Render('admin/admin-categoryPost.ejs')
  async viewCategory(){
    return {message: "카테고리 작성 페이지"}
  }

  @Post('/category')
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.adminService.createCategory(data.name);
  }

  //카테고리 수정 API
  @Put('/category/:id')
  async updateCategory(
    @Param('id') categoryId: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return await this.adminService.updateCategory(categoryId, data.name);
  }

  //카테고리 삭제 API
  @Delete('/category/:id')
  deleteCategory(@Param('id') categoryId: number) {
    return this.adminService.deleteCategory(categoryId);
  }

  //공지사항 모두 조회

  @Get('/notice')
  @Render('admin/admin-notices.ejs')
  async getNotices(
    @Query('limit') limit: number =10,
    @Query('offset') offset: number = 0,
  ) 
  {
   try {
    const notices = await this.adminService.getNotices(limit, offset)
    const totalNotice = await this.adminService.getTotalNotice();
      return {notices, totalNotice}
    }
  catch (error) {
    return  {errorMessage: error.message} 
  }
  }

  @Get('/api/notice')
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ApiQuery({ name: 'offset', type: Number, example: 0, required: false})
  async getNotices2(
    @Query('limit') limit: number =10,
    @Query('offset') offset: number = 0,
  ) 
  {
   try {
    const notices = await this.adminService.getNotices(limit, offset)
    const totalNotice = await this.adminService.getTotalNotice();
      return {notices, totalNotice}
    }
  catch (error) {
    return  {errorMessage: error.message} 
  }
  }

  //공지사항 상세조회

  @Get('/notice/:noticeId')
  @Render('admin/admin-noticeById.ejs')
  async getNoticeById(@Param('noticeId') noticeId: number) {
    return { notice: await this.adminService.getNoticeById(noticeId) };
  }

  //공지사항 작성
  @Get('/post/notice')
  @Render('admin/admin-noticePost.ejs')
  async viewNotice(){
    return {message: "공지작성 페이지"}
  }
  @Post('/notice')
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
  @Put('/notice/:noticeId')
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
  @Delete('/notice/:noticeId')
  deleteNotice(@Param('noticeId') noticeId: number) {
    return this.adminService.deleteNotice(noticeId);
  }

// 상품검색

@Get('productSearch')
async productSearch(@Query('search') search: string) {
  const product = await this.adminService.productSearch(search);
  return { data : product };
}


//회원검색

@Get('userSearch')
async userSearch(@Query('search') search: string) {
  const user = await this.adminService.userSearch(search);
  return { data : user };
}

//카테고리 검색


@Get('categorySearch')
async categorySearch(@Query('search') search: string) {
  const category = await this.adminService.categorySearch(search);
  return { data : category };
}

//공지 검색

@Get('noticeSearch')
async noticeSearch(@Query('search') search: string) {
  const notice = await this.adminService.noticeSearch(search);
  return { data : notice };
}

// 블랙리스트 모아보기 
@Get('ban/users')
async getBanUsers(){
  try {
    return {banUsers: await this.adminService.getBanUsers()}
  }
catch (error) {
  return  {errorMessage: error.message} 
}
}

}



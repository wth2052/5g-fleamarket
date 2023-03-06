import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req} from '@nestjs/common';

import { AdminAuthGuard } from '../admin-auth/guards/admin-auth.guards';
import { Public } from '../global/common/decorator/skip-auth.decorator';
import { AdminService } from './admin.service';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtService } from '@nestjs/jwt';

@Controller()
@Public()
@UseGuards(AdminAuthGuard)

export class AdminController {
    constructor(private readonly adminService: AdminService,
        private jwtService: JwtService) {}

// 상품정보 가져오기 API
@Get('/products')
async getProducts(){
    return await this.adminService.getProducts();
}

//상품정보 상세보기 API
@Get('/products/:productId')
async getProductById(@Param('productId') productId: number){
    return await this.adminService.getProductById(productId);
}

//상품 삭제 API
@Delete('/products/:productId')
deleteProduct(@Param('productId') productId: number){
    return this.adminService.deleteProduct(productId);
}

//회원정보 가져오기 API
@Get('/users')
async getUsers(){
    return await this.adminService.getUsers();
}

//회원정보 상세보기 API
@Get('/users/:userId')
async getUserById(@Param('userId') userId: number){
     return await this.adminService.getUserById(userId);
}

//회원정보 수정(블랙리스트) API
@Put('/users/:userId')
async banUser(
    @Param('userId') userId: number,
    @Body() data: BanUserDto
){
    return await this.adminService.banUser(userId, data.ban);
}

//회원 삭제 API
@Delete('/users/:userId')
deleteUser(@Param('userId') userId: number){
    return this.adminService.deleteUser(userId);
}

//카테고리 조회 API
@Get('/category')
async getCategory(){
    return await this.adminService.getCategory();
}

//카테고리 생성 API
@Post('/category')
createCategory(@Body() data: CreateCategoryDto){
    return this.adminService.createCategory(data.name);
}

//카테고리 수정 API
@Put('/category/:id')
async updateCategory(
    @Param('id') categoryId: number,
    @Body() data:UpdateCategoryDto
    ){
    return await this.adminService.updateCategory(categoryId,data.name);
}

//카테고리 삭제 API 
@Delete('/category/:id')
deleteCategory(@Param('id') categoryId: number){
    return this.adminService.deleteCategory(categoryId);
}

//공지사항 모두 조회 

@Get('/notice')
async getNotices(){
    return await this.adminService.getNotices();
}

//공지사항 상세조회 

@Get('/notice/:noticeId')
async getNoticeById(@Param('noticeId') noticeId: string){
    return await this.adminService.getNoticeById(noticeId);
}

//공지사항 작성

@Post('/notice/:adminId')
async createNotice(
    @Param('adminId') adminId: number,
    @Body() data:CreateNoticeDto,
){
    return await this.adminService.createNotice(adminId, data.title, data.description);
}

//공지사항 수정 
@Put('/notice/:noticeId')
async updateNotice(
    @Param('noticeId') noticeId: string,
    @Body() data:UpdateNoticeDto
    ){
    return await this.adminService.updateNotice(noticeId, data.title, data.description);
}

//공지사항 삭제
@Delete('/notice/:noticeId')
deleteNotice(@Param('noticeId') noticeId: string){
    return this.adminService.deleteNotice(noticeId);
}
}

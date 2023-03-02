import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { AdminsEntity } from 'src/global/entities/admins.entity';
import { CategoriesEntity } from 'src/global/entities/categories.entity';
import { NoticesEntity } from 'src/global/entities/notices.entity';
import { ProductsEntity } from 'src/global/entities/products.entity';
import { UserEntity } from 'src/global/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProductsEntity) private productRepository: Repository<ProductsEntity>,
        @InjectRepository(CategoriesEntity) private categoryRepository: Repository<CategoriesEntity>,
        // @InjectRepository(AdminsEntity) private adminRepository: Repository<AdminsEntity>,
        @InjectRepository(NoticesEntity) private noticeRepository: Repository<NoticesEntity>
      ) {};
    
    
// 상품정보 가져오기 API
async getProducts(loginId: string , loginPw:string) {
 return await this.productRepository.find();
}

//상품정보 상세보기 API
async getProductById(productId: number) {
    return  await this.productRepository.findOne({where:{id: productId}})
}

//상품 삭제 API
deleteProduct(productId: number) {
    this.productRepository.delete(productId)
    return { "message" : "상품이 삭제되었습니다"}
}

//회원정보 가져오기 API
async getUsers() { 
    return await this.userRepository.find();}

//회원정보 상세보기 API
async getUserById(userId: number) {
    return await this.userRepository.findOne({where:{id: userId}})
}

//회원정보 수정(블랙리스트) API
async banUser(userId: number, ban: number){
    await this.userRepository.update(userId , {ban})
    const user = this.userRepository.findOne({where:{id: userId}})
    const nickname = (await user).nickname
    return { "message" : `${nickname}님이 블랙리스트 처리되었습니다.`}
}

//회원 삭제 API
async deleteUser(userId: number) {
    this.userRepository.delete(userId)
    const user = this.userRepository.findOne({where:{id: userId}})
    const nickname = (await user).nickname
    return { "message" : `${nickname}님의 회원정보가 삭제되었습니다.`}
}

//카테고리 생성 API
createCategory(name: string) {
    this.categoryRepository.insert({name})

    return { "message" : "카테고리가 추가되었습니다"}
}

//카테고리 수정 API
async updateCategory(categoryId: number , name: string) {
    await this.categoryRepository.update(categoryId , {name})
    return { "message" : "카테고리가 수정되었습니다"}
}

//카테고리 삭제 API 
deleteCategory(categoryId: number){
     this.categoryRepository.delete(categoryId)
    return { "message" : "카테고리가 삭제되었습니다"}
}

//공지사항 모두 조회 

async getNotices() {
    return await this.noticeRepository.find();
}

//공지사항 상세조회 
async getNoticeById(noticeId : string){
    return await this.noticeRepository.findOne({where:{id: noticeId }})
}

//공지사항 작성
createNotice(adminId: number, title: string, description: string){
    this.noticeRepository.insert({adminId, title, description})
    return { "message" : "새로운 공지가 작성되었습니다"}
}

//공지사항 수정 
async updateNotice(noticeId: string, title: string, description: string ){
    await this.noticeRepository.update(noticeId , {title, description})
    return { "message" : "공지가 수정되었습니다"}
}

//공지사항 삭제
deleteNotice(noticeId: string){
    this.noticeRepository.delete(noticeId)
    return { "message" : "공지가 삭제되었습니다"}
}

// private async checkPassword(loginId: string, loginPw: string) {
//     const admin = await this.adminRepository.findOne({
//       where: {loginId: loginId },
//       select: ["loginPw"],
//     });
//     if (_.isNil(admin)) {
//       throw new NotFoundException(`admin not found.`);
//     }

//     if (admin.loginPw !== loginPw.toString()) {
//       throw new UnauthorizedException(
//         `admin password is not correct.`
//       );
//     }
//   }

}

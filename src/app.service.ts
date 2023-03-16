import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './global/entities/products.entity';
import { UserEntity } from './global/entities/users.entity';
import { OrdersEntity } from './global/entities/orders.entity';
import { LikesEntity } from './global/entities/likes.entity';
import { ProductImagesEntity } from './global/entities/productimages.entity';

@Injectable()
export class AppService {
  forMoonNum = 10;
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
    @InjectRepository(LikesEntity)
    private likeRepository: Repository<LikesEntity>,
    @InjectRepository(ProductImagesEntity)
    private productImgRepository: Repository<ProductImagesEntity>,
  ) {}

  //////////////////////////////////////////
  // USERS
  async seopUser() {
    // 랜덤 쿼리 생성 횟수
    const forMoonNum = this.forMoonNum * 2;
    for (let i = 0; i < forMoonNum; i++) {
      // 닉네임
      const randomUser = Math.random().toString(36).substring(2, 8);
      // 핸드폰
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      // 주소
      let randomAdd = '';
      const first =
        '김이박최정강조윤장임한오서신권황안송류전홍고문양손배조백허유남심노정하곽성차주우구신임나전민유진지엄채원천방공강현함변염양변여추노도소신석선설마주연방위표명기반왕모장남탁국여진구가강건경고관광구규근기길나남노누다단달담대덕도동두라래로루리마만명무문미민바박백범별병보사산상새서석선설섭성세소솔수숙순숭슬승시신아안애엄여연영예오옥완요용우원월위유윤율으은의이익인일자잔장재전정제조종주준중지진찬창채천철초춘충치탐태택판하한해혁현형혜호홍화환회효훈휘희운모배부림봉혼황량린을비솜공면탁온디항후려균묵송욱휴언들견추걸삼열웅분변양출타흥겸곤번식란더손술반빈실직악람권복심헌엽학개평늘랑향울련';
      for (let i = 0; i < 2; i++)
        randomAdd += first.charAt(Math.floor(Math.random() * first.length));

      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({
          nickname: randomUser,
          email: `${randomUser}@gmail.com`,
          password:
            '$2b$10$xLFBXiyziH2d22jMpjpS0uFCW3W5yX1/DKrzOcpasIsDmo0QUmhdm',
          phone: `010${randomNum}${randomNum}`,
          address: `${randomAdd}시 ${randomAdd}구 ${randomAdd}동`,
        })
        .execute();
    }
  }

  //Products
  async seopProductPhone() {
    const forMoonNum = this.forMoonNum;
    for (let i = 1; i < forMoonNum + 1; i++) {
      const galaxy = [
        '갤럭시 S8',
        '갤럭시 S8+',
        '갤럭시 S9',
        'Galaxy  S9+',
        '갤럭시 S9플러스',
        '갤럭시 S10',
        '갤럭시 S10+',
        '갤럭시 S10플러스',
        'Galaxy  S10e',
        '갤럭시 S20',
        '갤럭시 S20+',
        'Galaxy  S20플러스',
        '갤럭시 S20 Ultra',
        '갤럭시 S20 울트라',
        'Galaxy  S20 FE',
        '갤럭시 Z Flip',
        '갤럭시 Z 폴드2',
        '갤럭시 Z Fold3',
        '갤럭시 Z Fold3 5G',
        'Galaxy  note8',
        '갤럭시 note9',
        '갤럭시 note10',
        'Galaxy  note10+',
        '갤럭시 노트10플러스',
        '갤럭시 note20',
        '갤럭시 노트20+',
        '갤럭시 note20플러스',
        'Galaxy  note20 Ultra',
        '갤럭시 note20 울트라',
        '갤럭시 Z Flip',
        '갤럭시 플립',
        '갤럭시 Z Flip2',
        'Galaxy 플립2',
        '갤럭시 Z Flip3',
        '갤럭시 플립3',
      ];
      const iphone = [
        'iPhone 8',
        '아이폰8+',
        '아이폰8플러스',
        '아이폰X',
        '아이폰XS',
        '아이폰XS Max',
        '아이폰XS맥스',
        '아이폰XR',
        'iPhone11',
        '아이폰11 Pro',
        '아이폰11프로',
        '아이폰11 Pro Max',
        '아이폰11프로맥스',
        '아이폰12',
        '아이폰12 Pro',
        '아이폰12프로',
        'iPhone12 Pro Max',
        '아이폰12프로맥스',
        '아이폰12 mini',
        '아이폰12미니',
        '아이폰SE',
        'iPhoneSE2',
        '아이폰SE 2',
        '아이폰SE 2020',
        '아이폰13',
        '아이폰13 Pro',
        'iPhone13프로',
        '아이폰13 Pro Max',
      ];
      const options = ['삽니다', '팝니다', '급쳐해요', '팔아요', '판매합니다'];
      const status = ['sale', 'sold', 'sussess'];

      const titleOption = options[Math.floor(Math.random() * options.length)];
      let titleMobile;
      if (Math.random() < 0.5) {
        titleMobile = galaxy[Math.floor(Math.random() * galaxy.length)];
      } else {
        titleMobile = iphone[Math.floor(Math.random() * iphone.length)];
      }
      const statusOption = status[Math.floor(Math.random() * status.length)];
      const titles = `${titleMobile} ${titleOption} ${statusOption}`;

      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const priceNum = Math.round(randomNum / 10000) * 10000;

      const currentDate = new Date();
      const oneYearAgo = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate(),
      );

      const randomDate = new Date(
        oneYearAgo.getTime() +
          Math.random() * (currentDate.getTime() - oneYearAgo.getTime()),
      );

      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(ProductsEntity)
        .values({
          title: titles,
          description: titles,
          price: priceNum,
          sellerId: i,
          categoryId: 1,
          viewCount: randomNum / 100000,
          likes: randomNum / 100000,
          status: 'sale',
          dealCount: randomNum / 100000,
          updatedAt: randomDate,
        })
        .execute();
    }
  }

  //Orders
  async seopOrder() {
    const forMoonNum = this.forMoonNum;
    for (let i = 1; i < forMoonNum + 1; i++) {
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const priceNum = Math.round(randomNum / 10000) * 10000;

      const currentDate = new Date();
      const oneYearAgo = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate(),
      );

      const randomDate = new Date(
        oneYearAgo.getTime() +
          Math.random() * (currentDate.getTime() - oneYearAgo.getTime()),
      );

      await this.orderRepository
        .createQueryBuilder()
        .insert()
        .into(OrdersEntity)
        .values({
          productId: i,
          buyerId: forMoonNum + i,
          deal: priceNum,
          status: 'sale',
          updatedAt: randomDate,
        })
        .execute();
    }
  }

  // Likes
  async seopLike() {
    const forMoonNum = this.forMoonNum;
    for (let i = 1; i < forMoonNum + 1; i++) {
      const randomNum = Math.floor(Math.random() * forMoonNum) + 1;

      await this.orderRepository
        .createQueryBuilder()
        .insert()
        .into(LikesEntity)
        .values({
          userId: i,
          productId: randomNum,
        })
        .execute();
    }
  }

  // img
  async seopimg() {
    const forMoonNum = this.forMoonNum;
    for (let i = 1; i < forMoonNum + 1; i++) {
      const randomNum = Math.floor(Math.random() * forMoonNum) + 1;

      await this.orderRepository
        .createQueryBuilder()
        .insert()
        .into(ProductImagesEntity)
        .values({
          productId: i,
          imagePath: 'a.png',
        })
        .execute();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './global/entities/products.entity';
import { UserEntity } from "./global/entities/users.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  //////////////////////////////////////////
  // USERS
  async seopUser() {
    // 랜덤 쿼리 생성 횟수
    const forMoonNum = this.forMoonNum;
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

      const user = await this.userEntity
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
}

최종프로젝트
---
  /// 서비스입니다.

<br>

Team 5
---
- [우태현](https://github.com/wth2052)
- [성민섭](https://github.com/Seop0728)
- [이한결](https://github.com/LeeHan098)
- [조봉진](https://github.com/burno28)
- [이혜](https://github.com/dadaqq1009)



<br>

개발 관련 사항
---
- `typescript 4.7.4` 에서 개발되었습니다.
- [코드 규칙](https://github.com/5g-FleaMarket/5g-fleamarket/wiki/Convention)을 따릅니다.
- [핵심 요구사항]()을 준수합니다.

<br>

사용된 기술
---
- NestJs
- TypeORM
- MySQL
- Docker
- Redis
- EJS

<br>

✅ 다이어그램
---

<br>
메인페이지<br>


로그인/회원가입<br>


상품<br>


오더<br>


마이페이지<br>


관리자페이지(상품관리)<br>





<br><br>

DB 설계
---

🎈 admins
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 관리자 번호 |
| loginid | VARCHAR(255) | UNIQUE, Not Null | 관리자 아이디 |
| loginPw | VARCHAR(255) | Not Null | 관리자 비밀번호 |
<br>

🎈 categories
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment,PRIMARY KEY,Not Null | 카테고리 번호 |
| name | VARCHAR(255) | Not Null | 카테고리 이름 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| deletedAt | datetime(6) |  | 삭제된 시간 |
<br>

🎈 likes
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| uerId | INT | PRIMARY KEY, Not Null | 회원 번호 |
| productId | INT | Not Null | 상품 번호 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| deletedAt | datetime(6) |  | 삭제된 시간 |
<br>

🎈 notices
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 공지 번호 |
| adminId | INT | Not Null | 관리자 번호 |
| title | VARCHAR(255) | Not Null | 공지 제목 |
| description | VARCHAR(255) | Not Null | 공지 내용 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| deletedAt | datetime(6) |  | 삭제된 시간 |
<br>

🎈 orders
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 거래상품 번호 |
| productId | INT | MULTIPLE, Not Null | 상품 번호 |
| buyerId | INT | MULTIPLE, Not Null | 구매자 번호 |
| deal | INT | Not Null | 구매자가 제시한 구매 가격 |
| status | VARCHAR(255) | Default: ‘sale’, Not Null | 거래상품 상태 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| updatedAt | datetime(6) | DEFAULT_GENERATED | 수정된 시간 |
| deletedAt | datetime(6) |  | 삭제된 시간 |
<br>

🎈 productimages
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 상품 이미지 번호 |
| imagePath | VARCHAR(255) | Not Null | 상품 이미지 이름 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| deletedAt | datetime(6) |  | 삭제된 시간 |
| productId | INT | MULTIPLE | 상품 번호 |
<br>

🎈 products
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 상품 번호 |
| title | VARCHAR(255) | Not Null | 상품 거래 제목 |
| description | VARCHAR(255) | Not Null | 상품 거래 내용 |
| price | INT | Not Null | 상품 가격 |
| sellerId | INT | MULTIPLE, Not Null | 판매자 번호 |
| categoryId | INT | MULTIPLE, Not Null | 카테고리 번호 |
| viewCount | INT | Default: 0, Not Null | 조회수 |
| likes | INT | Default: 0, Not Null | 좋아요 수 |
| status | VARCHAR(255) | Default: ‘sale’, Not Null | 상품 판매 여부 상태 |
| dealCount | INT | Default: 0, Not Null | 거래 수 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| updatedAt | datetime(6) | DEFAULT_GENERATED, | 수정된 시간 |
| pullUp | datetime(6) |  |  |
<br>

🎈 reports
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 신고 번호 |
| reporterId | INT | MULTIPLE, Not Null | 신고자 번호 |
| reported | VARCHAR(255) | Not Null | 피신고인 닉네암 |
| title | VARCHAR(255) | Not Null | 신고 내용 제목 |
| description | VARCHAR(255) | Not Null | 신고 내용 |
| status | INT | Default: 0, Not Null | 신고 확인 여부 |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| updatedAt | datetime(6) | DEFAULT_GENERATED | 수정된 시간 |
| deletedAt | datetime(6) |  | 삭제된 시간 |
<br>

🎈 users
| 컬럼 | 데이터타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| id | INT | Auto_increment, PRIMARY KEY, Not Null | 회원 번호 |
| nickname | VARCHAR(255) | Not Null | 회원 닉네임 |
| email | VARCHAR(255) | UNIQUE, Not Null | 회원 이메일 주소 |
| password | VARCHAR(255) | Not Null | 회원 비밀번호 |
| phone | VARCHAR(255) | Not Null | 회원 휴대전화 번호 |
| address | VARCHAR(255) | Not Null | 회원 주소 |
| ban | INT | Default: 0 | 회원 블랙리스트 상태 |
| currentHashedRefreshToken | VARCHAR(255) |  | 회원 refresh Token |
| createdAt | datetime(6) | DEFAULT_GENERATED, Not Null | 생성된 시간 |
| updatedAt | datetime(6) | DEFAULT_GENERATED  | 수정된 시간 | 
| deletedAt | datetime(6) |  | 삭제된 시간 |
<br>





<br><br>

ERD
---
<img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6c248921-f080-4749-bc81-d5efc558d5d9%2FUntitled.png?id=08d9d574-06cd-4dac-ace4-2c1124e97346&table=block&spaceId=469240fb-3871-42f8-9b6a-c82a7d3441bc&width=2000&userId=77a63536-521c-4e7e-907a-32a6504ed56d&cache=v2" width="600px" height="500px">



<br><br>
// import { getTimeAgo } from './main-header.js';
// getTimeAgo();
// import 하면 함수가 깨짐.

// 구매진행
axios
  .get('http://localhost:3000/orders/me/pick')
  .then((res) => {
    let data = res.data.data;
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        const timeAgo = getTimeAgo(data[i].product.createdAt);
        temp += `
                   <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${data[i].product.images[0].imagePath}" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${data[i].product.title}</h3>
                <h4>상품 가격 : ${data[i].product.price}원</h4>
                <span style="float: right;"><button onclick="dealUpdate(${data[i].id})"> 수정하기</button></span>
                <h5>제시가격 : ${data[i].deal}원</h5>
                <span style="float: right;"><button onclick="dealDelete(${data[i].id})"> 취소하기</button></span>
                <h6>${timeAgo}</h6>
                <span>조회: ${data[i].product.viewCount}회</span>
                <br>
                <span style="float: right;">🎯 ${data[i].product.dealCount} ❤ ${data[i].product.likes}</span>
            </div>
        </div>
      </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    }
  })
  .catch((error) => {
    console.log(error);
    if (error.request.status === 401) {
      alert('로그인 하고 오세요');
      window.location.href = 'http://localhost:3000/login';
    } else if (error.request.status === 404) {
      let temp = '';
      temp += `
                    <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="image" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>구매 진행 상품이 없네용</h3>
                <h4>아직 꾸미기 전입니다.</h4>
                <p>asdfasdfasf</p>
                <span>asdfasdfasf</span>
                <span></span>
            </div>
        </div>
      </div>`;
      document.getElementById('bb').innerHTML = temp;
    }
  });

// 판매 진행
function mySellProduct() {
  axios
    .get('http://localhost:3000/orders/me/sell/product')
    .then((res) => {
      let data = res.data.data;
      console.log(data);
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        const timeAgo = getTimeAgo(data[i].updatedAt);
        temp += `
                    <div class="container-fluid" onclick="productDealCheck(${res.data.data[i].id})" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${data[i].images[0].imagePath}" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <span style="float: right;"><button onclick="pullUp(${data[i].id})">끌어올리기</button></span>
                <h3>${data[i].title}</h3>
<!--                <p>${data[i].buyerId}</p>-->
                <h4>${data[i].price}원</h4>
                <h6>${timeAgo}</h6>
                <span>조회: ${data[i].viewCount}회</span>
                <span style="float: right;">🎯 ${data[i].dealCount} ❤ ${data[i].likes}</span>
            </div>
        </div>
      </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      // 예외처리
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/';
        return;
      } else if (error.response.status === 404) {
        let temp = '';
        temp += `
                   <div class="container-fluid"  style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                       <div class="row">
                        <div class="col-md-3" style=" padding: 0">
                          <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="spcFuck" 
                          style="width: 100%; height: 100%; margin: 0" />
                         </div>
                      <div class="col-md-9">
                  <h3>구매 진행 상품이 없네용</h3>
                  <h4>아직 꾸미기 전입니다.</h4>
                  <p>asdfasdfasf</p>
                  <span>asdfasdfasf</span>
                  <span></span>
              </div>
          </div>
        </div>`;
        document.getElementById('bb').innerHTML = temp;
      }
    });
}

// 구매내역
function myBuyList() {
  axios
    .get('http://localhost:3000/orders/me/buy/list')
    .then((res) => {
      let data = res.data.data;
      console.log(data);
      let temp = '';
      for (let i = 0; i < data.buyList.length; i++) {
        temp += `
      <div class="container-fluid" onclick="location.href='/productss/view/${data.product[i].id}'" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${data.product[i].images[0].imagePath}" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${data.product[i].title}</h3></br>
                <h6>구매날짜 : ${data.buyList[i].updatedAt}</h6>
                <h4>구매완료 : ${data.buyList[i].deal}원</h4>
                <span style="float: right;">❤${data.product[i].likes}</span>
            </div>
        </div>
      </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/';
        return;
      }
      else if (error.response.status === 404) {
        let temp = '';
        temp += `
                                        <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="image" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>구매하신 상품이 없습니다. ㅎㅎㅎ</h3>
                <h4>구매해</h4>
                <p>바보</p>
                <span>데데데</span>
                <span></span>
            </div>
        </div>
      </div>`;
        document.getElementById('bb').innerHTML = temp;
      }
    });
}

// 판매내역
function mySellList() {
  axios
    .get('http://localhost:3000/orders/me/sell/list')
    .then((res) => {
      let order = res.data.data.real;
      let product = res.data.data.myProduct;
      console.log(res);
      let temp = '';
      for (let i = 0; i < order.length; i++) {
        temp += `
       <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${product[i].images[0].imagePath}" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${product[i].title}</h3></br>
                <h6>거래일 : ${order[i].updatedAt}</h6>
                <h4>거래완료 : ${order[i].deal}원</h4>
                <span style="float: right;">❤${product[i].likes}</span>
            </div>
        </div>
      </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/';
        return;
      } else if (error.response.status === 404) {
        let temp = '';
        temp += `
                                       <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="image" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>아직 파신 물건이 없내용</h3>
                <h4>ㅎㅎㅎㅎㅎㅎ</h4>
                <p>asdfasdfasf</p>
                <span>asdfasdfasf</span>
                <span></span>
            </div>
        </div>
      </div>`;
        document.getElementById('bb').innerHTML = temp;
      }
    });
}

function deal() {
  axios
    .get('http://localhost:3000/orders/me/pick')
    .then((res) => {
      console.log(res.data.data.length !== 0);
      if (res.data.data.length !== 0) {
        let temp = '';
        for (let i = 0; i < res.data.data.length; i++) {
          temp += `
                                       <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${data[i].product.images[0].imagePath}" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${res.data.data[i].product.title}</h3>
<!--                <p>${res.data.data[i].buyerId}</p>-->
                <h4>${res.data.data[i].deal}원</h4>
                <p>날짜: ${res.data.data[i].product.createdAt}회</p>
                <span>조회: ${res.data.data[i].product.viewCount}회</span>
                <span style="float: right;">🎯 ${0} ❤ ${res.data.data[i].product.likes}</span>
            </div>
        </div>
      </div>`;
        }
        document.getElementById('bb').innerHTML = temp;
      }
    })
    .catch((error) => {
      let temp = '';
      temp += `
                                      <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="image" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>구매 진행 상품이 없네용</h3>
                <h4>아직 꾸미기 전입니다.</h4>
                <p>asdfasdfasf</p>
                <span>asdfasdfasf</span>
                <span></span>
            </div>
        </div>
      </div>`;
      document.getElementById('bb').innerHTML = temp;
    });
}

// 구매진행 -> 딜 수정하기
function dealUpdate(orderId) {
  event.stopPropagation();
  let newDeal = prompt('판매자가 제시한 가격보다 높게 제시해주세요!');
  while (isNaN(newDeal) || newDeal === '') {
    newDeal = prompt('올바르게 입력해주세요');
  }
  if (newDeal === null) {
    window.location.reload();
  }
  axios
    .put(`http://localhost:3000/orders/deal/change/${orderId}`, {
      price: newDeal,
    })
    .then((res) => {
      alert('수정완료');
      window.location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

// 구매진행 -> 딜 삭제하기
function dealDelete(orderId) {
  event.stopPropagation();
  axios
    .delete(`http://localhost:3000/orders/deal/cancel/${orderId}`)
    .then((res) => {
      alert('선택하신 deal이 삭제됬습니다.');
      window.location.reload();
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/';
        return;
      } else if (error.response.status === 404) {
        alert('선택하신 deal은 없는 deal 입니다.');
      }
    });
}

// 판매진행 -> 상품 딜 목록보기
function productDealCheck(productId) {
  console.log(productId);
  axios
    .get(`http://localhost:3000/orders/products/${productId}`)
    .then((res) => {
      console.log(res);
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        temp += `
  <div class="container-fluid" style="border: 1px solid red; margin-top: 20px; display: flex">
      <div class="col-md-6" style="width: 50%;">
        <h3>Deal : ${data[i].deal}원</h3>
                <span style="float: right;">
          <button onclick="dealAccept(${data[i].id})">수락하기</button>
        </span>
      </div>
    </div>
  </div>
</div>

`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      // 예외처리
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/';
        return;
      }
      let temp = '';
      temp += `
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="image" style="width: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>구매 진행 상품이 없네용</h3>
                <h4>아직 꾸미기 전입니다.</h4>
                <p>asdfasdfasf</p>
                <span>asdfasdfasf</span>
                <span></span>
            </div>
        </div>
      </div>`;
      document.getElementById('bb').innerHTML = temp;
    });
}

// 판매자가 거래를 수락해서 거래종료
function dealAccept(orderId) {
  console.log(orderId);
  axios
    .put(`http://localhost:3000/orders/deal/accept/${orderId}`)
    .then((res) => {
      // 응답처리
      alert('거래가 완료되었습니다.');
      window.location.replace('http://localhost:3000/orders');
    })
    .catch((error) => {
      // 예외처리
      alert(
        error.response?.data?.message ||
        error.response.data.errorMessage.details[0].message,
      );
    });
}

// Date 객체를 사용하여 일정 기간 전인지 계산하는 함수
function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);
  const years = Math.floor(diff / 31536000000);

  switch (true) {
    case minutes < 5:
      return `방금 전`;
    case hours < 1:
      return `${minutes}분 전`;
    case days < 1:
      return `${hours}시간 전`;
    case weeks < 1:
      return `${days}일 전`;
    case months < 1:
      return `${weeks}주 전`;
    case years < 1:
      return `${months}달 전`;
    default:
      return `${years}년 전`;
  }
}

// 끌어올리기
function pullUp(productId) {
  event.stopPropagation();
  axios
    .post(`/orders/pullUp/${productId}`)
    .then((res) => {
      alert('게시글을 끌어올렸어요.');
      window.location.replace('http://localhost:3000/order');
    })
    .catch((error) => {
      alert(
        error.response?.data?.message ||
        error.response.data.errorMessage.details[0].message,
      );
    });
}

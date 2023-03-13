// 구매진행
axios
  .get('http://localhost:3000/orders/me/pick')
  .then((res) => {
    console.log(res.data.data.length !== 0);
    if (res.data.data.length !== 0) {
      let temp = '';
      for (let i = 0; i < res.data.data.length; i++) {
        temp += `
                    <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${res.data.data[i].product.title}</h3>
                <span style="float: right;"><button onclick="dealUpdate(${res.data.data[i].id})"> 수정하기</button></span>
<!--                <p>${res.data.data[i].buyerId}</p>-->
                <h4>${res.data.data[i].deal}원</h4>
                <span style="float: right;"><button onclick="dealDelete(${res.data.data[i].id})"> 취소하기</button></span>
                <p>날짜: ${res.data.data[i].product.createdAt}회</p>
                <span>조회: ${res.data.data[i].product.viewCount}회</span>
                <span style="float: right;">🎯 ${res.data.data[i].product.dealCount} ❤ ${res.data.data[i].product.likes}</span>
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
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
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

// 판매 진행
function mySellProduct() {
  axios
    .get('http://localhost:3000/orders/me/sell/product')
    .then((res) => {
      console.log(res);
      let temp = '';
      for (let i = 0; i < res.data.data.length; i++) {
        temp += `
                    <div 
                      class="container-fluid"
                      onclick="productDealCheck(${res.data.data[i].id})" 
                      style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${res.data.data[i].title}</h3>
<!--                <p>${res.data.data[i].buyerId}</p>-->
                <h4>${res.data.data[i].price}원</h4>
                <p>날짜: ${res.data.data[i].createdAt}회</p>
                <span>조회: ${res.data.data[i].viewCount}회</span>
                <span style="float: right;">🎯 ${res.data.data[i].dealCount} ❤ ${res.data.data[i].likes}</span>
            </div>
        </div>
      </div>`;
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
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
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

// 구매내역
function myBuyList() {
  axios
    .get('http://localhost:3000/orders/me/buy/list')
    .then((res) => {
      let temp = '';
      for (let i = 0; i < res.data.data.length; i++) {
        temp += `
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${res.data.data[i].product.title}</h3></br>
<!--                <p>${res.data.data[i].buyerId}</p>-->
                <h6>거래일 : ${res.data.data[i].product.updatedAt}</h6>
                <h4>거래완료 : ${res.data.data[i].deal}원</h4>
<!--                <span>조회: ${res.data.data[i].product.viewCount}회</span>-->
<!--                <p>날짜: ${res.data.data[i].product.createdAt}회</p>-->
                <span style="float: right;">❤${res.data.data[i].product.likes}</span>
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
      // 404 구매내역이 없을 때
      else if (error.response.status === 404) {
        let temp = '';
        temp += `
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
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
      let temp = '';
      for (let i = 0; i < res.data.data.length; i++) {
        temp += `
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${res.data.data[i].product.title}</h3></br>
<!--                <p>${res.data.data[i].buyerId}</p>-->
                <h6>거래일 : ${res.data.data[i].product.updatedAt}</h6>
                <h4>거래완료 : ${res.data.data[i].deal}원</h4>
                <span style="float: right;">❤${res.data.data[i].product.likes}</span>
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
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
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
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${res.data.data[i].product.title}</h3>
<!--                <p>${res.data.data[i].buyerId}</p>-->
                <h4>${res.data.data[i].deal}원</h4>
                <p>날짜: ${res.data.data[i].product.createdAt}회</p>
                <span>조회: ${res.data.data[i].product.viewCount}회</span>
                <span style="float: right;">🎯 ${0} ❤ ${
            res.data.data[i].product.likes
          }</span>
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
                    <div class="container-fluid" style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
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
  let newDeal = prompt('수정하실 deal 값을 입력하세요');
  while (isNaN(newDeal) || newDeal === '') {
    newDeal = prompt('올바르게 입략');
  }
  if (newDeal === null) {
    window.location.reload();
  }
  axios
    .put(`http://localhost:3000/orders/deal/change/${orderId}`, {
      price: newDeal,
    })
    .then((res) => {
      alert('수정완료F');
      window.location.reload();
    })
    .catch((error) => {
      if (error.response.status === 404) {
        alert('주문이 없습니다.');
      } else if (error.response.status === 403) {
        alert('다른사람의 딜 입니다.');
      }
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
  axios
    .get(`http://localhost:3000/orders/products/${productId}`)
    .then((res) => {
      console.log(res);
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        temp += `
                    <div 
                      class="container-fluid"
                      style="border: 1px solid red; margin-top: 20px">
                     <div class="row">
<!--                      <div class="col-md-3" style="border-right: 1px solid red; padding: 0">-->
<!--                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />-->
<!--                       </div>-->
                    <div class="col-md-9">
                <h3>Deal : ${data[i].deal}원</h3>
<!--                <p>${res.data.data[i].buyerId}</p>-->
<!--                <h4>${res.data.data[i].price}원</h4>-->
<!--                <p>날짜: ${res.data.data[i].createdAt}회</p>-->
<!--                <span>조회: ${res.data.data[i].viewCount}회</span>-->
                    <span style="float: right;">
                      <button onclick="dealAccept(${data[i].id})">수락하기</button>
                    </span>
            </div>
        </div>
      </div>`;
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
                        <img src="img/1296285.jpg" alt="spcFuck" style="width: 100%; margin: 0" />
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
      window.location.replace('http://localhost:3000/orders/index');
    })
    .catch((error) => {
      // 예외처리
      alert(
        error.response?.data?.message ||
          error.response.data.errorMessage.details[0].message,
      );
    });
}

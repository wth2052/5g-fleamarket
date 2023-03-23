axios
  .get('/orders/me/buy/list')
  .then((res) => {
    let data = res.data.data;
    console.log(res);
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        let productP = data[i].price;
        let orderD = data[i].orders[0].deal;
        const productPrice = productP
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const orderDeal = orderD
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const timeAgo = getTimeAgo(data[i].pullUp);
        temp += `
                    <div class="col-md-6 col-lg-3" style="max-width: 25%; max-height: 25%">
                        <div class="card">
                            <img class="img-fluid"
                              src="/img/${data[i].images[0].imagePath}"
                              style="min-height: 250px; max-height: 250px"
                               onclick="window.location='/products/asdf/${data[i].id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${data[i].title}</h5>
                                <div class="btn-group mb-1">
                                        <button type="button" class="btn btn-warning">${productPrice} 원</button>
                                        <button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"></button>
                                        <div class="dropdown-menu"><a class="dropdown-item">✅ 구매가격</a>
                                         <a class="dropdown-item" style="font-weight: bold">${orderDeal} 원</a>
                                         <a class="dropdown-item" href="#">----------------------------</a>
                                        <button type="button" id="alertStart"  onclick="sellResult(${data[i].orders[0].id})"  class="btn mb-1 btn-rounded btn-primary">판매자 정보</button>

                                        </div>
                                    </div>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                      <small class="text-muted">${data[i].likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                      <small class="text-muted">${data[i].viewCount}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="6%">
                                     <small class="text-muted">${timeAgo} </small>
                                </p>



                            </div>
                        </div>
                    </div>
`;
      }
      document.getElementById('product-list').innerHTML = temp;
    }
  })
  .catch((error) => {
    if (error.response.status === 401) {
      alert('로그인 후 사용 가능한 기능 입니다.');
      window.location.href = '/';
    } else if (error.response.status === 404) {
      let temp = '';
      temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
      document.getElementById('product-list').innerHTML = temp;
    }
  });

// 판매자 정보
function sellResult(orderId) {
  axios
    .get(`/orders/buy/result/${orderId}`)
    .then((res) => {
      let data = res.data.data;
      console.log(data);
      const addressSplit = data.address.split(' ');
      swal(
        '판매자 정보',
        `판매자 : ${data.nickname}
                연락처 : ${data.phone}
                주소 : ${addressSplit[2]}`,
        'success',
      );
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인 후 이용이 가능합니다.');
        window.location.href = '/';
      }
      if (error.response.status === 404) {
        temp = `<img src="/images/제목을 입력해주세요_-001 (5).png">`;
        document.getElementById('product-list').innerHTML = temp;
      }
      if (error.response.status === 403) {
        alert(error.response.data.message);
        window.location.href = '/';
      }
    });
}

// 헤더로 뺴야됌 ( 임시 테스트용 )
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

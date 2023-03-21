axios
  .get('http://localhost:3000/orders/me/buy/list')
  .then((res) => {
    let data = res.data.data;
    console.log(data);
    if (data !== 0) {
      let temp = '';
      buyResult();
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
                               onclick="window.location='/productss/asdf/${data[i].id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${data[i].title}</h5>
                                <div class="btn-group mb-1">
                                        <button type="button" class="btn btn-warning">${productPrice} 원</button>
                                        <button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"></button>
                                        <div class="dropdown-menu"><a class="dropdown-item">✅ 구매가격</a>
                                         <a class="dropdown-item" style="font-weight: bold">${orderDeal} 원</a>
                                         <a class="dropdown-item" href="#">----------------------------</a>
                                        <button type="button" class="btn btn-primary" onclick="buyResult(${data[i].id})" data-toggle="modal" data-target="#modalPush">판매자 정보</button>

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

<!--Modal: modalPush-->
<div class="modal fade" id="modalPush" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-notify modal-info" role="document">
    <!--Content-->
    <div class="modal-content text-center">
      <!--Header-->
      <div class="modal-header d-flex justify-content-center">
        <p class="heading">판매자 정보</p>
      </div>

      <!--Body-->
      <div class="modal-body">
        <i class="fas fa-bell fa-4x animated rotateIn mb-4"></i>
        <p>판매자 : </p>
        <p>핸드폰 : </p>
        <p>주소 : </p>
      </div>

      <!--Footer-->
    </div>
    <!--/.Content-->
  </div>
</div>
<!--Modal: modalPush-->


                            </div>
                        </div>
                    </div>
`;
      }
      document.getElementById('product-list').innerHTML = temp;
    }
  })
  .catch((error) => {
    console.log(error);
  });

// 판매자 정보
function buyResult(orderId) {
  axios
    .get(`http://localhost:3000/orders/buy/result/${orderId}`)
    .then((res) => {
      let result = res.data.data;
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.log(error);
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

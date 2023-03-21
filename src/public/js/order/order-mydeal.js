axios
  .get('http://localhost:3000/orders/me/pick')
  .then((res) => {
    let data = res.data.data;
    console.log(data);
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        let productP = data[i].product.price;
        let orderD = data[i].deal;
        const productPrice = productP
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const orderDeal = orderD
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const timeAgo = getTimeAgo(data[i].product.pullUp);
        temp += `
                    <div class="col-md-6 col-lg-3" style="max-width: 25%; max-height: 25%">
                        <div class="card">
                            <img class="img-fluid" 
                              src="/img/${data[i].product.images[0].imagePath}"
                              style="min-height: 250px; max-height: 250px"
                               onclick="window.location='/productss/asdf/${data[i].product.id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${data[i].product.title}</h5>
                                <div class="btn-group mb-1">
                                        <button type="button" class="btn btn-warning">${productPrice} 원</button>
                                        <button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"></button>
                                        <div class="dropdown-menu"><a class="dropdown-item">🎯 나의 제시가격</a>
                                         <a class="dropdown-item" style="font-weight: bold">${orderDeal} 원</a> 
                                         <a class="dropdown-item" href="#">----------------------------</a> 
                                        <button type="button" id="dealUpdate" onclick="dealUpdate(${data[i].id})" class="btn mb-1 btn-rounded btn-primary">딜 수정하기</button>
                                        <button type="button" id="dealUpdate" onclick="dealDelete(${data[i].id})" class="btn mb-1 btn-rounded btn-primary">딜 취소하기</button>
                                        </div>
                                    </div>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                      <small class="text-muted">${data[i].product.likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                      <small class="text-muted">${data[i].product.viewCount}　</small>
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
    console.log(error);
  });

// 딜 수정하기
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

// 딜 삭제하기
function dealDelete(orderId) {
  event.stopPropagation();
  axios
    .delete(`http://localhost:3000/orders/deal/cancel/${orderId}`)
    .then((res) => {
      alert('딜 취소하기 완료!.');
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

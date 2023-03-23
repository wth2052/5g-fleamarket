axios
  .get('/api/orders/me/pick')
  .then((res) => {
    let data = res.data.data;
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
                               onclick="window.location='/products/asdf/${data[i].product.id}'" alt="">
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
    if (error.response.status === 401) {
      alert('로그인 후 사용이 가능합니다.');
      window.location.href = '/';
    } else if (error.response.status === 404) {
      let temp = '';
      temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
      document.getElementById('product-list').innerHTML = temp;
    }
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
    .put(`/api/orders/deal/change/${orderId}`, {
      price: newDeal,
    })
    .then((res) => {
      alert('수정완료');
      window.location.reload();
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인 후 이용이 가능합니다.');
        window.location.href = '/';
      }
      if (error.response.status === 400) {
        alert(error.response.data.message);
        window.location.href = '/';
      }
      if (error.response.status === 403) {
        alert('사용자가 가격을 제시한 상품이 아닙니다.');
        window.location.href = '/';
      }
    });
}

// 딜 삭제하기
function dealDelete(orderId) {
  event.stopPropagation();
  axios
    .delete(`/api/orders/deal/cancel/${orderId}`)
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

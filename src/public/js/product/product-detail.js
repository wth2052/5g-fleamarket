link = document.location.href;
console.log(link);

const linkSplit = link.split('/');
const num = linkSplit[linkSplit.length - 1];
console.log(num);

axios
  .get(`/products/view/${num}`)
  .then((res) => {
    let data = res.data.product;
    console.log(data);
    let img1 = '';
    let img2 = '';
    let img3 = '';
    let temp = '';
    const timeAgo = getTimeAgo(data.pullUp);
    if (data.images.length === 1) {
      img1 += `
                                    <div class="carousel-inner" style="max-height: 800px">
                                        <div class="carousel-item active">
                                            <img class="d-block w-100" src="/img/${data.images[0].imagePath}" alt="Second slide">
                                        </div>
                                    </div>
                                    <a class="carousel-control-prev" href="#carouselExampleIndicators"
                                       data-slide="prev"><span class="carousel-control-prev-icon"></span> <span
                                                class="sr-only"></span> </a><a class="carousel-control-next"
                                                                                       href="#carouselExampleIndicators"
                                                                                       data-slide="next"><span
                                                class="carousel-control-next-icon"></span> <span
                                                class="sr-only"></span></a>
                                </div>
                            </div>
                            `;
    }

    if (data.images.length === 2) {
      img2 += `
                                    <div class="carousel-inner" style="max-height: 800px">
                                        <div class="carousel-item">
                                            <img class="d-block w-100" src="/img/${data.images[0].imagePath}" alt="First slide">
                                        </div>
                                        <div class="carousel-item active">
                                            <img class="d-block w-100" src="/img/${data.images[1].imagePath}" alt="Second slide">
                                        </div>
                                    <a class="carousel-control-prev" href="#carouselExampleIndicators"
                                       data-slide="prev"><span class="carousel-control-prev-icon"></span> <span
                                                class="sr-only"></span> </a><a class="carousel-control-next"
                                                                                       href="#carouselExampleIndicators"
                                                                                       data-slide="next"><span
                                                class="carousel-control-next-icon"></span> <span
                                                class="sr-only"></span></a>
                                </div>
                            </div>
                            `;
    }

    if (data.images.length === 3) {
      img3 += `
                                    <div class="carousel-inner" style="max-height: 800px">
                                        <div class="carousel-item">
                                            <img class="d-block w-100" src="/img/${data.images[0].imagePath}" alt="First slide">
                                        </div>
                                        <div class="carousel-item active">
                                            <img class="d-block w-100" src="/img/${data.images[1].imagePath}" alt="Second slide">
                                        </div>
                                        <div class="carousel-item">
                                            <img class="d-block w-100" src="/img/${data.images[2].imagePath}" alt="Third slide">
                                        </div>
                                    </div>
                                    <a class="carousel-control-prev" href="#carouselExampleIndicators"
                                       data-slide="prev"><span class="carousel-control-prev-icon"></span> <span
                                                class="sr-only"></span> </a><a class="carousel-control-next"
                                                                                       href="#carouselExampleIndicators"
                                                                                       data-slide="next"><span
                                                class="carousel-control-next-icon"></span> <span
                                                class="sr-only"></span></a>
                                </div>
                            </div>
                            `;
    }

    if (data.status === 'sale') {
      temp += `
                                <h2 class="card-title">${data.title}</h2>
                                <h6 class="card-title">${data.price} 원</h6>
                                <h4 class="card-title">카테고리: ${data.category.name}</h4>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="1%">
                                    <small class="text-muted">${data.likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="2%">
                                    <small class="text-muted">${data.viewCount}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="2%">
                                    <small class="text-muted">${timeAgo} </small>
                                </p>
                                <p class="card-text">
                                    <small class="text-muted">
                                        <button type="button" class="btn btn-success m-b-10 m-l-5"
                                                id="toastr-success-bottom-right"
                                                onclick="like(${num})">찜하기
                                        </button>
                                    </small>
                               
                                    <!-- 모달 버튼 -->
                                    <small class="text-muted">
                                        <button type="button" class="btn btn-primary" data-toggle="modal"
                                                data-target="#exampleModal" data-whatever="@mdo">가격 제시하기
                                        </button>
                                             <small class="text-muted">
                                        <button type="button" class="btn btn-danger m-b-10 m-l-5"
                                                id="toastr-success-bottom-right"
                                                onclick="remove(${num})">삭제하기
                                        </button>
                                    </small>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" style="display: none;" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <!-- 모달 내용 -->
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">가격 제시하기</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="form-group">
                                                            <div>최저가보다 높은 가격을 제시해야 합니다</div>
                                                            <div>지금 가격을 제시하셔도 판매자가 제시된 해당 가격을 선택하지 않을 수 있습니다.</div>
                                                            <div>저희 플랫폼은 매칭하는 역활만 제공합니다. 거래 및 결제는 판매자와 직접 결정하셔야 합니다.</div>
                                                            <label for="recipient-name" class="col-form-label">제시가격</label>
                                                            <input type="number" class="form-control" id="recipient-name">
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
                                                    <button type="button" class="btn btn-primary" onclick="deal(${num})">가격 제시하기</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                               <h6 class="card-text">${data.description}</h6>
                            </div>
                        </div>
                    </div>

`;
    } else {
      temp += `
                                <h2 class="card-title">${data.title}</h2>
                                <h6 class="card-title">${data.price} 원</h6>
                                <h4 class="card-title">카테고리: ${data.category.name}</h4>

                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="1%">
                                    <small class="text-muted">${data.likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="2%">
                                    <small class="text-muted">${data.viewCount}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="2%">
                                    <small class="text-muted">${timeAgo} </small>
                                </p>
                                    <!-- 모달 버튼 -->
                                    <small class="text-muted">
                                        <button type="button" class="btn btn-primary" data-toggle="modal"
                                                data-target="#exampleModal" data-whatever="@mdo">판매완료
                                        </button>
                                    <br><br>
                               <h6 class="card-text">${data.description}</h6>
                            </div>
                        </div>
                    </div>
`;
    }

    if (data.images.length === 1) {
      console.log('1번입니다');
      document.getElementById('carouselExampleIndicators').innerHTML = img1;
      document.getElementById('product-img-row').innerHTML = temp;
    }
    if (data.images.length === 2) {
      console.log('2번입니다');
      document.getElementById('carouselExampleIndicators').innerHTML = img2;
      document.getElementById('product-img-row').innerHTML = temp;
    }
    if (data.images.length === 3) {
      console.log('3번입니다');
      document.getElementById('carouselExampleIndicators').innerHTML = img3;
      document.getElementById('product-img-row').innerHTML = temp;
    }
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 404) {
      alert('해당 상품을 찾을 수 없습니다.');
      window.location.href = '/';
    }
  });

// 찜하기
function like(productId) {
  axios
    .post(`/products/like/${productId}`)
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인 후 이용 가능합니다.');
        window.location.href = '/login';
      }
    });
}

// 가격 제시하기
function deal(productId) {
  const dealPrice = document.getElementById('recipient-name').value;
  console.log(dealPrice);
  axios
    .post(`/orders/deal/price/${productId}`, {
      price: dealPrice,
    })
    .then((response) => {
      alert('가격제시 완료');
      window.location.href = '/';
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인해야 주문이 가능합니다.');
        window.location.href = '/login';
      } else if (error.response.status === 400) {
        alert('자신의 상품에는 딜할 수 없습니다.');
        window.location.reload();
      } else if (error.response.status === 403) {
        alert('이미 주문하셨습니다. 구매진행에서 수정해주세요');
        window.location.reload();
      } else if (error.response.status === 409) {
        alert('최저가보다 낮게 제시하셨습니다.');
        window.location.reload();
      }
    });
}

//삭제하기
function remove(productId) {
  axios
    .delete(`/products/${productId}`)
    .then((response) => {
      window.location.href = 'http://localhost:3000/';
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인 후 이용 가능합니다.');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        alert('본인이 올린 상품만 삭제할 수 있습니다.');
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

link = document.location.href;

const linkSplit = link.split('/');
const num = linkSplit[linkSplit.length - 1];

axios
  .get(`http://localhost:3000/orders/products/${num}`)
  .then((res) => {
    let data = res.data.data;
    console.log(data);
    if (data !== 0) {
      const productPrice = data.product.price
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
      let temp = '';
      let dealTemp = '';
      temp += `
                <div class="email-left-box"><a href="email-compose.html" class="btn btn-primary btn-block">${data.product.title}</a>
                    <div class="mail-list mt-4"><a href="email-inbox.html" class="list-group-item border-0 text-primary p-r-0"><i class="fa fa-inbox font-18 align-middle mr-2"></i> <b>제시받은 가격수</b> <span class="badge badge-primary badge-sm float-right m-t-5">${data.deal.length}</span> </a>
                        <a href="#" class="list-group-item border-0 p-r-0"><i class="fa fa-paper-plane font-18 align-middle mr-2"></i><b>판매가</b><span class="badge badge-primary badge-sm float-right m-t-5">${productPrice}</span></a>
                        <a href="#" class="list-group-item border-0 p-r-0"><i class="fa fa-star-o font-18 align-middle mr-2"></i>좋아요 <span class="badge badge-danger badge-sm float-right m-t-5">${data.product.likes}</span> </a>
                    </div>
                </div>                
`;

      for (let i = 0; i < data.deal.length; i++) {
        const dealPrice = data.deal[i].deal
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        dealTemp += `
                    <div class="message">
                        <a>
                            <div class="col-mail col-mail-2">
                                <div class="subject">${dealPrice}</div>
                                <div class="date"><button type="button" onclick="dealAccept(${data.deal[i].id})" class="btn mb-1 btn-rounded btn-success">수락하기</button></div>
                            </div>
                        </a>
                    </div>       
`;
      }
      document.getElementById('acceptProduct').innerHTML = temp;
      document.getElementById('acceptRow').innerHTML = dealTemp;
    }
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 401) {
      alert('로그인 후 사용이 가능합니다.');
      window.location.href = '/';
    }
  });

// 판매자가 거래를 수락해서 거래종료
function dealAccept(orderId) {
  console.log(orderId);
  axios
    .put(`http://localhost:3000/orders/deal/accept/${orderId}`)
    .then((res) => {
      // 응답처리
      alert('거래가 완료되었습니다. (메세지수정+랜더페이지 수정');
      // window.location.replace('http://localhost:3000/order');
    })
    .catch((error) => {
      // 예외처리
      alert(
        error.response?.data?.message ||
          error.response.data.errorMessage.details[0].message,
      );
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
}

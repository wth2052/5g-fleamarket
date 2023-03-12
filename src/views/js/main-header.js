function handleKeyPress(e) {
  if (e.keyCode === 13) {
    // 엔터 키를 누르면 검색 함수 호출
    productSearch();
  }
}

// 상품 검색
function productSearch() {
  const search = document.getElementById('search').value;
  console.log(search);

  axios
    .get(`http://localhost:3000/orders/productSearch?search=${search}`)
    .then((res) => {
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        const timeAgo = getTimeAgo(data[i].createdAt);

        // 검색어 배경색 적용
        const title = data[i].title.replace(
          new RegExp(`(${search})`, 'gi'),
          '<span style="background-color: yellow">$1</span>',
        );

        temp += `
         <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
              <div class="col-md-9">
                <h3>${title}</h3></br>
                <h4>${data[i].price}원</h4>  
                <h6>${timeAgo}</h6>
                <span>조회: ${data[i].viewCount}회</span>
                <span style="float: right;">🎯 ${data[i].dealCount} ❤${data[i].likes}</span>
              </div>
            </div>
          </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      alert(error.response.data.message);
      window.location.reload();
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

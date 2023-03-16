axios
  .get('http://localhost:3000/productss/view')
  .then((res) => {
    console.log(res);
    let data = res.data;
    let products = data.products;
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < products.length; i++) {
        const timeAgo = getTimeAgo(products[i].updatedAt);
        temp += `
                    <div class="container-fluid" onclick="location.href='/productss/view/${products[i].id}'" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${products[i].images[0].imagePath}" alt="image" 
                        style="width: 100%; height: 150px; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${products[i].title}</h3>
                <h4>${products[i].price}원</h4>
                <h6>${timeAgo}</h6>
                <span>조회: ${products[i].viewCount}회</span>
                <br>
                <span style="float: right;">🎯 ${products[i].dealCount} ❤ ${products[i].likes}</span>
            </div>
        </div>
      </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    }
  })
  .catch((error) => {
    console.log(error);
    let temp = '';
    temp += `
                    <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="image" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>메인페이지</h3>
                <h4>아직 ㅁㄴㅇㄻㄴㅇㄹ 전입니다.</h4>
                <p>asdfasdfasf</p>
                <span>asdfasdfasf</span>
                <span></span>
            </div>
        </div>
      </div>`;
    document.getElementById('bb').innerHTML = temp;
  });
